// Global Translations State
let currentTranslations = window.translations || {};
let currentLanguage = document.documentElement.lang || 'fr';

// Listen for translation updates
window.addEventListener('translationsLoaded', (e) => {
    console.log('Translations loaded in side-quests.js:', e.detail.language);
    currentTranslations = e.detail.translations;
    currentLanguage = e.detail.language;
    
    // Refresh Gallery if visible (to update static texts and language note)
    if (document.getElementById('nasa-gallery-container') && localStorage.getItem('nasa_gallery_cache_v2')) {
        fetchNASAGallery(false);
    }
});

// Helper: Get translation safely
function getTranslation(key, fallback) {
    if (!currentTranslations) return fallback;
    
    const keys = key.split('.');
    let value = currentTranslations;
    
    for (const k of keys) {
        if (value && value[k] !== undefined) {
            value = value[k];
        } else {
            return fallback;
        }
    }
    
    return value;
}

// Helper: Simulate "Thinking" time
function simulateLoading(element, callback) {
    const loadingText = getTranslation('side_quests.loading', "L'IA réfléchit...");
    
    element.style.display = 'block';
    element.innerHTML = `<div style="display:flex; justify-content:center; align-items:center; gap:10px;"><span>${loadingText}</span><div class="spinner" style="width:15px; height:15px; border:2px solid var(--accent); border-top-color:transparent; border-radius:50%; animation:spin 1s linear infinite;"></div></div>`;
    element.classList.remove('visible');
    
    // Add spinner animation style if not exists
    if (!document.getElementById('spinner-style')) {
        const style = document.createElement('style');
        style.id = 'spinner-style';
        style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        callback();
        element.classList.add('visible');
    }, 1000); // 1 second fake delay
}

// 1. Citation Célèbre Logic
// Default Fallback Database
const defaultQuotesDatabase = {
    'love': [
        { text: "Aimer, ce n'est pas se regarder l'un l'autre, c'est regarder ensemble dans la même direction.", author: "Antoine de Saint-Exupéry" },
        { text: "Le seul vrai langage au monde est un baiser.", author: "Alfred de Musset" }
    ],
    'courage': [
        { text: "Le courage n'est pas l'absence de peur, mais la capacité de la vaincre.", author: "Nelson Mandela" },
        { text: "Il faut du courage pour grandir et devenir qui l'on est vraiment.", author: "E.E. Cummings" }
    ],
    'time': [
        { text: "Hâte-toi lentement.", author: "Boileau" },
        { text: "Le temps est un grand maître, dit-on. Le malheur est qu'il tue ses élèves.", author: "Hector Berlioz" }
    ],
    'success': [
        { text: "Le succès, c'est d'aller d'échec en échec sans perdre son enthousiasme.", author: "Winston Churchill" },
        { text: "La seule façon de faire du bon travail est d'aimer ce que vous faites.", author: "Steve Jobs" }
    ],
    'wisdom': [
        { text: "Connais-toi toi-même.", author: "Socrate" },
        { text: "La vraie sagesse est de ne pas sembler sage.", author: "Eschyle" }
    ],
    'nature': [
        { text: "La nature ne fait rien en vain.", author: "Aristote" },
        { text: "Regardez profondément dans la nature, et alors vous comprendrez tout mieux.", author: "Albert Einstein" }
    ],
    'happiness': [
        { text: "Le bonheur est parfois caché dans l'inconnu.", author: "Victor Hugo" },
        { text: "Le bonheur n'est pas chose aisée. Il est très difficile de le trouver en nous, et impossible de le trouver ailleurs.", author: "Chamfort" }
    ],
    'peace': [
        { text: "La paix commence par un sourire.", author: "Mère Teresa" },
        { text: "Il n'y a jamais eu de bonne guerre ni de mauvaise paix.", author: "Benjamin Franklin" }
    ]
};

function generateQuote(theme) {
    const resultDiv = document.getElementById('quote-result');
    
    // Try to get quotes from translations, fallback to default
    let quotes = getTranslation(`side_quests.literature.quote.database.${theme}`, defaultQuotesDatabase[theme]);
    
    if (!quotes || quotes.length === 0) return;

    simulateLoading(resultDiv, () => {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        resultDiv.innerHTML = `
            <div style="font-family: 'Georgia', serif; font-style: italic; font-size: 1.1rem; line-height: 1.6;">
                "${randomQuote.text}"
            </div>
            <div style="margin-top: 10px; font-weight: bold; color: var(--accent); font-size: 0.9rem;">
                — ${randomQuote.author}
            </div>
        `;
    });
}

