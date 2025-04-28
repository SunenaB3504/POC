import { levels, characterExamples, allKeyboardChars } from './levelsData.js';
import { addScore, resetScore, checkReward } from './pointsManager.js';

// --- DOM Elements (Declare in module scope) ---
let challengeDisplay, userInput, submitButton, feedbackText, emojiDisplay, puppyCage,
    cageStateText, nextButton, puppyIcon, levelNameDisplay,
    challengeInstruction, repeatSoundButton, virtualKeyboardContainer, skipButton; // Add skipButton
let levelButtons = []; // To store references to level buttons

// --- Game State ---
let currentLevelKey = 'level1_visual'; // Initial level
let currentLevel = levels[currentLevelKey];
let currentContent = currentLevel.content;
let currentMode = currentLevel.mode;
let currentChallenge = '';
let isLocked = true;

// --- Speech Synthesis & Audio ---
const synth = window.speechSynthesis;
const speechSupported = synth && typeof SpeechSynthesisUtterance !== 'undefined';
let marathiVoice = null; // Variable to store the found Marathi voice
let currentAudioPlayer = null; // To manage audio playback

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

// --- Speech Synthesis / Audio Playback Function ---
function speakText(text, lang = 'mr-IN') {
    // Stop any currently playing pre-recorded audio or TTS
    if (currentAudioPlayer) {
        currentAudioPlayer.pause();
        currentAudioPlayer.currentTime = 0; // Reset time
        currentAudioPlayer = null;
    }
    if (speechSupported) {
        synth.cancel();
    }

    // Check if the text corresponds to a character with pre-recorded audio
    const exampleData = characterExamples[text];
    const audioSource = exampleData?.audioSrc; // Get audio path if available

    if (audioSource) {
        // Play pre-recorded audio
        try {
            console.log(`Playing pre-recorded audio: ${audioSource}`);
            currentAudioPlayer = new Audio(audioSource);
            currentAudioPlayer.play().catch(e => {
                console.error(`Error playing audio ${audioSource}:`, e);
                // Fallback to TTS if audio playback fails
                speakViaTTS(text, lang);
            });
            // Clear the player reference once playback finishes
            currentAudioPlayer.onended = () => { currentAudioPlayer = null; };
        } catch (error) {
            console.error(`Failed to create or play audio ${audioSource}:`, error);
            speakViaTTS(text, lang); // Fallback to TTS on error
        }
    } else {
        // Use TTS if no pre-recorded audio is specified or found
        speakViaTTS(text, lang);
    }
}

