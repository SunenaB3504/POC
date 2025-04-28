// Import content from level-specific files
import { content as level1Content } from './level1Data.js';
import { content as level2Content } from './level2Data.js';
import { content as level3Content } from './level3Data.js';
// import { content as level4Content } from './level4Data.js'; // Add imports as you create files
// import { content as level5Content } from './level5Data.js';
// import { content as level6Content } from './level6Data.js';
// import { content as level7Content } from './level7Data.js';
// import { content as level8Content } from './level8Data.js';

export const levels = {
    level1_visual: {
        name: "Level 1: Vowels (Visual)",
        content: level1Content, // Reference imported content
        mode: 'visual'
    },
    level1_audio: {
        name: "Level 1: Vowels (Audio)",
        content: level1Content, // Reference imported content
        mode: 'audio'
    },
    level2_visual: {
        name: "Level 2: Consonants Pt.1 (Visual)",
        content: level2Content,
        mode: 'visual'
    },
    level2_audio: {
        name: "Level 2: Consonants Pt.1 (Audio)",
        content: level2Content,
        mode: 'audio'
    },
    level3_visual: {
        name: "Level 3: Consonants Pt.2 (Visual)",
        content: level3Content,
        mode: 'visual'
    },
    level3_audio: {
        name: "Level 3: Consonants Pt.2 (Audio)",
        content: level3Content,
        mode: 'audio'
    },
    // Define levels 4 through 8 similarly, referencing their imported content
    // level4_visual: { name: "...", content: level4Content, mode: 'visual'},
    // level4_audio: { name: "...", content: level4Content, mode: 'audio'},
    // ... and so on
};

// Centralized examples (expand this significantly)
export const characterExamples = {
    // Level 1 Vowels
    'अ': { emoji: '🍍', word: 'अननस', english: 'Pineapple' },
    'आ': { emoji: '🚂', word: 'आगगाडी', english: 'Train' },
    'इ': { emoji: '🏠', word: 'इमारत', english: 'Building' },
    'ई': { emoji: '🍋', word: 'इडलिंबू', english: 'Lemon' },
    'उ': { emoji: '🐪', word: 'उंट', english: 'Camel' },
    'ऊ': { emoji: '🧶', word: 'ऊस', english: 'Sugarcane' },
    'ए': { emoji: '👠', word: 'एडका', english: 'Ram' },
    'ऐ': { emoji: '👓', word: 'ऐनक', english: 'Spectacles' },
    'ओ': { emoji: '👄', word: 'ओठ', english: 'Lips' },
    'औ': { emoji: '💊', word: 'औषध', english: 'Medicine' },

    // Level 2 Consonants (Part 1: क to म)
    'क': { emoji: '🪁', word: 'कमळ', english: 'Lotus' },
    'ख': { emoji: '🪟', word: 'खिडकी', english: 'Window' },
    'ग': { emoji: '🐘', word: 'गणपती', english: 'Ganapati' },
    'घ': { emoji: '🔔', word: 'घंटा', english: 'Bell' },
    'ङ': { emoji: '❓', word: 'वाङ्मय', english: 'Literature' },
    'च': { emoji: '🥄', word: 'चमचा', english: 'Spoon' },
    'छ': { emoji: '☂️', word: 'छत्री', english: 'Umbrella' },
    'ज': { emoji: '🚢', word: 'जहाज', english: 'Ship' },
    'झ': { emoji: '🌳', word: 'झाड', english: 'Tree' },
    'ञ': { emoji: '❓', word: 'ज्ञान', english: 'Knowledge' },
    'ट': { emoji: '🍅', word: 'टोमॅटो', english: 'Tomato' },
    'ठ': { emoji: '🔨', word: 'ठसा', english: 'Stamp/Impression' },
    'ड': { emoji: '🐸', word: 'डोंगर', english: 'Mountain' },
    'ढ': { emoji: '☁️', word: 'ढग', english: 'Cloud' },
    'ण': { emoji: '❓', word: 'बाण', english: 'Arrow' },
    'त': { emoji: '🗡️', word: 'तलवार', english: 'Sword' },
    'थ': { emoji: '🐦', word: 'थवा', english: 'Flock (of birds)' },
    'द': { emoji: '🚪', word: 'दार', english: 'Door' },
    'ध': { emoji: '🏹', word: 'धनुष्य', english: 'Bow' },
    'न': { emoji: '👃', word: 'नाक', english: 'Nose' },
    'प': { emoji: '🪁', word: 'पतंग', english: 'Kite' },
    'फ': { emoji: '🍓', word: 'फळ', english: 'Fruit' },
    'ब': { emoji: '🦆', word: 'बदक', english: 'Duck' },
    'भ': { emoji: '🐝', word: 'भटजी', english: 'Priest' },
    'म': { emoji: '🐒', word: 'माकड', english: 'Monkey' },

    // Add examples for Level 3 (य to ज्ञ) and other levels later
    'य': { emoji: ' यज्ञ', word: 'यज्ञ', english: 'Sacrifice/Ritual' },
};

// Shared character sets for keyboard generation
export const vowels = ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'];
export const consonants = [
    'क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ', 'ट', 'ठ', 'ड', 'ढ', 'ण',
    'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श',
    'ष', 'स', 'ह', 'ळ', 'क्ष', 'ज्ञ'
];
export const matras = ['ा', 'ि', 'ी', 'ु', 'ू', 'ृ', 'े', 'ै', 'ो', 'ौ', 'ं', 'ः', '्'];
export const numerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

// Keyboard characters can be dynamically generated based on needed levels, or kept static
export const allKeyboardChars = [...vowels, ...consonants, ...matras, ...numerals, ' ', 'Backspace'];

