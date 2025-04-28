import { levels, characterExamples, allKeyboardChars } from './levelsData.js';
import { addScore, resetScore, checkReward } from './pointsManager.js';

// --- DOM Elements (Declare in module scope) ---
let challengeDisplay, userInput, submitButton, feedbackText, emojiDisplay, puppyCage,
    cageStateText, nextButton, puppyIcon, levelNameDisplay,
    challengeInstruction, repeatSoundButton, virtualKeyboardContainer;
let levelButtons = []; // To store references to level buttons

// --- Game State ---
let currentLevelKey = 'level1_visual'; // Initial level
let currentLevel = levels[currentLevelKey];
let currentContent = currentLevel.content;
let currentMode = currentLevel.mode;
let currentChallenge = '';
let isLocked = true;

// --- Speech Synthesis (Declare BEFORE usage in initGame) ---
const synth = window.speechSynthesis;
const speechSupported = synth && typeof SpeechSynthesisUtterance !== 'undefined';
let marathiVoice = null; // Variable to store the found Marathi voice

// Function to find a Marathi voice
function findMarathiVoice() {
    if (!speechSupported) return;

    // Use a Promise to handle the asynchronous nature of getVoices
    return new Promise((resolve) => {
        let voices = synth.getVoices();
        if (voices.length) {
            resolve(voices);
            return;
        }
        // If voices not loaded yet, wait for the voiceschanged event
        synth.onvoiceschanged = () => {
            voices = synth.getVoices();
            resolve(voices);
        };
    }).then(voices => {
        console.log("Available voices:", voices); // Log all available voices
        // Find a voice that supports 'mr-IN' or 'mr'
        marathiVoice = voices.find(voice => voice.lang === 'mr-IN' || voice.lang.startsWith('mr-'));

        if (marathiVoice) {
            console.log("Found Marathi voice:", marathiVoice.name, marathiVoice.lang);
        } else {
            console.warn("No specific Marathi (mr-IN) voice found. Using browser default for the language.");
            // Attempt to find any voice that might support Devanagari based on name (less reliable)
            marathiVoice = voices.find(voice => voice.name.toLowerCase().includes('devanagari') || voice.name.toLowerCase().includes('marathi'));
            if (marathiVoice) {
                 console.log("Found potential fallback voice by name:", marathiVoice.name, marathiVoice.lang);
            } else {
                 console.warn("Could not find any suitable fallback voice by name either.");
            }
        }
    }).catch(error => {
        console.error("Error getting speech voices:", error);
    });
}

// --- Speech Synthesis Function ---
function speakText(text, lang = 'mr-IN') {
    if (!speechSupported || !text || text === ' ' || text === 'Backspace') return;
    try {
        synth.cancel(); // Cancel previous speech first
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang; // Set the language code
        utterance.rate = 0.9;

        // Use the found Marathi voice if available
        if (marathiVoice) {
            utterance.voice = marathiVoice;
            console.log(`Using voice: ${marathiVoice.name} for lang: ${utterance.lang}`);
        } else {
            console.log(`Using default voice for lang: ${utterance.lang}`);
        }

        synth.speak(utterance);
    } catch (error) {
        console.error("Speech synthesis error:", error);
    }
}

// --- UI Update Functions (Define BEFORE usage) ---
function updateVisuals() {
    if (!puppyCage || !cageStateText || !nextButton || !puppyIcon || !emojiDisplay) return; // Check if elements exist

    if (isLocked) {
        puppyCage.classList.remove('cage-unlocked');
        puppyCage.classList.add('cage-locked');
        cageStateText.textContent = 'Locked 🔒';
        emojiDisplay.textContent = ''; // Clear emoji when locked
        nextButton.style.display = 'none';
        puppyIcon.style.animation = 'bounce 1.5s infinite ease-in-out';
    } else {
        puppyCage.classList.remove('cage-locked');
        puppyCage.classList.add('cage-unlocked');
        cageStateText.textContent = 'Free! 🎉';
        nextButton.style.display = 'inline-block';
        puppyIcon.style.animation = 'spin 1s linear';
        setTimeout(() => {
            if (!isLocked) puppyIcon.style.animation = 'none';
        }, 1000);
    }
}

function updateFeedback(message, color) {
    if (!feedbackText) return;
    feedbackText.textContent = message;
    feedbackText.style.color = color;
}

function updateEmoji(emojiChar) {
     if (!emojiDisplay) return;
     emojiDisplay.textContent = emojiChar;
}

