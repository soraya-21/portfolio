// Mock AI Logic for Side Quests

// 1. Landscape Translator
function generateLandscape() {
    const input = document.getElementById('landscape-input').value.toLowerCase();
    const resultDiv = document.getElementById('landscape-result');
    
    if (!input) return;

    // Construct a prompt for the AI image generator based on keywords
    let prompt = "abstract artistic landscape, dreamlike, 8k";
    
    if (input.includes('fatigué') || input.includes('calme') || input.includes('triste') || input.includes('seul')) {
        prompt = "misty mountain at twilight, blue and violet tones, peaceful, cinematic lighting, hyperrealistic, 4k, serenity";
    } else if (input.includes('déterminé') || input.includes('énergie') || input.includes('joie') || input.includes('heureux')) {
        prompt = "bright sunrise over a green valley, golden light piercing clouds, vibrant colors, hopeful, 8k, unreal engine, masterpiece";
    } else if (input.includes('colère') || input.includes('stress') || input.includes('énervé')) {
        prompt = "stormy ocean, dark clouds, dramatic waves, single ray of light breaking through, epic, matte painting, intense atmosphere";
    } else if (input.includes('amour') || input.includes('passion')) {
        prompt = "warm sunset over a flower field, pink and orange sky, romantic atmosphere, soft lighting, watercolor style";
    } else {
        // Fallback: use the input itself translated loosely or as abstract concept
        prompt = `surreal landscape representing ${input}, artistic, fantasy style, intricate details`;
    }

    // Encode the prompt for the URL
    const encodedPrompt = encodeURIComponent(prompt);
    // Use the reliable image.pollinations.ai endpoint directly
    const randomSeed = Math.floor(Math.random() * 10000);
    const imageSrc = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&seed=${randomSeed}&nologo=true`;

    simulateLoading(resultDiv, () => {
        resultDiv.innerHTML = `
            <strong>Vision générée :</strong><br>
            <div style="margin-top: 15px; border-radius: 12px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
                <img src="${imageSrc}" alt="Paysage généré par IA" style="width: 100%; height: auto; display: block; min-height: 200px; background: #eee;" loading="lazy">
            </div>
            <p style="font-size: 0.8rem; margin-top: 10px; opacity: 0.7;">Prompt: ${prompt}</p>
        `;
    });
}

// 2. Sylvothérapie
function generateTree() {
    const input = document.getElementById('tree-input').value.toLowerCase();
    const resultDiv = document.getElementById('tree-result');
    
    if (!input) return;

    let tree = "Le Pin Sylvestre";
    let reason = "pour la résilience.";
    let exercise = "Inspirez profondément en levant les bras, expirez en les baissant.";

    if (input.includes('stress') || input.includes('angoisse')) {
        tree = "Le Bouleau Blanc";
        reason = "symbole de renouveau et de purification.";
        exercise = "Exercice : 'La Respiration Purifiante' – Inspirez par le nez en 4 temps, bloquez 2 temps, expirez par la bouche comme si vous souffliez dans une paille en 6 temps.";
    } else if (input.includes('fatigue') || input.includes('épuisé')) {
        tree = "Le Chêne Robuste";
        reason = "pour sa force tranquille et son ancrage.";
        exercise = "Exercice : 'L'Ancrage' – Pieds nus (si possible), imaginez des racines partant de vos talons jusqu'au centre de la terre.";
    } else if (input.includes('colère') || input.includes('énervé')) {
        tree = "Le Saule Pleureur";
        reason = "pour accepter les émotions et laisser couler.";
        exercise = "Exercice : 'Le Relâchement' – Secouez doucement vos mains et vos épaules en expirant bruyamment.";
    }

    simulateLoading(resultDiv, () => {
        resultDiv.innerHTML = `<strong>Votre Allié : ${tree}</strong><br>Pourquoi : ${reason}<br><br><em>${exercise}</em>`;
    });
}

// 3. Playlist Generator
function generatePlaylist() {
    const input = document.getElementById('playlist-input').value.toLowerCase();
    const resultDiv = document.getElementById('playlist-result');
    
    if (!input) return;

    let structure = [
        "0-5 min : Intro Lo-Fi pour se mettre dans l'ambiance",
        "5-15 min : Rythme modéré (100 BPM) pour activer",
        "15-30 min : Flow continu (Deep House ou Jazz)",
        "30+ min : Redescente acoustique"
    ];

    if (input.includes('sport') || input.includes('énergie')) {
        structure = [
            "0-5 min : Échauffement Tribal (Percussions)",
            "5-20 min : Montée en puissance (High Tempo / Rock)",
            "20-40 min : Peak Performance (Drum & Bass)",
            "40+ min : Cool down (Ambient)"
        ];
    } else if (input.includes('dormir') || input.includes('nuit')) {
        structure = [
            "0-10 min : Piano minimaliste",
            "10-20 min : Sons de pluie et nappes synthétiques",
            "20+ min : Silence progressif (Bruit blanc)"
        ];
    }

    simulateLoading(resultDiv, () => {
        resultDiv.innerHTML = `<strong>Structure de Session :</strong><ul style='margin-top:10px; padding-left:20px;'>${structure.map(s => `<li>${s}</li>`).join('')}</ul>`;
    });
}

// 4. Lyrics Generator
let currentStyle = 'Rap';
function setLyricStyle(btn, style) {
    document.querySelectorAll('.quest-option-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentStyle = style;
}

function generateLyrics() {
    const input = document.getElementById('lyrics-input').value;
    const resultDiv = document.getElementById('lyrics-result');
    
    if (!input) return;

    let lyrics = "";
    
    if (currentStyle === 'Rap') {
        lyrics = `Yo, écoute ça...\n\n"${input}", c'est le message,\nDirect, pas de mirage.\nOn avance, on trace la route,\nSans jamais avoir de doute.\n\nYeah.`;
    } else if (currentStyle === 'Jazz') {
        lyrics = `(Piano doux...)\n\nOh, "${input}"...\nC'est comme une note bleue dans la nuit,\nUne mélodie qui s'enfuit.\nDoucement, le temps s'arrête,\nJuste pour nous, c'est la fête...`;
    } else {
        lyrics = `C'est une chanson pour toi,\nPour dire "${input}" tout bas.\nLa la la, la vie est belle,\nComme une hirondelle...`;
    }

    simulateLoading(resultDiv, () => {
        resultDiv.textContent = lyrics;
    });
}

