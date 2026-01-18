// Main Entry Point for Side Quests
// This file coordinates the initialization of all sub-modules

document.addEventListener('DOMContentLoaded', () => {
    console.log('Side Quests Main Initialized');
    
    // Initialize specific components if they exist on page
    
    // 1. NASA Gallery
    if (document.getElementById('nasa-gallery-container')) {
        // Delay slightly to allow translations to load if needed, or check cache immediately
        setTimeout(() => {
            if(window.fetchNASAGallery) window.fetchNASAGallery();
        }, 100);
    }

    // 2. Word Search
    if (document.getElementById('ws-grid')) {
        // Start game with defaults
        if(window.resetWordSearch) window.resetWordSearch();
    }

    // 3. Philosophy
    if (document.getElementById('philosophy-themes')) {
        if(window.renderPhilosophyThemes) window.renderPhilosophyThemes();
    }
});

// Re-export or globalize anything if needed (mostly handled by sub-modules attaching to window)
