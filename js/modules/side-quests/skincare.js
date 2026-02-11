// Radiant Skincare Logic

let selectedSkinType = null;

window.selectSkinType = function(btn, type) {
    selectedSkinType = type;
   
    // Visual feedback
    const buttons = btn.parentElement.querySelectorAll('.quest-option-btn');
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
};

window.generateSkincare = function() {
    const concern = document.getElementById('skin-concern').value;
    const resultDiv = document.getElementById('skincare-result');
    
    if (!selectedSkinType) {
        const errorMsg = window.getTranslation('side_quests.messages.error_skin_type', "Veuillez sélectionner votre type de peau.");
        resultDiv.innerHTML = `<p style="color: #ff3b30;">${errorMsg}</p>`;
        resultDiv.classList.add('visible');
        return;
    }
    
    resultDiv.classList.remove('visible');
    
    window.simulateLoading(resultDiv, () => {
        // ROUTINE VISAGE 
        let routineKey = `side_quests.beauty.radiant.results.routines.${selectedSkinType}`;
        let adviceKey = `side_quests.beauty.radiant.results.advice.${selectedSkinType}`;
        
        // Fetch raw string
        let routineRaw = window.getTranslation(routineKey, window.getTranslation('side_quests.beauty.radiant.results.routines.default'));
        
        // Split by '|' to make a list
        let routineSteps = routineRaw.split('|').map(s => s.trim());
        let routineHtml = `<ul style="text-align:left; margin-bottom:15px; padding-left: 20px;">` + 
                          routineSteps.map(step => `<li style="margin-bottom:8px;">${step}</li>`).join('') + 
                          `</ul>`;

        let advice = window.getTranslation(adviceKey, "");

        // CONCERNS LOGIC 
        let concernHtml = "";
        const concernInput = concern ? concern.toLowerCase() : "";
        let concernData = null;
        const concernDB = window.getTranslation('side_quests.beauty.radiant.results.concerns');

        if (concernInput && concernDB) {
            let key = null;
            if (concernInput.includes('acn') || concernInput.includes('bouton') || concernInput.includes('pimple')) key = 'acne';
            else if (concernInput.includes('ag') || concernInput.includes('rid') || concernInput.includes('wrinkle') || concernInput.includes('old')) key = 'aging';
            else if (concernInput.includes('teint') || concernInput.includes('dull') || concernInput.includes('eclat') || concernInput.includes('bright')) key = 'dullness';
            else if (concernInput.includes('sec') || concernInput.includes('dry') || concernInput.includes('peau') || concernInput.includes('tiraille')) key = 'dry';
            else if (concernInput.includes('sensi') || concernInput.includes('rouge') || concernInput.includes('red')) key = 'sensitive';
            else if (concernInput.includes('pigment') || concernInput.includes('tache') || concernInput.includes('spot') || concernInput.includes('color') || concernInput.includes('datre') || concernInput.includes('dark')) key = 'pigmentation';

            if (key && concernDB[key]) {
                concernData = concernDB[key];
            }
        }

        if (concernData) {
            const labelBonus = window.getTranslation('side_quests.beauty.radiant.results.labels.bonus', 'Bonus :');
            const labelAdvice = window.getTranslation('side_quests.beauty.radiant.results.labels.advice', 'Conseil :');
            const labelProducts = window.getTranslation('side_quests.beauty.radiant.results.labels.key_products', 'Produits clés :');

            concernHtml = `
                <div style="margin-top: 20px; background: rgba(var(--accent-rgb), 0.1); padding: 10px; border-radius: 8px;">
                    <h5 style="margin: 0 0 5px 0; color: var(--accent);">${labelBonus} ${concern}</h5>
                    <p style="font-size: 0.9rem; margin-bottom: 5px;"><strong>${labelAdvice}</strong> ${concernData.advice}</p>
                    <p style="font-size: 0.9rem; margin: 0;"><strong>${labelProducts}</strong> ${concernData.products}</p>
                </div>
            `;
        } else if (concern) {
             // Generic fallback if concern not matched
             const bonusTemplate = window.getTranslation('side_quests.beauty.radiant.results.bonus_text', "Bonus pour \"{0}\" : Ajoutez un actif ciblé.");
             concernHtml = `<p style="margin-top:15px; font-size:0.9rem;"><strong>${bonusTemplate.replace('{0}', concern)}</strong></p>`;
        }

        // HANDS & FEET 
        let handsFeetHtml = "";
        const handsFeetDB = window.getTranslation('side_quests.beauty.radiant.results.hands_feet');
        if (handsFeetDB && handsFeetDB[selectedSkinType]) {
            const data = handsFeetDB[selectedSkinType];
            const title = handsFeetDB.title || "Soins Mains & Pieds";
            const intro = handsFeetDB.intro || "";
            
            const labelHands = window.getTranslation('side_quests.beauty.radiant.results.labels.hands', 'Mains');
            const labelFeet = window.getTranslation('side_quests.beauty.radiant.results.labels.feet', 'Pieds');

            const handsList = data.hands.map(item => `<li>${item}</li>`).join('');
            const feetList = data.feet.map(item => `<li>${item}</li>`).join('');

            handsFeetHtml = `
                <hr style="border: 0; border-top: 1px dashed rgba(255,255,255,0.2); margin: 20px 0;">
                <h4 style="margin-top: 0; color: var(--accent-secondary);">${title}</h4>
                <p style="font-size: 0.9rem; margin-bottom: 10px;">${intro}</p>
                <div style="display: flex; flex-wrap: wrap; gap: 20px;">
                    <div style="flex: 1; min-width: 200px;">
                        <h5 style="margin-bottom: 5px;">${labelHands}</h5>
                        <ul style="padding-left: 20px; font-size: 0.85rem; color: var(--text-light);">${handsList}</ul>
                    </div>
                    <div style="flex: 1; min-width: 200px;">
                        <h5 style="margin-bottom: 5px;">${labelFeet}</h5>
                        <ul style="padding-left: 20px; font-size: 0.85rem; color: var(--text-light);">${feetList}</ul>
                    </div>
                </div>
            `;
        }

        const title = window.getTranslation('side_quests.beauty.radiant.results.title', "Votre Routine Personnalisée");
        const proTip = window.getTranslation('side_quests.beauty.radiant.results.pro_tip', "Conseil Pro :");

        resultDiv.innerHTML = `
            <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 15px; border-left: 4px solid var(--accent);">
                <h3 style="margin-top: 0; color: var(--accent); font-size: 1.3rem;">${title}</h3>
                
                ${routineHtml}
                
                <p style="font-size: 0.95rem; color: var(--text-light); background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px;">
                    💡 <em>${proTip} ${advice}</em>
                </p>

                ${concernHtml}
                ${handsFeetHtml}
            </div>
        `;
        resultDiv.classList.add('visible');
    });
};

