let score = 0;

export function addScore(points = 1) {
    score += points;
    console.log("Score:", score); // For debugging
    // Update score display in UI if needed
}

export function getScore() {
    return score;
}

export function resetScore() {
    score = 0;
    console.log("Score reset");
    // Update score display in UI if needed
}

// Basic reward check example (can be expanded)
export function checkReward() {
    if (score > 0 && score % 10 === 0) {
        console.log(`Reward unlocked at ${score} points!`);
        // Trigger some visual reward indication
    }
}
