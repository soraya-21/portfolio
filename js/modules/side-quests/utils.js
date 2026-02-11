// Shared Utility Functions for Side Quests

// Global Translations State (managed here but exposed globally)
window.currentTranslations = window.translations || {};
window.currentLanguage = document.documentElement.lang || 'fr';

// Listen for translation updates
window.addEventListener('translationsLoaded', (e) => {
    console.log('Translations loaded in utils:', e.detail.language);
    window.currentTranslations = e.detail.translations;
    window.currentLanguage = e.detail.language;
    
    window.dispatchEvent(new CustomEvent('sideQuestsLangUpdated', { detail: e.detail }));
});

// Helper: Get translation safely
window.getTranslation = function(key, fallback) {
    if (!window.currentTranslations) return fallback;
    
    const keys = key.split('.');
    let value = window.currentTranslations;
    
    for (const k of keys) {
        if (value && value[k] !== undefined) {
            value = value[k];
        } else {
            return fallback;
        }
    }
    
    return value;
};

// Helper: Simulate "Thinking" time
window.simulateLoading = function(element, callback) {
    const loadingText = window.getTranslation('side_quests.loading', "L'IA réfléchit...");
    
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
};
