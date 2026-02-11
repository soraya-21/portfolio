// NASA Image and Video Library Gallery Logic

let currentGalleryItems = [];

window.fetchNASAGallery = async function(forceRefresh = false) {
    const container = document.getElementById('nasa-gallery-container');
    const CACHE_KEY = 'nasa_gallery_cache_v2';
    const CACHE_DURATION = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds
    
    const loadingText = window.getTranslation('side_quests.science.gallery.loading', 'Chargement de la librairie...');
    const noImagesText = window.getTranslation('side_quests.science.gallery.no_images', 'Aucune image trouvée pour cette année.');
    const errorText = window.getTranslation('side_quests.science.gallery.error', 'Impossible de charger la galerie.');
    const errorDetailText = window.getTranslation('side_quests.science.gallery.error_detail', '(Erreur réseau ou API indisponible)');

    // Check Cache
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

    //Fetch New Data
    const currentYear = new Date().getFullYear();
    const searchYear = currentYear - 1;
    const url = `https://images-api.nasa.gov/search?q=space&media_type=image&year_start=${searchYear}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erreur réseau');
        
        const data = await response.json();
        let items = data.collection.items;
        
        //Filter out future dates (NASA metadata errors)
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

        // Save to Cache
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
};

function renderGallery(items) {
    const container = document.getElementById('nasa-gallery-container');
    container.innerHTML = '';
    
    const untitledText = window.getTranslation('side_quests.science.gallery.untitled', "Sans titre");
    const noDescText = window.getTranslation('side_quests.science.gallery.no_desc', "Aucune description disponible.");
    const dateUnknownText = window.getTranslation('side_quests.science.gallery.date_label', "Date inconnue");
    const langNote = window.getTranslation('side_quests.science.gallery.lang_note', '');

    items.forEach((item, index) => {
        const dataInfo = item.data[0];
        const linkInfo = item.links ? item.links[0] : null;

        if (!linkInfo) return;

        const title = dataInfo.title || untitledText;
        const description = dataInfo.description || noDescText;
        
        // Check if translation is needed
        const needsTranslation = window.currentLanguage !== 'en' && description !== noDescText;
        const translateBtn = needsTranslation 
            ? `<button onclick="handleTranslate(this, ${index})" class="translate-btn" style="background:transparent; border:1px solid var(--accent); color:var(--accent); font-size:0.75rem; padding:4px 8px; border-radius:12px; cursor:pointer; margin-top:8px; opacity:0.8; transition:0.3s;">
                🌐 Traduire (${window.currentLanguage.toUpperCase()})
               </button>`
            : (needsTranslation && langNote ? `<br><br><em style="font-size: 0.9em; opacity: 0.8;">${langNote}</em>` : '');

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
        card.style.flexShrink = '0';

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

// Translation Helper
async function translateText(text, targetLang) {
    if (!text) return '';
    try {
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
    const targetLang = window.currentLanguage;

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

window.addEventListener('sideQuestsLangUpdated', () => {
    if (document.getElementById('nasa-gallery-container') && localStorage.getItem('nasa_gallery_cache_v2')) {
        window.fetchNASAGallery(false);
    }
});