// 2. Rime-Moi Vert Logic
function generateNaturePoem() {
    const input = document.getElementById('nature-input').value.trim().toLowerCase();
    const originalInput = document.getElementById('nature-input').value.trim();
    const resultDiv = document.getElementById('nature-poem-result');
    
    const errorMsg = getTranslation('side_quests.messages.error_rhyme_input', "Veuillez entrer un thème ou un élément.");
    
    if (!input) {
        resultDiv.innerHTML = `<p style="color: #ff6b6b; text-align: center;">${errorMsg}</p>`;
        resultDiv.style.display = 'block';
        return;
    }

    simulateLoading(resultDiv, () => {
        // Keyword Analysis Map
        const keywordsMap = {
            'forest': ['forêt', 'arbre', 'bois', 'racine', 'feuille', 'forest', 'tree', 'wood', 'root', 'leaf', 'igbó', 'igi'],
            'ocean': ['océan', 'mer', 'vague', 'eau', 'rivière', 'lac', 'ocean', 'sea', 'wave', 'water', 'river', 'lake', 'okun', 'omi'],
            'sun': ['soleil', 'lumière', 'feu', 'chaleur', 'été', 'sun', 'light', 'fire', 'heat', 'summer', 'oorun'],
            'moon': ['lune', 'nuit', 'étoile', 'ciel', 'sombre', 'moon', 'night', 'star', 'sky', 'dark', 'osupa'],
            'wind': ['vent', 'souffle', 'air', 'tempête', 'wind', 'breath', 'storm', 'afẹfẹ'],
            'mountain': ['montagne', 'sommet', 'pierre', 'rocher', 'mountain', 'peak', 'stone', 'rock', 'oke'],
            'flower': ['fleur', 'jardin', 'pétale', 'rose', 'flower', 'garden', 'petal', 'odoodo']
        };

        let detectedTheme = 'default';
        
        // Simple keyword matching
        for (const [theme, keywords] of Object.entries(keywordsMap)) {
            if (keywords.some(k => input.includes(k))) {
                detectedTheme = theme;
                break;
            }
        }

        let poem = "";
        
        if (detectedTheme !== 'default') {
            // Specific response for detected theme
            poem = getTranslation(`side_quests.literature.rhyme.responses.${detectedTheme}`, "");
            
            // Fallback if specific translation missing, use default logic
            if (!poem) detectedTheme = 'default';
        }
        
        if (detectedTheme === 'default') {
            const defaultPoems = [
                `Dans le silence de {0},<br>Le vent murmure un secret ancien,<br>Les feuilles dansent, l'esprit s'apaise,<br>La nature reprend ses droits, sereine.`,
                `L'écho de {0} résonne au loin,<br>Comme une caresse du matin,<br>Tout s'éveille, tout est lumière,<br>Dans ce monde, une prière.`,
                `Sous le ciel, {0} se dresse,<br>Témoin du temps, sans faiblesse,<br>Racines profondes, cœur vibrant,<br>Hymne à la vie, éternellement.`
            ];
            const poems = getTranslation('side_quests.literature.rhyme.responses.default', defaultPoems);
            poem = poems[Math.floor(Math.random() * poems.length)];
            poem = poem.replace('{0}', originalInput);
        }

        const titlePrefix = getTranslation('side_quests.messages.rhyme_title_prefix', "L'Esprit de :");
        
        resultDiv.innerHTML = `
            <h4 style="color: var(--accent); margin-bottom: 15px;">${titlePrefix} ${originalInput}</h4>
            <p style="font-family: 'Georgia', serif; font-style: italic; line-height: 1.8; font-size: 1.1rem;">
                "${poem}"
            </p>
        `;
    });
}

// 5. Radiant Skincare Logic (Restored Version)
let selectedSkinType = '';

function selectSkinType(btn, type) {
    // Reset buttons
    const buttons = document.querySelectorAll('.quest-option-btn');
    buttons.forEach(b => b.classList.remove('active'));
    
    // Set active
    btn.classList.add('active');
    selectedSkinType = type;
}

function generateSkincare() {
    const resultDiv = document.getElementById('skincare-result');
    const concernInput = document.getElementById('skin-concern').value.trim();

    const errorMsg = getTranslation('side_quests.messages.error_skin_type', "Veuillez sélectionner votre type de peau.");

    if (!selectedSkinType) {
        resultDiv.innerHTML = `<p style="color: #ff6b6b;">${errorMsg}</p>`;
        resultDiv.style.display = 'block';
        return;
    }

    simulateLoading(resultDiv, () => {
        let routine = '';
        let advice = '';
        
        // Get translated content
        const routines = getTranslation('side_quests.beauty.radiant.results.routines', {});
        const advices = getTranslation('side_quests.beauty.radiant.results.advice', {});
        
        routine = routines[selectedSkinType] || routines['default'] || 'Nettoyant doux + Hydratant léger + Protection solaire';
        advice = advices[selectedSkinType] || 'Hydratez-vous bien.';

        // Add Concern logic
        if (concernInput) {
            const bonusTemplate = getTranslation('side_quests.beauty.radiant.results.bonus_text', 'Bonus pour "{0}" : Ajoutez un actif ciblé le soir.');
            const bonusText = bonusTemplate.replace('{0}', concernInput);
            routine += `<br><br><strong>${bonusText}</strong>`;
        }

        const titleText = getTranslation('side_quests.beauty.radiant.results.title', 'Votre Routine Personnalisée');
        const proTipLabel = getTranslation('side_quests.beauty.radiant.results.pro_tip', 'Conseil Pro :');
        
        // Translate Skin Type Label (Optional, but good for display)
        const skinTypeLabel = getTranslation(`side_quests.beauty.radiant.options.${selectedSkinType}`, selectedSkinType);

        // Usage Tips Logic
        const seeMoreText = getTranslation('side_quests.beauty.radiant.results.see_more', "Voir plus");
        const usageTitle = getTranslation('side_quests.beauty.radiant.results.usage_title', "Conseils d'utilisation");
        const usageTips = getTranslation('side_quests.beauty.radiant.results.usage', {});
        const currentUsage = usageTips[selectedSkinType] || usageTips['default'] || "Nettoyer, Hydrater, Protéger.";

        // Hands & Feet Logic
        const handsFeetTitle = getTranslation('side_quests.beauty.radiant.results.hands_feet.title', 'Soins Mains & Pieds');
        const handsFeetData = getTranslation('side_quests.beauty.radiant.results.hands_feet', {});
        const handsFeetAdvice = handsFeetData[selectedSkinType] || handsFeetData['default'] || 'Hydratez vos mains et pieds régulièrement.';

        resultDiv.innerHTML = `
            <h4 style="color: var(--accent); margin-top: 0;">${titleText} (${skinTypeLabel})</h4>
            <p style="font-size: 1.1rem; line-height: 1.6;">${routine}</p>
            
            <!-- Usage Tips Section -->
            <div style="margin-top: 15px;">
                <button onclick="document.getElementById('usage-content').style.display = document.getElementById('usage-content').style.display === 'none' ? 'block' : 'none'" 
                        style="background: transparent; border: 1px solid var(--accent); color: var(--accent); padding: 5px 15px; border-radius: 20px; cursor: pointer; font-size: 0.8rem; margin-bottom: 10px;">
                    ${seeMoreText}
                </button>
                <div id="usage-content" style="display: none; background: rgba(0,0,0,0.1); padding: 15px; border-radius: 10px; border-left: 3px solid var(--accent);">
                    <strong style="color: var(--text-light); display: block; margin-bottom: 5px;">${usageTitle}</strong>
                    <p style="font-size: 0.9rem; margin: 0; line-height: 1.5;">${currentUsage}</p>
                </div>
            </div>

            <!-- Hands & Feet Section -->
            <div style="margin-top: 15px; background: rgba(255, 255, 255, 0.05); padding: 10px; border-radius: 8px;">
                <strong style="color: var(--accent); display: block; margin-bottom: 5px;">💅 ${handsFeetTitle}</strong>
                <p style="font-size: 0.9rem; margin: 0;">${handsFeetAdvice}</p>
            </div>

            <div style="margin-top: 15px; font-size: 0.9rem; color: #aaa; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
                💡 <strong>${proTipLabel}</strong> ${advice}
            </div>
        `;
    });
}

