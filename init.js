import { initGame } from './gameLogic.js';

/**
 * Sets up the event listener to initialize the game
 * once the DOM is fully loaded.
 */
export function setupAppInitializer() {
    document.addEventListener('DOMContentLoaded', () => {
        console.log("DOM Loaded, attempting to initialize game...");
        try {
            initGame();
        } catch (error) {
            console.error("Error during game initialization:", error);
            // Optionally display an error message to the user on the page
            const body = document.querySelector('body');
            if (body) {
                const errorMsg = document.createElement('p');
                errorMsg.textContent = `FATAL ERROR: Could not initialize game. Check console. ${error.message}`;
                errorMsg.style.color = 'red';
                errorMsg.style.fontWeight = 'bold';
                errorMsg.style.padding = '20px';
                errorMsg.style.backgroundColor = 'white';
                body.prepend(errorMsg);
            }
        }
    });
}
