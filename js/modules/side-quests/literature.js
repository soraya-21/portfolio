// Literature Tools: Quotes & Rhymes

window.generateQuote = function(category) {
    const resultDiv = document.getElementById('quote-result');
    
    window.simulateLoading(resultDiv, () => {
        // Fetch database from translations
        const quoteDB = window.getTranslation('side_quests.literature.quote.database');
        
        if (quoteDB && quoteDB[category] && quoteDB[category].length > 0) {
            const quotes = quoteDB[category];
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            // Handle both object structure {text, author} (from JSON) and simple string (fallback)
            const text = randomQuote.text || randomQuote;
            const author = randomQuote.author || "";
            
            resultDiv.innerHTML = `<blockquote style="font-style: italic; border-left: 3px solid var(--accent); padding-left: 10px; margin: 0;">"${text}" <br><span style="font-size:0.8em; opacity:0.8; font-style:normal;">— ${author}</span></blockquote>`;
        } else {
            const noQuoteMsg = window.getTranslation('side_quests.messages.no_quote', "Pas de citation disponible pour ce thème.");
            resultDiv.innerHTML = noQuoteMsg;
        }
    });
};

// Rhyme Generator (Simulated)
window.generateNaturePoem = function() {
    const input = document.getElementById('nature-input').value.trim().toLowerCase();
    const resultDiv = document.getElementById('nature-poem-result');
    
    if (!input) {
        resultDiv.innerHTML = `<span style="color: #ff3b30;">${window.getTranslation('side_quests.messages.error_rhyme_input', 'Veuillez entrer un thème ou un élément.')}</span>`;
        return;
    }

    window.simulateLoading(resultDiv, () => {
        const responses = window.getTranslation('side_quests.literature.rhyme.responses');
        let poem = "";

        // Check for specific keywords in the input (e.g., "ocean", "foret")
        // We need to map input to keys if possible, or just check inclusion
        let foundKey = null;
        if (responses) {
            for (const key of Object.keys(responses)) {
                if (key !== 'default' && input.includes(key)) {
                    foundKey = key;
                    break;
                }
            }
        }

        if (foundKey && responses[foundKey]) {
            poem = responses[foundKey];
        } else if (responses && responses.default && responses.default.length > 0) {
            // Pick a random default template
            const templates = responses.default;
            // Use a hash of the input to always get the same poem for the same word (pseudo-random)
            let hash = 0;
            for (let i = 0; i < input.length; i++) {
                hash = input.charCodeAt(i) + ((hash << 5) - hash);
            }
            const index = Math.abs(hash) % templates.length;
            poem = templates[index].replace(/\{0\}/g, input);
        } else {
            poem = "Le vent souffle mais les mots manquent...";
        }
        
        resultDiv.innerHTML = `<p style="line-height: 1.6; font-family: serif; font-size: 1.1rem;">${poem}</p>`;
    });
};