// 4.5 Radiant Skincare Logic
let currentSkinType = 'Mixte'; // Default
function selectSkinType(btn, type) {
    // Reset buttons in the same container
    const container = btn.parentElement;
    container.querySelectorAll('.quest-option-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentSkinType = type;
}

function generateSkincare() {
    const concernsInput = document.getElementById('skin-concern').value.toLowerCase();
    const resultDiv = document.getElementById('skincare-result');
    
    // Logic Database
    const routines = {
        'Grasse': {
            cleanser: { type: "Gel nettoyant purifiant", product: "CeraVe Gel Moussant", usage: "Matin et soir. Faire mousser une noisette sur visage humide, insister sur la zone T, rincer." },
            toner: { type: "Tonique exfoliant BHA", product: "Paula's Choice 2% BHA", usage: "Le soir, 2-3 fois par semaine. Appliquer avec un coton ou les doigts sur peau sèche." },
            serum: { type: "Niacinamide 10% + Zinc", product: "The Ordinary Niacinamide 10% + Zinc 1%", usage: "Matin et soir avant la crème. Quelques gouttes sur tout le visage." },
            moisturizer: { type: "Gel-crème matifiant", product: "La Roche-Posay Effaclar Mat", usage: "Matin et soir. Appliquer sur l'ensemble du visage." },
            sunscreen: { type: "Fluide matifiant SPF 50", product: "La Roche-Posay Anthelios Oil Correct", usage: "Tous les matins, dernière étape. Renouveler si exposition prolongée." }
        },
        'Sèche': {
            cleanser: { type: "Lait ou Huile lavante", product: "CeraVe Crème Lavante Hydratante", usage: "Matin et soir. Masser doucement sur peau humide, rincer." },
            toner: { type: "Lotion hydratante", product: "Klairs Supple Preparation Facial Toner", usage: "Matin et soir. Tapoter sur le visage avec les mains." },
            serum: { type: "Acide Hyaluronique + B5", product: "The Ordinary Hyaluronic Acid 2% + B5", usage: "Matin et soir sur peau légèrement humide pour sceller l'hydratation." },
            moisturizer: { type: "Crème riche céramides", product: "CeraVe Baume Hydratant", usage: "Matin et soir. Appliquer généreusement." },
            sunscreen: { type: "Crème solaire hydratante", product: "Beauty of Joseon Relief Sun : Rice + Probiotics", usage: "Tous les matins. Ne pas oublier le cou." }
        },
        'Mixte': {
            cleanser: { type: "Mousse nettoyante douce", product: "Bioderma Créaline Gel Moussant", usage: "Matin et soir. Nettoyer en douceur sans agresser." },
            toner: { type: "Tonique équilibrant", product: "Thayers Witch Hazel Toner", usage: "Matin et soir. Appliquer avec un coton." },
            serum: { type: "Vitamine C (Matin)", product: "Garnier Sérum Vitamine C", usage: "Le matin pour l'éclat. Le soir, privilégier l'hydratation." },
            moisturizer: { type: "Émulsion légère", product: "La Roche-Posay Toleriane Sensitive Fluide", usage: "Matin et soir. Une petite quantité suffit." },
            sunscreen: { type: "Fluide invisible SPF 50", product: "La Roche-Posay Anthelios UVMune 400", usage: "Tous les matins. Texture fluide idéale sous le maquillage." }
        },
        'Sensible': {
            cleanser: { type: "Nettoyant sans savon", product: "La Roche-Posay Toleriane Dermo-Nettoyant", usage: "Matin et soir. Masser du bout des doigts, essuyer avec un coton ou rincer." },
            toner: { type: "Eau thermale", product: "Avène Eau Thermale Spray", usage: "Vaporiser à tout moment pour apaiser. Ne pas laisser sécher à l'air libre." },
            serum: { type: "Sérum apaisant", product: "La Roche-Posay Toleriane Ultra Dermallergo", usage: "Matin et soir quand la peau tiraille ou rougit." },
            moisturizer: { type: "Crème tolérance extrême", product: "Avène Tolérance Control Crème", usage: "Matin et soir. Formule minimaliste pour éviter les réactions." },
            sunscreen: { type: "Écran minéral SPF 50", product: "Avène Fluide Minéral 50+", usage: "Tous les matins. Les filtres minéraux sont souvent mieux tolérés." }
        }
    };

    let baseRoutine = routines[currentSkinType] || routines['Mixte'];
    let boosters = [];

    // Add boosters based on concerns
    if (concernsInput.includes('acné') || concernsInput.includes('bouton')) boosters.push({type: "Traitement local", product: "La Roche-Posay Effaclar Duo+", usage: "Le soir sur les imperfections."});
    if (concernsInput.includes('rides') || concernsInput.includes('age') || concernsInput.includes('âge')) boosters.push({type: "Rétinol", product: "CeraVe Sérum Rétinol Anti-Marques", usage: "Le soir uniquement. Commencer 2 fois par semaine."});
    if (concernsInput.includes('tache') || concernsInput.includes('terne') || concernsInput.includes('éclat')) boosters.push({type: "Vitamine C Puissante", product: "La Roche-Posay Pure Vitamin C10", usage: "Le matin sous la crème solaire."});
    if (concernsInput.includes('yeux') || concernsInput.includes('cerne')) boosters.push({type: "Contour des Yeux", product: "The Ordinary Caffeine Solution 5%", usage: "Matin et soir, masser le contour de l'œil."});

    let htmlContent = `
        <h4 style="color:var(--accent); margin-bottom:15px; text-align:center;">Votre Routine Radiant (Peau ${currentSkinType})</h4>
        <ul style="list-style:none; padding:0; line-height:1.6;">
            <li style="margin-bottom:10px;">🧼 <strong>Nettoyant :</strong> ${baseRoutine.cleanser.type}<br><span style="font-size:0.9em; opacity:0.8;">Ex: ${baseRoutine.cleanser.product}</span></li>
            <li style="margin-bottom:10px;">💧 <strong>Tonique :</strong> ${baseRoutine.toner.type}<br><span style="font-size:0.9em; opacity:0.8;">Ex: ${baseRoutine.toner.product}</span></li>
            <li style="margin-bottom:10px;">🧪 <strong>Sérum :</strong> ${baseRoutine.serum.type}<br><span style="font-size:0.9em; opacity:0.8;">Ex: ${baseRoutine.serum.product}</span></li>
            <li style="margin-bottom:10px;">🧴 <strong>Hydratant :</strong> ${baseRoutine.moisturizer.type}<br><span style="font-size:0.9em; opacity:0.8;">Ex: ${baseRoutine.moisturizer.product}</span></li>
            <li style="margin-bottom:10px;">☀️ <strong>Protection :</strong> ${baseRoutine.sunscreen.type}<br><span style="font-size:0.9em; opacity:0.8;">Ex: ${baseRoutine.sunscreen.product}</span></li>
        </ul>
    `;

    if (boosters.length > 0) {
        htmlContent += `
            <div style="margin-top:15px; padding-top:15px; border-top:1px dashed rgba(255,255,255,0.2);">
                <strong>🚀 Boosters Ciblés :</strong>
                <ul style="margin-top:5px; padding-left:20px;">
                    ${boosters.map(b => `<li>${b.type} (${b.product})</li>`).join('')}
                </ul>
            </div>
        `;
    }

    // Add "Voir plus" button and hidden usage details
    htmlContent += `
        <div style="margin-top:20px; text-align:center;">
            <button onclick="document.getElementById('usage-details').style.display = document.getElementById('usage-details').style.display === 'none' ? 'block' : 'none'" style="background:transparent; border:1px solid var(--accent); color:var(--accent); padding:5px 15px; border-radius:20px; cursor:pointer; font-size:0.9rem;">Voir Conseils d'Utilisation</button>
        </div>
        <div id="usage-details" style="display:none; margin-top:15px; background:rgba(255,255,255,0.05); padding:15px; border-radius:10px; font-size:0.9rem;">
            <h5 style="color:var(--accent); margin-bottom:10px;">Mode d'Emploi :</h5>
            <ul style="list-style:none; padding:0;">
                <li style="margin-bottom:8px;"><strong>1. Nettoyant :</strong> ${baseRoutine.cleanser.usage}</li>
                <li style="margin-bottom:8px;"><strong>2. Tonique :</strong> ${baseRoutine.toner.usage}</li>
                <li style="margin-bottom:8px;"><strong>3. Sérum :</strong> ${baseRoutine.serum.usage}</li>
                <li style="margin-bottom:8px;"><strong>4. Hydratant :</strong> ${baseRoutine.moisturizer.usage}</li>
                <li style="margin-bottom:8px;"><strong>5. Protection :</strong> ${baseRoutine.sunscreen.usage}</li>
                ${boosters.map(b => `<li style="margin-bottom:8px; color:var(--accent);"><strong>+ Booster (${b.type}) :</strong> ${b.usage}</li>`).join('')}
            </ul>
        </div>
    `;

    simulateLoading(resultDiv, () => {
        resultDiv.innerHTML = htmlContent;
    });
}

// 5. Reframing
function reframeThought() {
    const input = document.getElementById('reframe-input').value;
    const resultDiv = document.getElementById('reframe-result');
    
    if (!input) return;

    const reframes = [
        "Ce n'est pas un échec, c'est une donnée pour l'apprentissage futur.",
        "Cette situation ne définit pas ma valeur, c'est juste un moment ponctuel.",
        "Qu'est-ce que je conseillerais à mon meilleur ami dans la même situation ?"
    ];

    simulateLoading(resultDiv, () => {
        resultDiv.innerHTML = `<strong>Nouvelles Perspectives :</strong><ul style='margin-top:10px; padding-left:20px;'>${reframes.map(r => `<li>${r}</li>`).join('')}</ul>`;
    });
}

// 6. Archetype
function selectArchetype(choice) {
    const resultDiv = document.getElementById('archetype-result');
    
    let archetype = "";
    if (choice === 'Mer') archetype = "L'Explorateur Intuitif – Vous suivez le courant mais connaissez les profondeurs.";
    if (choice === 'Montagne') archetype = "Le Sage Résilient – Vous visez haut et restez stable face aux vents.";
    if (choice === 'Forêt') archetype = "Le Gardien Connecté – Vous cherchez la croissance et l'harmonie collective.";

    resultDiv.innerHTML = `<strong>Votre Archétype :</strong><br>${archetype}`;
    resultDiv.classList.add('visible');
    resultDiv.style.display = 'block';
}

// 7. Orchestrator
function orchestrate() {
    const input = document.getElementById('orchestrator-input').value.toLowerCase();
    const resultDiv = document.getElementById('orchestrator-result');
    
    if (!input) return;

    let mix = "Vent dans les feuilles + Guitare Acoustique";
    if (input.includes('calme') || input.includes('paix')) mix = "Pluie légère + Piano Jazz";
    if (input.includes('énergie') || input.includes('sport')) mix = "Orage lointain + Battements Lo-Fi";
    if (input.includes('focus') || input.includes('travail')) mix = "Rivière qui coule + Ondes Alpha";

    simulateLoading(resultDiv, () => {
        resultDiv.innerHTML = `Mix Idéal : <span style="color:var(--accent)">${mix}</span>`;
    });
}

// Helper: Simulate "Thinking" time
function simulateLoading(element, callback) {
    element.style.display = 'block';
    element.innerHTML = "<em>L'IA réfléchit...</em>";
    element.classList.remove('visible');
    
    setTimeout(() => {
        callback();
        element.classList.add('visible');
    }, 1000); // 1 second fake delay
}