let currentGalleryItems = []; // Store items globally for translation

// 4. NASA Image and Video Library Gallery Logic
async function fetchNASAGallery(forceRefresh = false) {
    const container = document.getElementById('nasa-gallery-container');
    const CACHE_KEY = 'nasa_gallery_cache_v2';
    const CACHE_DURATION = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds
    
    const loadingText = getTranslation('side_quests.science.gallery.loading', 'Chargement de la librairie...');
    const noImagesText = getTranslation('side_quests.science.gallery.no_images', 'Aucune image trouvée pour cette année.');
    const errorText = getTranslation('side_quests.science.gallery.error', 'Impossible de charger la galerie.');
    const errorDetailText = getTranslation('side_quests.science.gallery.error_detail', '(Erreur réseau ou API indisponible)');

    // 1. Check Cache
    if (!forceRefresh) {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            const { timestamp, items } = JSON.parse(cachedData);
            if (Date.now() - timestamp < CACHE_DURATION) {
                console.log("Loading NASA Gallery from Cache");
                currentGalleryItems = items;
                renderGallery(items);
                return;
            }
        }
    }

    container.innerHTML = `<div style="min-width: 300px; height: 400px; display: flex; align-items: center; justify-content: center; color: var(--text-light);">${loadingText}</div>`;

    // 2. Fetch New Data
    const currentYear = new Date().getFullYear();
    // Search for space images, recent (start from previous year to ensure content)
    // We use currentYear - 1 to get a wider range of recent images
    const searchYear = currentYear - 1;
    const url = `https://images-api.nasa.gov/search?q=space&media_type=image&year_start=${searchYear}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erreur réseau');
        
        const data = await response.json();
        let items = data.collection.items;
        
        // Filter out future dates (NASA metadata errors)
        const now = new Date();
        items = items.filter(item => {
            const dateStr = item.data[0].date_created;
            if (!dateStr) return false;
            return new Date(dateStr) <= now;
        });
        
        // Sort by date created descending
        items.sort((a, b) => {
            return new Date(b.data[0].date_created) - new Date(a.data[0].date_created);
        });

        items = items.slice(0, 20); // Limit to 20 items

        if (items.length === 0) {
            container.innerHTML = `<div style="padding: 20px;">${noImagesText}</div>`;
            return;
        }

        // 3. Save to Cache
        const cachePayload = {
            timestamp: Date.now(),
            items: items
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cachePayload));

        currentGalleryItems = items;
        renderGallery(items);

    } catch (error) {
        console.error('NASA Library Error:', error);
        container.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #ff6b6b; min-width: 100%;">
                ${errorText}<br>
                <span style="font-size: 0.8rem;">${errorDetailText}</span>
            </div>
        `;
    }
}