function shakeInput() {
    if (!userInput) return;
    userInput.classList.add('shake');
    setTimeout(() => userInput.classList.remove('shake'), 500);
}

// --- Core Game Logic Function (Define BEFORE usage in listeners) ---
function checkAnswer(userAnswer) {
    if (!isLocked || !userAnswer) {
        if (!userAnswer) {
            updateFeedback('Please type your answer first!', '#ffcc00');
        }
        return;
    }

    if (userAnswer === currentChallenge) {
        const example = characterExamples[currentChallenge];
        let successMessage = 'Correct! Puppy is free!';
        let speechMessage = 'Correct!';

        if (example) {
            updateEmoji(example.emoji);
            successMessage = `Correct! ${currentChallenge} for ${example.word} ${example.emoji}`;
            speechMessage = `Correct! ${currentChallenge} for ${example.word}. Which means ${example.english}.`;
        } else {
            updateEmoji('✔️');
        }

        updateFeedback(successMessage, '#a0d468');
        isLocked = false;
        addScore(1); // Add points
        checkReward(); // Check if a reward threshold is met
        speakText(speechMessage);
        updateVisuals();
    } else {
        updateFeedback(`Not quite! Try again. You typed: ${userAnswer}`, '#ed5565');
        updateEmoji('');
        speakText('Try again');
        shakeInput();
    }
}

// --- Virtual Keyboard ---
function createVirtualKeyboard() {
    if (!virtualKeyboardContainer) {
        console.error("Virtual keyboard container not found! Cannot create keyboard.");
        return;
    }
    virtualKeyboardContainer.innerHTML = ''; // Clear previous buttons
    console.log("Attempting to create virtual keyboard in container:", virtualKeyboardContainer);

    if (allKeyboardChars && allKeyboardChars.length > 0) {
        allKeyboardChars.forEach(char => {
            const button = document.createElement('button');
            button.textContent = char;
            button.type = 'button';
            button.classList.add('marathi-text');

            button.addEventListener('click', () => {
                if (!userInput) return;
                if (char === 'Backspace') {
                    userInput.value = userInput.value.slice(0, -1);
                } else if (char === ' ') {
                    userInput.value += ' ';
                } else {
                    userInput.value += char;
                }
                speakText(char); // Speak character on virtual keyboard press
                userInput.focus(); // Keep focus on the input field
            });

            virtualKeyboardContainer.appendChild(button);
        });
        console.log("Virtual keyboard buttons created.");
        // Ensure the container is visible using its intended display style
        virtualKeyboardContainer.style.display = 'flex'; // Use 'flex' as defined in CSS
        console.log("Virtual keyboard container display set to 'flex'.");
    } else {
        console.error("Keyboard character data (allKeyboardChars) is missing or empty.");
    }
}

// --- Event Listener Setup ---
function setupEventListeners() {
    if (submitButton) {
        submitButton.addEventListener('click', () => {
            if (userInput) checkAnswer(userInput.value.trim());
        });
    }

    if (userInput) {
        userInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                checkAnswer(userInput.value.trim());
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            selectNewChallenge(); // Load the next challenge within the current level
        });
    }

    if (repeatSoundButton) {
        repeatSoundButton.addEventListener('click', () => {
            speakText(currentChallenge); // Speak the current challenge character again
            if (userInput) userInput.focus();
        });
    }

    // Add listeners for level navigation buttons
    levelButtons.forEach(button => {
        button.addEventListener('click', () => {
            const levelKey = button.dataset.level;
            if (levelKey) {
                loadLevel(levelKey);
            }
        });
    });
}