// Helper function for TTS fallback
function speakViaTTS(text, lang) {
    if (!speechSupported || !text || text === ' ' || text === 'Backspace') return;
    try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.9;

        if (marathiVoice) {
            utterance.voice = marathiVoice;
        }
        // Clear player reference when TTS starts, in case audio failed mid-play
        utterance.onstart = () => { currentAudioPlayer = null; };
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
        // Show skip button only if it's an audio challenge and locked
        if (skipButton && currentMode === 'audio') {
             skipButton.style.display = 'inline-block';
        } else if (skipButton) {
             skipButton.style.display = 'none';
        }
    } else {
        puppyCage.classList.remove('cage-locked');
        puppyCage.classList.add('cage-unlocked');
        cageStateText.textContent = 'Free! 🎉';
        nextButton.style.display = 'inline-block';
        puppyIcon.style.animation = 'spin 1s linear';
        setTimeout(() => {
            if (!isLocked) puppyIcon.style.animation = 'none';
        }, 1000);
        // Hide skip button when unlocked (Next button is shown)
        if (skipButton) {
            skipButton.style.display = 'none';
        }
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
        let successMessage = 'Correct! Puppy is free!'; // Default success text
        let speechMessage = 'Correct!'; // Default speech if no example found

        if (example) {
            updateEmoji(example.emoji);
            // Update success message to include Marathi word, emoji, AND English meaning
            successMessage = `Correct! ${currentChallenge} for ${example.word} ${example.emoji} (${example.english})`;
            // Speech message already includes English
            speechMessage = `Correct! ${currentChallenge} for ${example.word}. Which means ${example.english}.`;
        } else {
            updateEmoji('✔️');
            // Keep default messages if no example/meaning found
        }

        // Update the feedback text displayed on screen
        updateFeedback(successMessage, '#a0d468'); // Use the updated successMessage
        isLocked = false;
        addScore(1); // Add points
        checkReward(); // Check if a reward threshold is met
        speakText(speechMessage);
        updateVisuals(); // updateVisuals will hide the skip button
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

    // Add listener for skip button
    if (skipButton) {
        skipButton.addEventListener('click', () => {
            console.log("Skip button clicked");
            updateFeedback('Challenge skipped.', '#ffcc00'); // Optional feedback
            selectNewChallenge(); // Load the next challenge directly
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

    // --- Features common to all levels ---
    if (userInput) userInput.value = ''; // Clear input field
    updateFeedback('', '#ffeb99'); // Clear visual feedback text
    updateEmoji(''); // Clear emoji display
    isLocked = true; // Lock cage for new challenge

    let instruction = 'Error loading instruction!'; // Default instruction text
    let speechPrompt = ''; // Default audio prompt

    // --- Mode-specific adjustments ---
    if (currentMode === 'visual') {
        // Show visual character if applicable (but user asked to exclude this part)
        if (challengeDisplay) {
            challengeDisplay.style.display = 'inline-block';
            challengeDisplay.textContent = currentChallenge;
        }
        // Set instruction text for visual mode
        instruction = "Type the character you see:";
        // Set audio prompt for visual mode
        speechPrompt = `Type the character: ${currentChallenge}`;
        // Ensure repeat button is visible
        if (repeatSoundButton) {
             repeatSoundButton.style.display = 'inline-block';
        }
        // Ensure skip button is hidden in visual mode
        if (skipButton) skipButton.style.display = 'none';

    } else { // audio mode
        // Hide visual character display
        if (challengeDisplay) {
            challengeDisplay.style.display = 'none';
            challengeDisplay.textContent = '';
        }
        // Set instruction text for audio mode
        instruction = "Listen and type the character:";
        // Set audio prompt for audio mode (just the challenge)
        speechPrompt = currentChallenge;
        // Ensure repeat button is visible
        if (repeatSoundButton) {
             repeatSoundButton.style.display = 'inline-block';
        }
        // Skip button visibility will be handled by updateVisuals based on isLocked
    }

    // --- Update UI elements common to all levels ---
    // Update the instruction text element
    if (challengeInstruction) {
        challengeInstruction.textContent = instruction;
    }
    // Update puppy cage visuals, next button visibility etc.
    updateVisuals();
    // Speak the initial audio prompt
    setTimeout(() => {
        speakText(speechPrompt);
    }, 100);

    // NOTE: Virtual Keyboard, Text Input Field, Feedback (in checkAnswer),
    // Points, and Rewards are handled elsewhere and apply to all levels.
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
    skipButton = document.getElementById('skip-button'); // Assign skip button
    levelButtons = document.querySelectorAll('#level-navigation .level-button');

    if (!virtualKeyboardContainer) console.error("Initialization Error: Virtual keyboard container ('virtual-keyboard') missing!");
    if (!challengeInstruction) console.error("Initialization Error: Challenge instruction element ('challenge-instruction') missing!");
    if (!challengeDisplay) console.error("Initialization Error: Challenge display element ('challenge-display') missing!");
    if (!userInput) console.error("Initialization Error: User input element missing!");
    if (!repeatSoundButton) console.error("Initialization Error: Repeat sound button element ('repeat-sound-button') missing!");
    if (!skipButton) console.error("Initialization Error: Skip button element ('skip-button') missing!");

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
