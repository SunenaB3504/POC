// --- Configuration & Content ---
const levels = {
    level1: {
        name: "Alphabets (Vowels)",
        content: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ'] // Start with vowels
        // Add more consonants later: 'क', 'ख', 'ग', ...
    },
    // Define level2, level3 etc. later
};

// Example words and emojis for vowels
const characterExamples = {
    'अ': { emoji: '🍍', word: 'अननस', english: 'Pineapple' },
    'आ': { emoji: '🚂', word: 'आगगाडी', english: 'Train' },
    'इ': { emoji: '🏠', word: 'इमारत', english: 'Building' },
    'ई': { emoji: '🍋', word: 'इडलिंबू', english: 'Lemon' },
    'उ': { emoji: '🐪', word: 'उंट', english: 'Camel' },
    'ऊ': { emoji: '🧶', word: 'ऊस', english: 'Sugarcane' },
    'ए': { emoji: '👠', word: 'एडका', english: 'Ram' }, // Using proxy emoji
    'ऐ': { emoji: '👓', word: 'ऐनक', english: 'Spectacles' },
    'ओ': { emoji: '👄', word: 'ओठ', english: 'Lips' },
    'औ': { emoji: '💊', word: 'औषध', english: 'Medicine' }
    // Add more for consonants and other characters as needed
};

// --- Game State ---
let currentLevelKey = 'level1';
let currentContent = levels[currentLevelKey].content;
let currentChallengeIndex = 0;
let currentChallenge = '';
let score = 0; // Optional: Track score
let isLocked = true;

// --- DOM Elements ---
const challengeDisplay = document.getElementById('challenge-display');
const userInput = document.getElementById('user-input');
const submitButton = document.getElementById('submit-button');
const feedbackText = document.getElementById('feedback-text');
const puppyCage = document.getElementById('puppy-cage');
const cageStateText = document.getElementById('cage-state-text');
const nextButton = document.getElementById('next-button');
const virtualKeyboardContainer = document.getElementById('virtual-keyboard');
const puppyIcon = document.getElementById('puppy-icon'); // Get reference to the puppy icon in the title
const repeatSoundButton = document.getElementById('repeat-sound-button'); // Get the new button
const emojiDisplay = document.getElementById('emoji-display'); // Get the new emoji display element

// --- Character Set (Simplified for POC) ---
const vowels = ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'];
const consonants = [
    'क', 'ख', 'ग', 'घ', 'ङ',
    'च', 'छ', 'ज', 'झ', 'ञ',
    'ट', 'ठ', 'ड', 'ढ', 'ण',
    'त', 'थ', 'द', 'ध', 'न',
    'प', 'फ', 'ब', 'भ', 'म',
    'य', 'र', 'ल', 'व', 'श',
    'ष', 'स', 'ह', 'ळ', 'क्ष', 'ज्ञ'
];
const matras = ['ा', 'ि', 'ी', 'ु', 'ू', 'ृ', 'े', 'ै', 'ो', 'ौ', 'ं', 'ः', '्'];
const numerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
const others = [' ', 'Backspace'];

const allChars = [...vowels, ...consonants, ...matras, ...numerals, ...others];
const allKeyboardChars = [...vowels, ...consonants, ...matras, ...numerals, ' ', 'Backspace']; // Include space and backspace for keyboard

// --- Speech Synthesis ---
const synth = window.speechSynthesis;
const speechSupported = synth && typeof SpeechSynthesisUtterance !== 'undefined';
if (!speechSupported) {
    console.warn("Browser does not support Speech Synthesis.");
}

function speakText(text, lang = 'mr-IN') {
    if (!speechSupported || !text || text === ' ' || text === 'Backspace') return;
    try {
        synth.cancel(); // Cancel previous speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.9; // Slightly slower for clarity
        synth.speak(utterance);
    } catch (error) {
        console.error("Speech synthesis error:", error);
    }
}