// --- Core Game Functions ---
function selectNewChallenge() {
    const currentLevelContent = currentContent || []; // Use currentContent from game state
    if (currentLevelContent.length === 0) {
         console.error("No content for current level:", currentLevelKey);
         updateFeedback("Error: No characters loaded for this level.", "#ed5565");
         return; // Stop if no content
    }
    const randomIndex = Math.floor(Math.random() * currentLevelContent.length);
    currentChallenge = currentLevelContent[randomIndex];

    if (userInput) userInput.value = '';
    updateFeedback('', '#ffeb99'); // Clear feedback text, reset color
    updateEmoji(''); // Clear emoji display
    isLocked = true;

    let instruction = 'Error loading instruction!'; // Default error instruction
    let speechPrompt = '';

    // Update challenge display and instruction based on mode
    if (currentMode === 'visual') {
        if (challengeDisplay) {
            challengeDisplay.style.display = 'inline-block'; // Ensure it's visible
            challengeDisplay.textContent = currentChallenge;
            console.log("Visual Mode: Displaying", currentChallenge);
        } else {
            console.error("Challenge display element not found!");
        }
        instruction = "Type the character you see:";
        speechPrompt = `Type the character: ${currentChallenge}`;
        if (repeatSoundButton) {
             repeatSoundButton.style.display = 'inline-block';
             console.log("Repeat button should be visible");
        } else {
             console.error("Repeat sound button element not found!");
        }

    } else { // audio mode
        if (challengeDisplay) {
            challengeDisplay.style.display = 'none'; // Ensure it's hidden
            challengeDisplay.textContent = '';
        } else {
            console.error("Challenge display element not found!");
        }
        instruction = "Listen and type the character:";
        speechPrompt = currentChallenge;
        if (repeatSoundButton) {
             repeatSoundButton.style.display = 'inline-block';
             console.log("Repeat button should be visible");
        } else {
             console.error("Repeat sound button element not found!");
        }
    }

    if (challengeInstruction) {
        challengeInstruction.textContent = instruction;
        console.log("Instruction set to:", instruction);
    } else {
         console.error("Challenge instruction element not found!");
    }

    updateVisuals();
    setTimeout(() => {
        speakText(speechPrompt);
        console.log("Attempting to speak:", speechPrompt);
    }, 100);
}

export function loadLevel(levelKey) {
    if (!levels[levelKey]) {
        console.error("Level not found:", levelKey);
        return;
    }
    currentLevelKey = levelKey;
    currentLevel = levels[currentLevelKey];
    currentContent = currentLevel.content;
    currentMode = currentLevel.mode;

    if (levelNameDisplay) levelNameDisplay.textContent = currentLevel.name;

    levelButtons.forEach(button => {
        if (button.dataset.level === levelKey) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    resetScore(); // Reset score when changing levels
    selectNewChallenge(); // Load the first challenge for the new level
}

// --- Initialization ---
export async function initGame() { // Make initGame async
    challengeDisplay = document.getElementById('challenge-display');
    userInput = document.getElementById('user-input');
    submitButton = document.getElementById('submit-button');
    feedbackText = document.getElementById('feedback-text');
    emojiDisplay = document.getElementById('emoji-display');
    puppyCage = document.getElementById('puppy-cage');
    cageStateText = document.getElementById('cage-state-text');
    nextButton = document.getElementById('next-button');
    puppyIcon = document.getElementById('puppy-icon');
    levelNameDisplay = document.getElementById('level-name');
    challengeInstruction = document.getElementById('challenge-instruction');
    repeatSoundButton = document.getElementById('repeat-sound-button');
    virtualKeyboardContainer = document.getElementById('virtual-keyboard');
    levelButtons = document.querySelectorAll('#level-navigation .level-button');

    if (!virtualKeyboardContainer) console.error("Initialization Error: Virtual keyboard container ('virtual-keyboard') missing!");
    if (!challengeInstruction) console.error("Initialization Error: Challenge instruction element ('challenge-instruction') missing!");
    if (!challengeDisplay) console.error("Initialization Error: Challenge display element ('challenge-display') missing!");
    if (!userInput) console.error("Initialization Error: User input element missing!");
    if (!repeatSoundButton) console.error("Initialization Error: Repeat sound button element ('repeat-sound-button') missing!");

    if (!speechSupported) {
        console.warn("Browser does not support Speech Synthesis. Audio features disabled.");
        if(repeatSoundButton) repeatSoundButton.disabled = true;
    } else {
        // Wait for voices to be potentially found
        await findMarathiVoice(); // Use await since findMarathiVoice now returns a Promise
    }

    createVirtualKeyboard();

    if (virtualKeyboardContainer && virtualKeyboardContainer.children.length > 0) {
        console.log(`Virtual keyboard container has ${virtualKeyboardContainer.children.length} buttons.`);
        virtualKeyboardContainer.style.border = "2px solid lime";
    } else if (virtualKeyboardContainer) {
        console.error("Virtual keyboard container exists, but has NO child buttons after createVirtualKeyboard call.");
        virtualKeyboardContainer.style.border = "2px solid orange";
    }

    setupEventListeners();
    loadLevel(currentLevelKey);

    console.log("Game Initialized");
}