function renderGallery(items) {
    const container = document.getElementById('nasa-gallery-container');
    container.innerHTML = ''; // Clear loading message
    
    const untitledText = getTranslation('side_quests.science.gallery.untitled', "Sans titre");
    const noDescText = getTranslation('side_quests.science.gallery.no_desc', "Aucune description disponible.");
    const dateUnknownText = getTranslation('side_quests.science.gallery.date_label', "Date inconnue");
    const langNote = getTranslation('side_quests.science.gallery.lang_note', '');

    items.forEach((item, index) => {
        const dataInfo = item.data[0];
        const linkInfo = item.links ? item.links[0] : null;

        if (!linkInfo) return; // Skip if no image link

        const title = dataInfo.title || untitledText;
        const description = dataInfo.description || noDescText;
        
        // Check if translation is needed
        const needsTranslation = currentLanguage !== 'en' && description !== noDescText;
        const translateBtn = needsTranslation 
            ? `<button onclick="handleTranslate(this, ${index})" class="translate-btn" style="background:transparent; border:1px solid var(--accent); color:var(--accent); font-size:0.75rem; padding:4px 8px; border-radius:12px; cursor:pointer; margin-top:8px; opacity:0.8; transition:0.3s;">
                🌐 Traduire (${currentLanguage.toUpperCase()})
               </button>`
            : (needsTranslation && langNote ? `<br><br><em style="font-size: 0.9em; opacity: 0.8;">${langNote}</em>` : '');

        // Use slice to get YYYY-MM-DD from ISO string to avoid timezone shifts
        const date = dataInfo.date_created ? dataInfo.date_created.slice(0, 10) : dateUnknownText;
        const center = dataInfo.center || "NASA";
        const photographer = dataInfo.photographer || dataInfo.secondary_creator || "";
        const imageUrl = linkInfo.href;

        // Build Reference String
        let reference = `🏢 ${center}`;
        if (photographer) reference += ` | 📸 ${photographer}`;

        // Create Card Element
        const card = document.createElement('div');
        card.style.minWidth = '320px';
        card.style.maxWidth = '320px';
        card.style.background = 'rgba(0,0,0,0.3)';
        card.style.borderRadius = '15px';
        card.style.overflow = 'hidden';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.border = '1px solid rgba(255,255,255,0.1)';
        card.style.flexShrink = '0'; // Prevent shrinking in flex container

        card.innerHTML = `
            <div style="height: 200px; overflow: hidden;">
                <img src="${imageUrl}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'" loading="lazy">
            </div>
            <div style="padding: 20px; flex: 1; display: flex; flex-direction: column;">
                <h4 id="title-${index}" style="margin: 0 0 10px 0; color: var(--accent); font-size: 1.1rem; line-height: 1.3;">${title}</h4>
                <div style="font-size: 0.75rem; color: var(--text-light); margin-bottom: 10px; display: flex; flex-direction: column; gap: 4px;">
                    <span>📅 ${date}</span>
                    <span>${reference}</span>
                </div>
                <div id="desc-${index}" style="font-size: 0.85rem; color: #ddd; line-height: 1.5; overflow-y: auto; max-height: 120px; padding-right: 5px; margin-bottom: 10px; flex: 1; scrollbar-width: thin;">
                    ${description}
                </div>
                <div style="min-height:30px;">
                    ${translateBtn}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// 5. Translation Helper
async function translateText(text, targetLang) {
    if (!text) return '';
    try {
        // Using MyMemory API (Free usage)
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.responseStatus === 200) {
            return data.responseData.translatedText;
        } else {
            console.warn('Translation API Limit or Error:', data.responseDetails);
            return null;
        }
    } catch (e) {
        console.error("Translation failed", e);
        return null;
    }
}

window.handleTranslate = async function(btn, index) {
    if (!currentGalleryItems[index]) return;
    
    const item = currentGalleryItems[index];
    const titleEl = document.getElementById(`title-${index}`);
    const descEl = document.getElementById(`desc-${index}`);
    const targetLang = currentLanguage;

    btn.disabled = true;
    btn.innerHTML = '⏳ Traduction...';
    btn.style.opacity = '0.5';

    // Translate Title
    const title = item.data[0].title;
    const desc = item.data[0].description;

    const [transTitle, transDesc] = await Promise.all([
        translateText(title, targetLang),
        translateText(desc, targetLang)
    ]);

    if (transTitle) titleEl.innerHTML = transTitle;
    if (transDesc) descEl.innerHTML = transDesc;

    if (transTitle || transDesc) {
        btn.innerHTML = 'Traduit';
        setTimeout(() => btn.remove(), 2000);
    } else {
        btn.innerHTML = 'Erreur (Quota/Réseau)';
        btn.disabled = false;
        btn.style.opacity = '1';
    }
};

// 6. Word Search Logic
const wordSearchThemes = {
    'fr': [
        { name: "Nature", words: ["ARBRE", "FLEUR", "SOLEIL", "LUNE", "RIVIERE", "FORET", "MONTAGNE", "OCEAN", "PLUIE", "NUAGE", "HERBE", "TERRE", "ETOILE", "CIEL", "VENT", "ORAGE", "NEIGE", "DESERT", "VOLCAN", "LAGON"] },
        { name: "Animaux", words: ["LION", "TIGRE", "OURS", "AIGLE", "REQUIN", "LOUP", "RENARD", "PANDA", "CHIEN", "CHAT", "CHEVAL", "ELEPHANT", "GIRAFE", "SINGE", "SERPENT", "OISEAU", "DAUPHIN", "BALEINE", "PAPILLON", "TORTUE"] },
        { name: "Techno", words: ["CODE", "ROBOT", "DATA", "WIFI", "PIXEL", "CYBER", "ECRAN", "SOURIS", "CLAVIER", "RESEAU", "PUCE", "SERVER", "CLOUD", "APP", "JAVA", "PYTHON", "LINUX", "GAMING", "VIRUS", "HACKER"] }
    ],
    'en': [
        { name: "Nature", words: ["TREE", "FLOWER", "SUN", "MOON", "RIVER", "FOREST", "MOUNTAIN", "OCEAN", "RAIN", "CLOUD", "GRASS", "EARTH", "STAR", "SKY", "WIND", "STORM", "SNOW", "DESERT", "VOLCANO", "LAGOON"] },
        { name: "Animals", words: ["LION", "TIGER", "BEAR", "EAGLE", "SHARK", "WOLF", "FOX", "PANDA", "DOG", "CAT", "HORSE", "ELEPHANT", "GIRAFFE", "MONKEY", "SNAKE", "BIRD", "DOLPHIN", "WHALE", "BUTTERFLY", "TURTLE"] },
        { name: "Tech", words: ["CODE", "ROBOT", "DATA", "WIFI", "PIXEL", "CYBER", "SCREEN", "MOUSE", "KEYBOARD", "NETWORK", "CHIP", "SERVER", "CLOUD", "APP", "JAVA", "PYTHON", "LINUX", "GAMING", "VIRUS", "HACKER"] }
    ],
    'yo': [
        { name: "Iseda", words: ["IGI", "ODOODO", "OORUN", "OSUPA", "ODO", "IGBO", "OKE", "OKUN", "OJO", "IKUUKU", "EWE", "ILE", "IRAWO", "OFURUFU", "AFEFE", "IJI", "YO", "IYEPURU", "INA", "OMI"] },
        { name: "Eranko", words: ["KINNIUN", "EKUN", "BEARI", "IDIPU", "SHARK", "IKOKO", "KOLOKOLO", "PANDA", "AJA", "OLOGBO", "ESIN", "ERIN", "AGUNTAN", "OBO", "EJO", "EYE", "EJA", "LABALABA", "IJAPA", "PEPEYE"] },
        { name: "Imọ-ẹrọ", words: ["CODE", "ROBOT", "DATA", "WIFI", "PIXEL", "CYBER", "SCREEN", "MOUSE", "KEYBOARD", "NETWORK", "CHIP", "SERVER", "CLOUD", "APP", "JAVA", "PYTHON", "LINUX", "GAMING", "VIRUS", "HACKER"] }
    ],
    // Fallbacks for other languages can be added here or use EN/FR
    'default': [
        { name: "Theme 1", words: ["HELLO", "WORLD", "GAME", "PLAY", "FUN", "CODE", "MUSIC", "ART", "BOOK", "PEN", "PAPER", "INK", "DESK", "CHAIR", "LAMP", "ROOM"] },
        { name: "Theme 2", words: ["APPLE", "BANANA", "CHERRY", "DATE", "ELDER", "FIG", "GRAPE", "HONEY", "ICE", "JAM", "KIWI", "LEMON", "MANGO", "NUT", "OLIVE", "PEAR"] },
        { name: "Theme 3", words: ["RED", "GREEN", "BLUE", "YELLOW", "PINK", "BLACK", "WHITE", "GRAY", "ORANGE", "PURPLE", "BROWN", "GOLD", "SILVER", "TEAL", "NAVY", "CYAN"] }
    ]
};

let wsCurrentThemeIndex = 0;
let wsGridSize = 10;
let wsGrid = [];
let wsWords = [];
let wsFoundWords = [];
let wsTimerInterval;
let wsSeconds = 0;
let isWsRunning = false;
let wsHintsRemaining = 3;

// Selection Variables
let isSelecting = false;
let selectionStartCell = null;
let currentSelectionPath = [];

function selectWordSearchTheme(index) {
    wsCurrentThemeIndex = index;
    updateActiveButton('.quest-options:not([style*="scale"]) .quest-option-btn', index);
    startWordSearchGame();
}

function selectWordSearchSize(size) {
    wsGridSize = size;
    // Map size to index for button activation logic (8->0, 10->1, 12->2)
    const index = size === 8 ? 0 : size === 10 ? 1 : 2;
    updateActiveButton('.size-btn', index);
    startWordSearchGame();
}

function updateActiveButton(selector, index) {
    // Find container within the specific card to avoid conflicts? 
    // Ideally we should scope this better, but for now:
    const card = document.getElementById('ws-grid').closest('.quest-card');
    if (card) {
        const buttons = card.querySelectorAll(selector);
        buttons.forEach((b, i) => {
            if (i === index) b.classList.add('active');
            else b.classList.remove('active');
        });
    }
}

function getWordsForCurrentLanguage() {
    const lang = currentLanguage || 'en';
    let themes = wordSearchThemes[lang];
    if (!themes) {
        const shortLang = lang.split('-')[0];
        themes = wordSearchThemes[shortLang] || wordSearchThemes['en'] || wordSearchThemes['default'];
    }
    return themes[wsCurrentThemeIndex] || themes[0];
}

function startWordSearchGame() {
    resetTimer();
    wsFoundWords = [];
    wsHintsRemaining = 3;
    isSelecting = false;
    selectionStartCell = null;
    currentSelectionPath = [];
    
    document.getElementById('ws-message').innerHTML = "";
    updateHintButton();
    
    const themeData = getWordsForCurrentLanguage();
    // Select subset of words based on size to avoid overcrowding small grids?
    // Or just use all words. 8x8 might be tight for 8 words.
    // Let's pick random N words based on size.
    const maxWords = wsGridSize === 8 ? 8 : wsGridSize === 10 ? 12 : 15;
    
    // Shuffle and slice
    let pool = [...themeData.words];
    pool.sort(() => 0.5 - Math.random());
    wsWords = pool.slice(0, maxWords).map(w => w.toUpperCase());
    
    generateGrid(wsWords);
    renderGrid();
    renderWordList();
    loadWsBestScore();
}

function updateHintButton() {
    const btn = document.getElementById('ws-hint-btn');
    if (!btn) return;
    
    const hintText = getTranslation('side_quests.literature.word_search.hint', "Indice ({0})");
    const noHintText = getTranslation('side_quests.literature.word_search.no_hints', "Plus d'indices !");
    
    if (wsHintsRemaining > 0) {
        btn.innerText = hintText.replace('{0}', wsHintsRemaining);
        btn.disabled = false;
        btn.style.opacity = '1';
    } else {
        btn.innerText = noHintText;
        btn.disabled = true;
        btn.style.opacity = '0.5';
    }
}

function generateGrid(words) {
    wsGrid = Array(wsGridSize).fill(null).map(() => Array(wsGridSize).fill(''));
    
    // Place words
    const placedWords = [];
    for (const word of words) {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 100) {
            const dir = Math.floor(Math.random() * 3); // 0: H, 1: V, 2: Diag
            const r = Math.floor(Math.random() * wsGridSize);
            const c = Math.floor(Math.random() * wsGridSize);
            
            if (canPlaceWord(word, r, c, dir)) {
                placeWord(word, r, c, dir);
                placed = true;
                placedWords.push(word);
            }
            attempts++;
        }
    }
    
    // Update global words list to only include actually placed words
    // This prevents "ghost words" in the list that couldn't be placed
    wsWords = placedWords;
    
    // Fill empty
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < wsGridSize; r++) {
        for (let c = 0; c < wsGridSize; c++) {
            if (wsGrid[r][c] === '') {
                wsGrid[r][c] = letters[Math.floor(Math.random() * letters.length)];
            }
        }
    }
}

function canPlaceWord(word, r, c, dir) {
    if (dir === 0) { // Horizontal
        if (c + word.length > wsGridSize) return false;
        for (let i = 0; i < word.length; i++) {
            if (wsGrid[r][c + i] !== '' && wsGrid[r][c + i] !== word[i]) return false;
        }
    } else if (dir === 1) { // Vertical
        if (r + word.length > wsGridSize) return false;
        for (let i = 0; i < word.length; i++) {
            if (wsGrid[r + i][c] !== '' && wsGrid[r + i][c] !== word[i]) return false;
        }
    } else { // Diagonal
        if (r + word.length > wsGridSize || c + word.length > wsGridSize) return false;
        for (let i = 0; i < word.length; i++) {
            if (wsGrid[r + i][c + i] !== '' && wsGrid[r + i][c + i] !== word[i]) return false;
        }
    }
    return true;
}

function placeWord(word, r, c, dir) {
    for (let i = 0; i < word.length; i++) {
        if (dir === 0) wsGrid[r][c + i] = word[i];
        else if (dir === 1) wsGrid[r + i][c] = word[i];
        else wsGrid[r + i][c + i] = word[i];
    }
}

function renderGrid() {
    const container = document.getElementById('ws-grid');
    container.style.gridTemplateColumns = `repeat(${wsGridSize}, 30px)`;
    container.innerHTML = '';
    
    wsGrid.forEach((row, r) => {
        row.forEach((letter, c) => {
            const cell = document.createElement('div');
            cell.className = 'ws-cell';
            cell.innerText = letter;
            cell.dataset.r = r;
            cell.dataset.c = c;
            
            // Mouse Events
            cell.addEventListener('mousedown', (e) => handleStart(e, r, c));
            cell.addEventListener('mouseenter', (e) => handleMove(e, r, c));
            cell.addEventListener('mouseup', handleEnd);
            
            // Touch Events
            cell.addEventListener('touchstart', (e) => handleStart(e, r, c));
            cell.addEventListener('touchmove', handleTouchMove);
            cell.addEventListener('touchend', handleEnd);

            container.appendChild(cell);
        });
    });
    
    // Global mouseup to catch releases outside grid
    document.addEventListener('mouseup', () => {
        if(isSelecting) handleEnd();
    });
}

function handleStart(e, r, c) {
    e.preventDefault(); // Prevent text selection
    if (!isWsRunning && wsFoundWords.length < wsWords.length) startWsTimer();
    if (wsFoundWords.length === wsWords.length) return;

    isSelecting = true;
    selectionStartCell = { r, c };
    highlightCell(r, c, true); // Start highlight
}

function handleMove(e, r, c) {
    if (!isSelecting) return;
    updateSelection(r, c);
}

function handleTouchMove(e) {
    if (!isSelecting) return;
    e.preventDefault();
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element && element.classList.contains('ws-cell')) {
        const r = parseInt(element.dataset.r);
        const c = parseInt(element.dataset.c);
        updateSelection(r, c);
    }
}

function updateSelection(endR, endC) {
    clearSelectionVisuals();
    
    const startR = selectionStartCell.r;
    const startC = selectionStartCell.c;
    
    // Determine valid straight line (Horizontal, Vertical, Diagonal)
    let dr = 0, dc = 0;
    
    if (startR === endR) { // Horizontal
        dc = endC > startC ? 1 : -1;
    } else if (startC === endC) { // Vertical
        dr = endR > startR ? 1 : -1;
    } else if (Math.abs(endR - startR) === Math.abs(endC - startC)) { // Diagonal
        dr = endR > startR ? 1 : -1;
        dc = endC > startC ? 1 : -1;
    } else {
        // Not a valid straight line, just highlight start
        highlightCell(startR, startC, true);
        return;
    }
    
    // Calculate path
    const len = Math.max(Math.abs(endR - startR), Math.abs(endC - startC)) + 1;
    currentSelectionPath = [];
    
    for (let i = 0; i < len; i++) {
        const r = startR + i * dr;
        const c = startC + i * dc;
        currentSelectionPath.push({r, c});
        highlightCell(r, c, true);
    }
}

function handleEnd() {
    if (!isSelecting) return;
    isSelecting = false;
    
    checkSelectionPath();
    clearSelectionVisuals(); // Clear temporary 'selected' class
}

function highlightCell(r, c, add) {
    const cell = document.querySelector(`.ws-cell[data-r="${r}"][data-c="${c}"]`);
    if (cell) {
        if (add) cell.classList.add('selected');
        else cell.classList.remove('selected');
    }
}

function clearSelectionVisuals() {
    document.querySelectorAll('.ws-cell.selected').forEach(el => el.classList.remove('selected'));
}

function checkSelectionPath() {
    if (currentSelectionPath.length === 0) return;
    
    let word = "";
    currentSelectionPath.forEach(pos => {
        word += wsGrid[pos.r][pos.c];
    });
    
    // Check match
    if (wsWords.includes(word) && !wsFoundWords.includes(word)) {
        wsFoundWords.push(word);
        markFound(currentSelectionPath);
        renderWordList();
        checkWin();
    } else {
        // Reverse check
        const revWord = word.split('').reverse().join('');
        if (wsWords.includes(revWord) && !wsFoundWords.includes(revWord)) {
            wsFoundWords.push(revWord);
            markFound(currentSelectionPath);
            renderWordList();
            checkWin();
        }
    }
}

function useHint() {
    if (wsHintsRemaining <= 0 || wsFoundWords.length === wsWords.length) return;
    
    wsHintsRemaining--;
    updateHintButton();
    
    // Find a word not yet found
    const availableWords = wsWords.filter(w => !wsFoundWords.includes(w));
    if (availableWords.length === 0) return;
    
    const wordToHint = availableWords[Math.floor(Math.random() * availableWords.length)];
    
    // Find its position in grid (Brute force search matching the logic of placement)
    // Since we didn't store positions, we search.
    let path = findWordInGrid(wordToHint);
    
    if (path) {
        // Highlight temporarily
        path.forEach(pos => {
            const cell = document.querySelector(`.ws-cell[data-r="${pos.r}"][data-c="${pos.c}"]`);
            if (cell) cell.classList.add('hint-highlight');
        });
        
        setTimeout(() => {
            document.querySelectorAll('.hint-highlight').forEach(el => el.classList.remove('hint-highlight'));
        }, 1500); // 1.5s highlight
    }
}

function findWordInGrid(word) {
    // Search for the word in 3 directions
    const len = word.length;
    
    // Helper to check at r,c with dr,dc
    const check = (r, c, dr, dc) => {
        if (r + (len-1)*dr >= wsGridSize || r + (len-1)*dr < 0) return null;
        if (c + (len-1)*dc >= wsGridSize || c + (len-1)*dc < 0) return null;
        
        let path = [];
        for(let i=0; i<len; i++) {
            if (wsGrid[r + i*dr][c + i*dc] !== word[i]) return null;
            path.push({r: r + i*dr, c: c + i*dc});
        }
        return path;
    };

    for (let r = 0; r < wsGridSize; r++) {
        for (let c = 0; c < wsGridSize; c++) {
            if (wsGrid[r][c] === word[0]) {
                // Try H, V, Diag
                let p = check(r, c, 0, 1); // H
                if (p) return p;
                p = check(r, c, 1, 0); // V
                if (p) return p;
                p = check(r, c, 1, 1); // Diag
                if (p) return p;
            }
        }
    }
    return null;
}

function renderWordList() {
    const list = document.getElementById('ws-word-list');
    list.innerHTML = '';
    wsWords.forEach(word => {
        const li = document.createElement('li');
        li.innerText = word;
        li.id = `word-${word}`;
        if (wsFoundWords.includes(word)) {
            li.style.textDecoration = "line-through";
            li.style.color = "var(--accent)"; // Greenish or Accent
            li.style.opacity = "0.5";
        }
        list.appendChild(li);
    });
}

function markFound(path) {
    path.forEach(pos => {
        const cell = document.querySelector(`.ws-cell[data-r="${pos.r}"][data-c="${pos.c}"]`);
        if (cell) cell.classList.add('found');
    });
}

function startWsTimer() {
    if (isWsRunning) return;
    isWsRunning = true;
    wsSeconds = 0;
    document.getElementById('ws-timer').innerText = "00:00";
    
    clearInterval(wsTimerInterval);
    wsTimerInterval = setInterval(() => {
        wsSeconds++;
        const m = Math.floor(wsSeconds / 60).toString().padStart(2, '0');
        const s = (wsSeconds % 60).toString().padStart(2, '0');
        document.getElementById('ws-timer').innerText = `${m}:${s}`;
    }, 1000);
}

function stopWsTimer() {
    isWsRunning = false;
    clearInterval(wsTimerInterval);
}

function resetTimer() {
    stopWsTimer();
    wsSeconds = 0;
    const timerEl = document.getElementById('ws-timer');
    if(timerEl) timerEl.innerText = "00:00";
}

function resetWordSearch() {
    startWordSearchGame(); // Re-generates grid and resets everything
}

function checkWin() {
    if (wsFoundWords.length === wsWords.length) {
        stopWsTimer();
        const successText = getTranslation('side_quests.literature.word_search.success', "Bravo ! Tout trouvé !");
        document.getElementById('ws-message').innerHTML = `<span style="color: #4cd964;">${successText}</span>`;
        saveWsBestScore();
    }
}

function saveWsBestScore() {
    const key = `ws_top3_${wsCurrentThemeIndex}_${wsGridSize}_${currentLanguage}`; // Score per theme AND size AND language
    let scores = JSON.parse(localStorage.getItem(key) || '[]');
    
    scores.push(wsSeconds);
    scores.sort((a, b) => a - b);
    scores = scores.slice(0, 3);
    
    localStorage.setItem(key, JSON.stringify(scores));
    loadWsBestScore();
    
    if (scores.length > 0 && scores[0] === wsSeconds) {
        const newRecordText = getTranslation('side_quests.literature.word_search.new_record', "Nouveau Record !");
        document.getElementById('ws-message').innerHTML += ` <br>🏆 ${newRecordText}`;
    }
}

function loadWsBestScore() {
    const key = `ws_top3_${wsCurrentThemeIndex}_${wsGridSize}_${currentLanguage}`;
    const scores = JSON.parse(localStorage.getItem(key) || '[]');
    const el = document.getElementById('ws-best-score');
    if(!el) return;

    if (scores.length > 0) {
        const formatTime = (s) => {
             const m = Math.floor(s / 60).toString().padStart(2, '0');
             const sec = (s % 60).toString().padStart(2, '0');
             return `${m}:${sec}`;
        };
        
        const top3Str = scores.map(formatTime).join(' | ');
        el.innerHTML = `Top 3:<br>${top3Str}`;
        el.style.fontSize = '0.75rem';
        el.style.textAlign = 'right';
    } else {
        el.innerText = `Top 3: --:--`;
    }
}

// 7. Philosophy Wiki Logic
const philosophyConcepts = {
    'fr': [
        { label: "Stoïcisme", query: "Stoïcisme" },
        { label: "Existentialisme", query: "Existentialisme" },
        { label: "Nihilisme", query: "Nihilisme" },
        { label: "Utilitarisme", query: "Utilitarisme" },
        { label: "Hédonisme", query: "Hédonisme" },
        { label: "Épicurisme", query: "Épicurisme" },
        { label: "Solipsisme", query: "Solipsisme" },
        { label: "Absurdisme", query: "Absurde_(philosophie)" },
        { label: "Empirisme", query: "Empirisme" },
        { label: "Rationalisme", query: "Rationalisme" },
        { label: "Déterminisme", query: "Déterminisme" },
        { label: "Relativisme", query: "Relativisme" },
        { label: "Scepticisme", query: "Scepticisme" },
        { label: "Cynisme", query: "Cynisme" },
        { label: "Idéalisme", query: "Idéalisme_(philosophie)" },
        { label: "Humanisme", query: "Humanisme" }
    ],
    'en': [
        { label: "Stoicism", query: "Stoicism" },
        { label: "Existentialism", query: "Existentialism" },
        { label: "Nihilism", query: "Nihilism" },
        { label: "Utilitarianism", query: "Utilitarianism" },
        { label: "Hedonism", query: "Hedonism" },
        { label: "Epicureanism", query: "Epicureanism" },
        { label: "Solipsism", query: "Solipsism" },
        { label: "Absurdism", query: "Absurdism" },
        { label: "Empiricism", query: "Empiricism" },
        { label: "Rationalism", query: "Rationalism" },
        { label: "Determinism", query: "Determinism" },
        { label: "Relativism", query: "Relativism" },
        { label: "Skepticism", query: "Skepticism" },
        { label: "Cynicism", query: "Cynicism_(philosophy)" },
        { label: "Idealism", query: "Idealism" },
        { label: "Humanism", query: "Humanism" }
    ],
    'yo': [
        { label: "Imọ̀-ọgbọ́n (Philosophy)", query: "Imọ̀-ọgbọ́n" },
        { label: "Lọ́jìkì (Logic)", query: "Lọ́jìkì" },
        { label: "Ètò ìwà (Ethics)", query: "Ètò_ìwà" }
    ],
    'zh': [
        { label: "斯多葛主义", query: "斯多葛主义" },
        { label: "存在主义", query: "存在主义" },
        { label: "虚无主义", query: "虚无主义" },
        { label: "功利主义", query: "功利主义" },
        { label: "享乐主义", query: "享乐主义" },
        { label: "唯我论", query: "唯我论" },
        { label: "荒谬主义", query: "荒谬主义" },
        { label: "经验主义", query: "经验主义" },
        { label: "理性主义", query: "理性主义" },
        { label: "决定论", query: "决定论" },
        { label: "相对主义", query: "相对主义" },
        { label: "怀疑论", query: "怀疑论" },
        { label: "犬儒主义", query: "犬儒主义" },
        { label: "唯心主义", query: "唯心主义" },
        { label: "人文主义", query: "人文主义" }
    ],
    'ja': [
        { label: "ストア派", query: "ストア派" },
        { label: "実存主義", query: "実存主義" },
        { label: "虚無主義", query: "虚無主義" },
        { label: "功利主義", query: "功利主義" },
        { label: "快楽主義", query: "快楽主義" },
        { label: "独我論", query: "独我論" },
        { label: "不条理", query: "不条理" },
        { label: "経験論", query: "経験論" },
        { label: "合理主義", query: "合理主義" },
        { label: "決定論", query: "決定論" },
        { label: "相対主義", query: "相対主義" },
        { label: "懐疑論", query: "懐疑論" },
        { label: "キュニコス派", query: "キュニコス派" },
        { label: "観念論", query: "観念論" },
        { label: "ヒューマニズム", query: "ヒューマニズム" }
    ],
    'ko': [
        { label: "스토아 학파", query: "스토아_학파" },
        { label: "실존주의", query: "실존주의" },
        { label: "허무주의", query: "허무주의" },
        { label: "공리주의", query: "공리주의" },
        { label: "쾌락주의", query: "쾌락주의" },
        { label: "유아론", query: "유아론" },
        { label: "부조리", query: "부조리" },
        { label: "경험론", query: "경험론" },
        { label: "합리주의", query: "합리주의" },
        { label: "결정론", query: "결정론" },
        { label: "상대주의", query: "상대주의" },
        { label: "회의론", query: "회의론" },
        { label: "견유학파", query: "견유학파" },
        { label: "관념론", query: "관념론" },
        { label: "인문주의", query: "인문주의" }
    ],
    'default': [
        { label: "Philosophy", query: "Philosophy" },
        { label: "Ethics", query: "Ethics" },
        { label: "Logic", query: "Logic" }
    ]
};

function renderPhilosophyThemes() {
    const container = document.getElementById('philosophy-themes');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Get concepts for current language or fallback to EN
    let lang = currentLanguage;
    let concepts = philosophyConcepts[lang];
    
    // Fallback logic
    if (!concepts) {
         if (lang.startsWith('fr')) concepts = philosophyConcepts['fr'];
         else if (lang.startsWith('en')) concepts = philosophyConcepts['en'];
         else if (lang.startsWith('zh')) concepts = philosophyConcepts['zh']; // Add zh fallback
         else if (lang.startsWith('ja')) concepts = philosophyConcepts['ja']; // Add ja fallback
         else if (lang.startsWith('ko')) concepts = philosophyConcepts['ko']; // Add ko fallback
         else concepts = philosophyConcepts['en']; // Default to English for others
    }
    
    // Determine which Wiki Lang to use
    // If we fell back to EN concepts because YO list is empty/missing, we should query EN wiki.
    const wikiLang = (philosophyConcepts[lang]) ? lang : 'en';

    concepts.forEach(item => {
        const chip = document.createElement('span');
        chip.className = 'theme-chip';
        chip.innerText = item.label;
        chip.onclick = () => fetchPhilosophyDefinition(item.query, wikiLang);
        container.appendChild(chip);
    });
}

async function fetchPhilosophyDefinition(query, lang) {
    const resultDiv = document.getElementById('philosophy-result');
    if (!resultDiv) return;
    
    simulateLoading(resultDiv, async () => {
        try {
            const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${query}`;
            const response = await fetch(url);
            
            if (!response.ok) throw new Error("Wiki Error");
            
            const data = await response.json();
            
            const extract = data.extract_html || data.extract;
            const link = data.content_urls.desktop.page;
            const title = data.title;
            const thumbnail = data.thumbnail ? data.thumbnail.source : null;
            
            const readMoreText = getTranslation('side_quests.literature.philosophy.read_more', "Lire la suite sur Wikipédia");
            
            let html = `
                <h4 style="color: var(--accent); margin-top: 0; display: flex; align-items: center; gap: 10px;">
                    ${title}
                </h4>
            `;
            
            if (thumbnail) {
                html += `<img src="${thumbnail}" style="float: right; margin: 0 0 10px 10px; border-radius: 8px; max-width: 100px; border: 1px solid rgba(255,255,255,0.1);">`;
            }
            
            html += `
                <div style="font-size: 0.95rem; color: var(--text-light); margin-bottom: 15px;">
                    ${extract}
                </div>
                <a href="${link}" target="_blank" style="display: inline-block; font-size: 0.85rem; color: var(--accent); text-decoration: none; border-bottom: 1px dashed var(--accent);">
                    ${readMoreText} &rarr;
                </a>
            `;
            
            resultDiv.innerHTML = html;
            
        } catch (error) {
            console.error(error);
            const errorText = getTranslation('side_quests.messages.error_wiki', "Impossible de charger la définition.");
            resultDiv.innerHTML = `<p style="color: #ff6b6b;">${errorText}</p>`;
        }
    });
}

// Auto-load Gallery on page load if element exists
document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('nasa-gallery-container')) {
        fetchNASAGallery();
    }
    if(document.getElementById('ws-grid')) {
        selectWordSearchTheme(0); // Default theme 0, size 10 (default var)
    }
    if(document.getElementById('philosophy-themes')) {
        renderPhilosophyThemes();
    }
});

// Update render on lang change
window.addEventListener('translationsLoaded', (e) => {
    // ... existing logic ...
    if(document.getElementById('philosophy-themes')) {
        renderPhilosophyThemes();
    }
});