// --- Game Functions ---
function selectNewChallenge() {
    const currentLevelContent = levels[currentLevelKey]?.content || vowels; // Fallback to vowels if level not found
    const randomIndex = Math.floor(Math.random() * currentLevelContent.length);
    currentChallenge = currentLevelContent[randomIndex];

    userInput.value = ''; // Clear previous input
    feedbackText.textContent = ''; // Clear feedback
    emojiDisplay.textContent = ''; // Clear emoji display
    isLocked = true; // Lock the cage for the new challenge
    updateVisuals();
    speakText(currentChallenge); // Speak only the character
}

function updateVisuals() {
    if (isLocked) {
        puppyCage.classList.remove('cage-unlocked');
        puppyCage.classList.add('cage-locked');
        cageStateText.textContent = 'Locked 🔒';
        emojiDisplay.textContent = ''; // Ensure emoji is cleared when locked/resetting
        nextButton.style.display = 'none'; // Hide next button when locked
        puppyIcon.style.animation = 'bounce 1.5s infinite ease-in-out'; // Restore bounce if stopped
    } else {
        puppyCage.classList.remove('cage-locked');
        puppyCage.classList.add('cage-unlocked');
        cageStateText.textContent = 'Free! 🎉';
        nextButton.style.display = 'inline-block'; // Show next button when unlocked
        puppyIcon.style.animation = 'spin 1s linear'; // Add a spin animation on success
        setTimeout(() => {
            if (!isLocked) puppyIcon.style.animation = 'none'; // Stop spinning if still unlocked
        }, 1000); // Match animation duration
    }
}

function checkAnswer() {
    const userAnswer = userInput.value.trim();

    if (!isLocked || !userAnswer) {
        if (!userAnswer) {
            feedbackText.textContent = 'Please type the character first!';
            feedbackText.style.color = '#ffcc00'; // Warning color
        }
        return;
    }

    if (userAnswer === currentChallenge) {
        const example = characterExamples[currentChallenge];
        let successMessage = 'Correct! Puppy is free!';
        let speechMessage = 'Correct!';

        if (example) {
            emojiDisplay.textContent = example.emoji; // Show the emoji
            successMessage = `Correct! ${currentChallenge} for ${example.word} ${example.emoji}`;
            speechMessage = `Correct! ${currentChallenge} for ${example.word}. Which means ${example.english}.`;
        } else {
            emojiDisplay.textContent = '✔️'; // Fallback checkmark if no example found
        }

        feedbackText.textContent = successMessage;
        feedbackText.style.color = '#a0d468'; // Success color (light green)
        isLocked = false; // Unlock the cage
        score++; // Increment score (optional)
        speakText(speechMessage); // Speak the success message with the word and meaning
        updateVisuals(); // Update cage visuals and show next button
    } else {
        feedbackText.textContent = `Not quite! Try again. You typed: ${userAnswer}`;
        feedbackText.style.color = '#ed5565'; // Error color (reddish)
        emojiDisplay.textContent = ''; // Clear emoji on wrong answer
        speakText('Try again');
        userInput.classList.add('shake');
        setTimeout(() => userInput.classList.remove('shake'), 500);
    }
}

// --- Virtual Keyboard ---
function createVirtualKeyboard() {
    virtualKeyboardContainer.innerHTML = ''; // Clear previous buttons

    allKeyboardChars.forEach(char => {
        const button = document.createElement('button');
        button.textContent = char;
        button.type = 'button';
        button.classList.add('marathi-text'); // Ensure font is applied

        button.addEventListener('click', () => {
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
}

// --- Event Listeners ---
submitButton.addEventListener('click', checkAnswer);

userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission
        checkAnswer();
    }
});

nextButton.addEventListener('click', () => {
    selectNewChallenge(); // Load the next challenge
});

repeatSoundButton.addEventListener('click', () => {
    speakText(currentChallenge); // Speak the current challenge character again
    userInput.focus(); // Keep focus on input
});

// --- Initialization ---
createVirtualKeyboard();
selectNewChallenge(); // Start the first challenge
updateVisuals(); // Set initial visual state
