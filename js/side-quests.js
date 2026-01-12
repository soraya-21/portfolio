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

// Auto-load Gallery on page load if element exists
document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('nasa-gallery-container')) {
        fetchNASAGallery();
    }
});
