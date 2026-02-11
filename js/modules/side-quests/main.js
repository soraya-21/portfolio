// Main Entry Point for Side Quests
// This file coordinates the initialization of all sub-modules

document.addEventListener('DOMContentLoaded', () => {
    console.log('Side Quests Main Initialized');
        
    // 1. NASA Gallery
    if (document.getElementById('nasa-gallery-container')) {
        setTimeout(() => {
            if(window.fetchNASAGallery) window.fetchNASAGallery();
        }, 100);
    }

    // 2. Word Search
    if (document.getElementById('ws-grid')) {
        if(window.resetWordSearch) window.resetWordSearch();
    }

    // 3. Philosophy
    if (document.getElementById('philosophy-themes')) {
        if(window.renderPhilosophyThemes) window.renderPhilosophyThemes();
    }
});

