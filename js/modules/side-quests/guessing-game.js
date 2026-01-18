// AI Guessing Game Logic
// Range: 1 to 32 (5 questions max -> 2^5 = 32)

let guessingGameRange = { min: 1, max: 32 };
let guessingGameCurrentStep = 0;
let guessingGameMaxQuestions = 5;
let guessingGameIsActive = false;

window.startGuessingGame = function() {
    guessingGameRange = { min: 1, max: 32 };
    guessingGameCurrentStep = 0;
    guessingGameIsActive = true;
    
    const resultDiv = document.getElementById('guessing-game-result');
    const startBtn = document.getElementById('guessing-game-start-btn');
    const interactionArea = document.getElementById('guessing-game-interaction');
    
    startBtn.style.display = 'none';
    interactionArea.style.display = 'block';
    resultDiv.innerHTML = '';
    resultDiv.classList.remove('visible');
    
    // Initial Instruction
    const instruction = window.getTranslation('side_quests.science.guessing_game.instruction', "Pensez à un nombre entre 1 et 32.");
    const readyBtnText = window.getTranslation('side_quests.science.guessing_game.ready', "Je suis prêt");
    
    interactionArea.innerHTML = `
        <p style="margin-bottom: 15px; color: var(--text);">${instruction}</p>
        <button class="quest-btn" onclick="nextGuessStep()">${readyBtnText}</button>
    `;
};

window.nextGuessStep = function(response) {
    const interactionArea = document.getElementById('guessing-game-interaction');
    
    // Process response from previous step if any
    if (response !== undefined) {
        if (response === 'yes') {
            // Number is > mid
            // New range: [mid + 1, max]
            const mid = Math.floor((guessingGameRange.min + guessingGameRange.max) / 2);
            guessingGameRange.min = mid + 1;
        } else {
            // Number is <= mid
            // New range: [min, mid]
            const mid = Math.floor((guessingGameRange.min + guessingGameRange.max) / 2);
            guessingGameRange.max = mid;
        }
        guessingGameCurrentStep++;
    }
    
    // Check if found
    if (guessingGameRange.min === guessingGameRange.max) {
        finishGuessingGame(guessingGameRange.min);
        return;
    }
    
    // Generate Next Question
    // We ask: Is it > mid?
    const mid = Math.floor((guessingGameRange.min + guessingGameRange.max) / 2);
    
    const questionTemplate = window.getTranslation('side_quests.science.guessing_game.question', "Est-il strictement supérieur à {0} ?");
    const question = questionTemplate.replace('{0}', mid);
    
    const yesText = window.getTranslation('side_quests.science.guessing_game.yes', "Oui");
    const noText = window.getTranslation('side_quests.science.guessing_game.no', "Non");
    
    window.simulateLoading(interactionArea, () => {
        interactionArea.innerHTML = `
            <p style="margin-bottom: 15px; color: var(--accent); font-size: 1.1rem; font-weight: bold;">${question}</p>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button class="quest-btn" style="background: var(--accent); width: auto; padding: 10px 30px;" onclick="nextGuessStep('yes')">${yesText}</button>
                <button class="quest-btn" style="background: transparent; border: 1px solid var(--accent); color: var(--text); width: auto; padding: 10px 30px;" onclick="nextGuessStep('no')">${noText}</button>
            </div>
            <p style="margin-top: 10px; font-size: 0.8rem; color: var(--text-light); opacity: 0.7;">Question ${guessingGameCurrentStep + 1} / ${guessingGameMaxQuestions}</p>
        `;
    });
};

function finishGuessingGame(number) {
    const interactionArea = document.getElementById('guessing-game-interaction');
    const resultDiv = document.getElementById('guessing-game-result');
    const startBtn = document.getElementById('guessing-game-start-btn');
    
    interactionArea.style.display = 'none';
    interactionArea.innerHTML = ''; // Clear
    
    const resultTemplate = window.getTranslation('side_quests.science.guessing_game.result', "Votre nombre est {0} !");
    const resultText = resultTemplate.replace('{0}', number);
    const playAgainText = window.getTranslation('side_quests.science.guessing_game.play_again', "Rejouer");
    
    resultDiv.innerHTML = `
        <div style="text-align: center;">
            <h3 style="color: var(--accent); font-size: 1.5rem; margin-bottom: 10px;">🔮 ${resultText}</h3>
            <button class="quest-btn" onclick="startGuessingGame()" style="margin-top: 15px;">${playAgainText}</button>
        </div>
    `;
    resultDiv.classList.add('visible');
    resultDiv.style.display = 'block';
}
