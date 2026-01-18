// Philosophy Definitions Logic

const philosophyThemes = {
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
    ]
};

window.renderPhilosophyThemes = function() {
    const container = document.getElementById('philosophy-themes');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Get themes for current language
    let lang = window.currentLanguage || 'en';
    let themes = philosophyThemes[lang];
    
    // Fallback if not found
    if (!themes) {
        // Try without country code
        const shortLang = lang.split('-')[0];
        themes = philosophyThemes[shortLang] || philosophyThemes['en'];
    }
    
    themes.forEach(theme => {
        const chip = document.createElement('span');
        chip.className = 'theme-chip';
        chip.innerText = theme.label;
        chip.onclick = () => window.fetchPhilosophyDefinition(theme.query);
        container.appendChild(chip);
    });
};

window.fetchPhilosophyDefinition = async function(query) {
    const resultDiv = document.getElementById('philosophy-result');
    window.simulateLoading(resultDiv, async () => {
        let lang = window.currentLanguage || 'en';
        // Wikipedia API language code usually matches (en, fr, zh, ja, ko, yo)
        let wikiLang = lang.split('-')[0];
        
        // Special case for Yoruba if needed, but wikipedia supports yo
        
        try {
            // Wikipedia Summary API
            const url = `https://${wikiLang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
            const response = await fetch(url);
            
            if (!response.ok) throw new Error('Not found');
            
            const data = await response.json();
            
            let extract = data.extract;
            let title = data.title;
            let link = data.content_urls.desktop.page;
            
            resultDiv.innerHTML = `
                <h4 style="margin-top:0; color:var(--accent);">${title}</h4>
                <p>${extract}</p>
                <a href="${link}" target="_blank" style="color:var(--text-light); font-size:0.8rem;">
                   ${window.getTranslation('side_quests.read_more', 'Lire plus sur Wikipédia')} &rarr;
                </a>
            `;
            
        } catch (error) {
            console.error(error);
            resultDiv.innerHTML = `<p style="color: #ff3b30;">${window.getTranslation('side_quests.error', 'Désolé, impossible de trouver une définition.')}</p>`;
        }
    });
};

// Refresh themes on lang update
window.addEventListener('sideQuestsLangUpdated', () => {
    if(document.getElementById('philosophy-themes')) {
        window.renderPhilosophyThemes();
    }
});
