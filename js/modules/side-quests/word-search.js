// Word Search Game Logic

const wordSearchThemes = {
    'fr': [
        { name: "Nature", words: ["ARBRE", "FLEUR", "SOLEIL", "LUNE", "RIVIERE", "MONTAGNE", "FORET", "OCEAN", "NUAGE", "ETOILE", "VAGUE", "SABLE", "ROCHER", "PLUIE", "NEIGE", "VENT", "ORAGE", "FEUILLE", "BRANCHE", "RACINE", "HERBE", "MOUSSE", "CAILLOU", "SOURCE", "VOLCAN", "DESERT", "CASCADE", "GROTTE", "VALLEE", "COLLINE", "PRAIRIE", "MARAIS", "ETANG", "LAGON", "RECIF", "CANYON", "OASIS", "GIVRE", "BRUME", "FOUDRE"] },
        { name: "Animaux", words: ["LION", "TIGRE", "OURS", "AIGLE", "REQUIN", "PANDA", "LOUP", "RENARD", "ZEBRE", "ELEPHANT", "GIRAFE", "SINGE", "SERPENT", "TORTUE", "DAUPHIN", "BALEINE", "CHOUETTE", "HIBOU", "CORBEAU", "CYGNE", "CANARD", "POULE", "VACHE", "MOUTON", "CHEVAL", "CHIEN", "CHAT", "SOURIS", "LAPIN", "ECUREUIL", "HERISSON", "CERF", "BICHE", "SANGLIER", "BLAIREAU", "CASTOR", "LOUTRE", "PHOQUE", "PINGOUIN", "GUEPARD"] },
        { name: "Techno", words: ["CODE", "DATA", "ROBOT", "PIXEL", "RESEAU", "ECRAN", "CLAVIER", "SOURIS", "WIFI", "CLOUD", "SERVER", "JAVA", "PYTHON", "HTML", "CSS", "REACT", "NODE", "LINUX", "WINDOWS", "APPLE", "GOOGLE", "AMAZON", "FACEBOOK", "TWITTER", "INSTA", "ALGO", "CACHE", "BUG", "DEBUG", "FRAMEWORK", "API", "JSON", "REST", "SQL", "MONGO", "DOCKER", "GIT", "GITHUB", "GITLAB", "VSCODE"] }
    ],
    'en': [
        { name: "Nature", words: ["TREE", "FLOWER", "SUN", "MOON", "RIVER", "MOUNTAIN", "FOREST", "OCEAN", "CLOUD", "STAR", "WAVE", "SAND", "ROCK", "RAIN", "SNOW", "WIND", "STORM", "LEAF", "BRANCH", "ROOT", "GRASS", "MOSS", "STONE", "SPRING", "VOLCANO", "DESERT", "VALLEY", "HILL", "MEADOW", "SWAMP", "POND", "LAGOON", "REEF", "CANYON", "OASIS", "FROST", "MIST", "THUNDER", "LIGHTNING", "CAVE"] },
        { name: "Animals", words: ["LION", "TIGER", "BEAR", "EAGLE", "SHARK", "PANDA", "WOLF", "FOX", "ZEBRA", "ELEPHANT", "GIRAFFE", "MONKEY", "SNAKE", "TURTLE", "DOLPHIN", "WHALE", "OWL", "CROW", "SWAN", "DUCK", "HEN", "COW", "SHEEP", "HORSE", "GOAT", "DOG", "CAT", "MOUSE", "RABBIT", "SQUIRREL", "DEER", "BOAR", "BADGER", "BEAVER", "OTTER", "SEAL", "PENGUIN", "CHEETAH", "LEOPARD", "JAGUAR"] },
        { name: "Tech", words: ["CODE", "DATA", "ROBOT", "PIXEL", "NETWORK", "SCREEN", "KEYBOARD", "MOUSE", "WIFI", "CLOUD", "SERVER", "JAVA", "PYTHON", "HTML", "CSS", "REACT", "NODE", "LINUX", "WINDOWS", "APPLE", "GOOGLE", "AMAZON", "FACEBOOK", "TWITTER", "INSTA", "ALGO", "CACHE", "BUG", "DEBUG", "FRAMEWORK", "API", "JSON", "REST", "SQL", "MONGO", "DOCKER", "GIT", "GITHUB", "GITLAB", "VSCODE"] }
    ],
    'yo': [
        { name: "Iseda", words: ["IGI", "ODO", "ORUN", "OSUPA", "OKE", "IGBO", "OKUN", "IRAWO", "EWE", "GBONGBO", "AFEFE", "IJI", "OJO", "ERUPE", "IYEP", "OKUTA", "ILU", "IGBI", "KURUKURU", "AMO", "AGINJU", "AFONIFOJI", "PAPA", "ERUN", "OGBE", "ODU", "OGIRI", "IYANRIN", "ERUP", "ERANKO", "EWEKO", "ISO", "ITANNA", "KOTO", "IHO", "OKUN"] },
        { name: "Eranko", words: ["KINNIUN", "EKUN", "ABAMI", "IDI", "ERIN", "EJO", "AGUNTAN", "EWURE", "ADIE", "EYE", "EJA", "IGUN", "OWIW", "ASA", "LOGBO", "AJJA", "OOLOGBO", "ELEDE", "KETEKETE", "ESIN", "EKUTE", "AGBE", "ALUKO", "ODIDE", "LEKELEKE", "APARO", "ETU", "IYA", "OYA", "OKETE", "IGUN", "AKERE", "OPOLO", "ALANGBA", "AWUN"] },
        { name: "Imọ-ẹrọ", words: ["ERO", "AYELUJARA", "DATA", "PIXEL", "WIFI", "CLOUD", "SERVER", "CODE", "ROBOT", "SCREEN", "KEYBOARD", "MOUSE", "PHONE", "LAPTOP", "TABLET", "APP", "WEB", "LINK", "FILE", "FOLDER", "VIDEO", "AUDIO", "IMAGE", "TEXT", "CHAT", "EMAIL", "LOGIN", "PASS", "USER", "ADMIN", "NET", "SITE", "PAGE", "POST", "LIKE"] }
    ],
    'zh': [
        { name: "自然", words: ["树木", "花朵", "太阳", "月亮", "河流", "高山", "森林", "海洋", "云彩", "星星", "波浪", "沙子", "岩石", "雨水", "雪花", "风", "雷暴", "树叶", "树枝", "根", "草", "苔藓", "石头", "泉水", "火山", "沙漠", "瀑布", "洞穴", "山谷", "丘陵", "草原", "沼泽", "池塘", "泻湖", "珊瑚礁", "峡谷", "绿洲", "霜", "雾", "闪电"] },
        { name: "动物", words: ["狮子", "老虎", "熊", "鹰", "鲨鱼", "熊猫", "狼", "狐狸", "斑马", "大象", "长颈鹿", "猴子", "蛇", "乌龟", "海豚", "鲸鱼", "猫头鹰", "乌鸦", "天鹅", "鸭子", "母鸡", "奶牛", "绵羊", "马", "山羊", "狗", "猫", "老鼠", "兔子", "松鼠", "刺猬", "鹿", "野猪", "獾", "海狸", "水獭", "海豹", "企鹅", "猎豹", "豹"] },
        { name: "科技", words: ["代码", "数据", "机器人", "像素", "网络", "屏幕", "键盘", "鼠标", "无线", "云端", "服务器", "JAVA", "PYTHON", "HTML", "CSS", "REACT", "NODE", "LINUX", "WINDOWS", "APPLE", "GOOGLE", "AMAZON", "FACEBOOK", "TWITTER", "INSTA", "算法", "缓存", "漏洞", "调试", "框架", "接口", "JSON", "REST", "SQL", "MONGO", "DOCKER", "GIT", "GITHUB", "GITLAB", "VSCODE"] }
    ],
    'ja': [
        { name: "自然", words: ["木", "花", "太陽", "月", "川", "山", "森", "海", "雲", "星", "波", "砂", "岩", "雨", "雪", "風", "嵐", "葉", "枝", "根", "草", "苔", "石", "泉", "火山", "砂漠", "滝", "洞窟", "谷", "丘", "草原", "沼", "池", "礁", "峡谷", "オアシス", "霜", "霧", "雷", "稲妻"] },
        { name: "動物", words: ["ライオン", "トラ", "クマ", "ワシ", "サメ", "パンダ", "オオカミ", "キツネ", "シマウマ", "ゾウ", "キリン", "サル", "ヘビ", "カメ", "イルカ", "クジラ", "フクロウ", "カラス", "白鳥", "アヒル", "ニワトリ", "牛", "羊", "馬", "ヤギ", "犬", "猫", "ネズミ", "ウサギ", "リス", "ハリネズミ", "鹿", "イノシシ", "アナグマ", "ビーバー", "カワウソ", "アザラシ", "ペンギン", "チーター", "ヒョウ"] },
        { name: "技術", words: ["コード", "データ", "ロボット", "ピクセル", "ネット", "画面", "キーボード", "マウス", "WIFI", "クラウド", "サーバ", "JAVA", "PYTHON", "HTML", "CSS", "REACT", "NODE", "LINUX", "WINDOWS", "APPLE", "GOOGLE", "AMAZON", "FACEBOOK", "TWITTER", "INSTA", "アルゴ", "キャッシュ", "バグ", "デバッグ", "フレームワーク", "API", "JSON", "REST", "SQL", "MONGO", "DOCKER", "GIT", "GITHUB", "GITLAB", "VSCODE"] }
    ],
    'ko': [
        { name: "자연", words: ["나무", "꽃", "태양", "달", "강", "산", "숲", "바다", "구름", "별", "파도", "모래", "바위", "비", "눈", "바람", "폭풍", "잎", "가지", "뿌리", "풀", "이끼", "돌", "샘", "화산", "사막", "폭포", "동굴", "계곡", "언덕", "초원", "늪", "연못", "산호초", "협곡", "오아시스", "서리", "안개", "천둥", "번개"] },
        { name: "동물", words: ["사자", "호랑이", "곰", "독수리", "상어", "팬더", "늑대", "여우", "얼룩말", "코끼리", "기린", "원숭이", "뱀", "거북이", "돌고래", "고래", "부엉이", "까마귀", "백조", "오리", "암탉", "소", "양", "말", "염소", "개", "고양이", "쥐", "토끼", "다람쥐", "고슴도치", "사슴", "멧돼지", "오소리", "비버", "수달", "물개", "펭귄", "치타", "표범"] },
        { name: "기술", words: ["코드", "데이터", "로봇", "픽셀", "네트워크", "화면", "키보드", "마우스", "와이파이", "클라우드", "서버", "JAVA", "PYTHON", "HTML", "CSS", "REACT", "NODE", "LINUX", "WINDOWS", "APPLE", "GOOGLE", "AMAZON", "FACEBOOK", "TWITTER", "INSTA", "알고리즘", "캐시", "버그", "디버그", "프레임워크", "API", "JSON", "REST", "SQL", "MONGO", "DOCKER", "GIT", "GITHUB", "GITLAB", "VSCODE"] }
    ],
    'default': [
        { name: "Theme 1", words: ["HELLO", "WORLD", "GAME", "PLAY", "FUN", "CODE", "MUSIC", "ART", "BOOK", "PEN", "PAPER", "INK", "DESK", "CHAIR", "LAMP", "ROOM", "PHONE", "WATCH", "CLOCK", "TIME", "DAY", "NIGHT", "YEAR", "MONTH", "WEEK"] },
        { name: "Theme 2", words: ["APPLE", "BANANA", "CHERRY", "DATE", "ELDER", "FIG", "GRAPE", "HONEY", "ICE", "JAM", "KIWI", "LEMON", "MANGO", "NUT", "OLIVE", "PEAR", "PLUM", "QUINCE", "RAISIN", "STRAW", "TOMATO", "UGLI", "VANILLA", "WATER", "YAM"] },
        { name: "Theme 3", words: ["RED", "GREEN", "BLUE", "YELLOW", "PINK", "BLACK", "WHITE", "GRAY", "ORANGE", "PURPLE", "BROWN", "GOLD", "SILVER", "TEAL", "NAVY", "CYAN", "LIME", "MAROON", "OLIVE", "VIOLET", "INDIGO", "BEIGE", "IVORY", "OCHRE", "RUBY"] }
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

// Expose functions to window for HTML access
window.selectWordSearchTheme = function(index) {
    wsCurrentThemeIndex = index;
    updateActiveButton('.quest-options:not([style*="scale"]) .quest-option-btn', index);
    startWordSearchGame();
};

window.selectWordSearchSize = function(size) {
    wsGridSize = size;
    // Map size to index for button activation logic (8->0, 10->1, 12->2)
    const index = size === 8 ? 0 : size === 10 ? 1 : 2;
    updateActiveButton('.size-btn', index);
    startWordSearchGame();
};

window.useHint = function() {
    if (wsHintsRemaining <= 0 || wsFoundWords.length === wsWords.length) return;
    
    wsHintsRemaining--;
    _updateHintButton();
    
    // Find a word not yet found
    const availableWords = wsWords.filter(w => !wsFoundWords.includes(w));
    if (availableWords.length === 0) return;
    
    const wordToHint = availableWords[Math.floor(Math.random() * availableWords.length)];
    
    // Find its position in grid (Brute force search matching the logic of placement)
    let path = findWordInGrid(wordToHint);
    
    if (path) {
        // Highlight temporarily
        path.forEach(pos => {
            const cell = document.querySelector(`.ws-cell[data-r="${pos.r}"][data-c="${pos.c}"]`);
            if (cell) cell.classList.add('hint-highlight');
        });
        
        setTimeout(() => {
            document.querySelectorAll('.hint-highlight').forEach(el => el.classList.remove('hint-highlight'));
        }, 3000); 
    } else {
        // Fallback
        wsHintsRemaining++; 
        _updateHintButton();
        const msgEl = document.getElementById('ws-message');
        msgEl.innerHTML = `<span style="color: #ff3b30; font-size: 0.8rem;">Erreur indice: mot introuvable (bug)</span>`;
        setTimeout(() => msgEl.innerHTML = "", 2000);
    }
};

window.resetWordSearch = function() {
    startWordSearchGame(); 
};

window.resetWsBestScore = function() {
    const lang = window.currentLanguage || document.documentElement.lang || 'fr';
    const key = `ws_top3_${wsCurrentThemeIndex}_${wsGridSize}_${lang}`;
    localStorage.removeItem(key);
    
    // Also try to remove potential variations if any (legacy)
    // localStorage.removeItem(`ws_top3_${wsCurrentThemeIndex}_${wsGridSize}_undefined`);

    loadWsBestScore();
    
    // Feedback
    const msgEl = document.getElementById('ws-message');
    const resetText = window.getTranslation('side_quests.literature.word_search.reset_success', "Scores réinitialisés !");
    if(msgEl) {
        msgEl.innerHTML = `<span style="color: var(--text-light); font-size: 0.8rem;">${resetText}</span>`;
        setTimeout(() => msgEl.innerHTML = "", 2000);
    }
};

// Internal Helper Functions
function updateActiveButton(selector, index) {
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
    const lang = window.currentLanguage || 'en';
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
    _updateHintButton();
    
    const themeData = getWordsForCurrentLanguage();
    
    // Limit number of words based on size 
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

// Also exposed because it's called on translationsLoaded
// Note: In non-module scripts, top-level functions are already global, 
// but we assign explicitly to window for clarity and to avoid the recursion bug 
// (overwriting the function with a wrapper that calls itself).
window.updateHintButton = _updateHintButton;

function _updateHintButton() {
    const btn = document.getElementById('ws-hint-btn');
    if (!btn) return;
    
    const hintText = window.getTranslation('side_quests.literature.word_search.hint', "Indice ({0})");
    const noHintText = window.getTranslation('side_quests.literature.word_search.no_hints', "Plus d'indices !");
    
    let finalText = hintText.replace('{0}', wsHintsRemaining);
    if (!hintText || hintText === 'side_quests.literature.word_search.hint') {
         finalText = `Indice (${wsHintsRemaining})`;
    }

    if (wsHintsRemaining > 0) {
        btn.innerText = finalText;
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
    
    const placedWords = [];
    for (const word of words) {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 100) {
            // 8 Directions
            const dir = Math.floor(Math.random() * 8); 
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
    
    wsWords = placedWords;
    
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
    let dr = 0, dc = 0;
    
    if (dir === 0) { dr = 0; dc = 1; }      // H
    else if (dir === 1) { dr = 1; dc = 0; } // V
    else if (dir === 2) { dr = 1; dc = 1; } // Diag (Down-Right)
    else if (dir === 3) { dr = 0; dc = -1; } // Rev H
    else if (dir === 4) { dr = -1; dc = 0; } // Rev V (Up)
    else if (dir === 5) { dr = -1; dc = -1; } // Rev Diag (Up-Left)
    else if (dir === 6) { dr = -1; dc = 1; }  // Diag Up-Right
    else if (dir === 7) { dr = 1; dc = -1; }  // Diag Down-Left

    // Check bounds
    if (r + (word.length-1)*dr >= wsGridSize || r + (word.length-1)*dr < 0) return false;
    if (c + (word.length-1)*dc >= wsGridSize || c + (word.length-1)*dc < 0) return false;

    // Check collision
    for (let i = 0; i < word.length; i++) {
        const nr = r + i*dr;
        const nc = c + i*dc;
        if (wsGrid[nr][nc] !== '' && wsGrid[nr][nc] !== word[i]) return false;
    }
    return true;
}

function placeWord(word, r, c, dir) {
    let dr = 0, dc = 0;
    if (dir === 0) { dr = 0; dc = 1; }
    else if (dir === 1) { dr = 1; dc = 0; }
    else if (dir === 2) { dr = 1; dc = 1; }
    else if (dir === 3) { dr = 0; dc = -1; }
    else if (dir === 4) { dr = -1; dc = 0; }
    else if (dir === 5) { dr = -1; dc = -1; }
    else if (dir === 6) { dr = -1; dc = 1; }
    else if (dir === 7) { dr = 1; dc = -1; }

    for (let i = 0; i < word.length; i++) {
        wsGrid[r + i*dr][c + i*dc] = word[i];
    }
}

function renderGrid() {
    const container = document.getElementById('ws-grid');
    if (!container) return;
    
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
    
    document.addEventListener('mouseup', () => {
        if(isSelecting) handleEnd();
    });
}

function handleStart(e, r, c) {
    e.preventDefault(); 
    if (!isWsRunning && wsFoundWords.length < wsWords.length) startWsTimer();
    if (wsFoundWords.length === wsWords.length) return;

    isSelecting = true;
    selectionStartCell = { r, c };
    highlightCell(r, c, true); 
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
    
    let dr = 0, dc = 0;
    
    if (startR === endR) { // Horizontal
        dc = endC > startC ? 1 : -1;
    } else if (startC === endC) { // Vertical
        dr = endR > startR ? 1 : -1;
    } else if (Math.abs(endR - startR) === Math.abs(endC - startC)) { // Diagonal
        dr = endR > startR ? 1 : -1;
        dc = endC > startC ? 1 : -1;
    } else {
        highlightCell(startR, startC, true);
        return;
    }
    
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
    clearSelectionVisuals();
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
    
    // Check match (normal or reverse is handled by player drag direction)
    // Actually, if word is placed reversed in grid, the player must drag reversed to match the string in wsWords?
    // OR if word is "HELLO" placed as "OLLEH", wsWords has "HELLO".
    // If player drags H->O, string is "HELLO". Match!
    // If player drags O->H, string is "OLLEH". No Match.
    // BUT we usually allow reverse selection for normal words too.
    
    if (wsWords.includes(word) && !wsFoundWords.includes(word)) {
        wsFoundWords.push(word);
        markFound(currentSelectionPath);
        renderWordList();
        checkWin();
    } else {
        const revWord = word.split('').reverse().join('');
        if (wsWords.includes(revWord) && !wsFoundWords.includes(revWord)) {
            wsFoundWords.push(revWord);
            markFound(currentSelectionPath);
            renderWordList();
            checkWin();
        }
    }
}

function findWordInGrid(word) {
    const len = word.length;
    
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
                const dirs = [
                    {dr:0, dc:1}, {dr:1, dc:0}, {dr:1, dc:1}, {dr:0, dc:-1},
                    {dr:-1, dc:0}, {dr:-1, dc:-1}, {dr:-1, dc:1}, {dr:1, dc:-1}
                ];
                
                for(let d of dirs) {
                    let p = check(r, c, d.dr, d.dc);
                    if(p) return p;
                }
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
            li.style.color = "var(--accent)"; 
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

function checkWin() {
    if (wsFoundWords.length === wsWords.length) {
        stopWsTimer();
        const successText = window.getTranslation('side_quests.literature.word_search.success', "Bravo ! Tout trouvé !");
        document.getElementById('ws-message').innerHTML = `<span style="color: #4cd964;">${successText}</span>`;
        saveWsBestScore();
    }
}

function saveWsBestScore() {
    const key = `ws_top3_${wsCurrentThemeIndex}_${wsGridSize}_${window.currentLanguage}`;
    let scores = JSON.parse(localStorage.getItem(key) || '[]');
    
    scores.push(wsSeconds);
    scores.sort((a, b) => a - b);
    scores = scores.slice(0, 3);
    
    localStorage.setItem(key, JSON.stringify(scores));
    loadWsBestScore();
    
    if (scores.length > 0 && scores[0] === wsSeconds) {
        const newRecordText = window.getTranslation('side_quests.literature.word_search.new_record', "Nouveau Record !");
        document.getElementById('ws-message').innerHTML += ` <br>🏆 ${newRecordText}`;
    }
}

function loadWsBestScore() {
    const key = `ws_top3_${wsCurrentThemeIndex}_${wsGridSize}_${window.currentLanguage}`;
    const scores = JSON.parse(localStorage.getItem(key) || '[]');
    const el = document.getElementById('ws-best-score');
    if(!el) return;

    const title = window.getTranslation('side_quests.literature.word_search.best_score_title', "Top 3 Best Score");

    if (scores.length > 0) {
        const formatTime = (s) => {
             const m = Math.floor(s / 60).toString().padStart(2, '0');
             const sec = (s % 60).toString().padStart(2, '0');
             return `${m}:${sec}`;
        };
        
        const top3Str = scores.map(formatTime).join(' | ');
        el.innerHTML = `${title}:<br>${top3Str}`;
        el.style.fontSize = '0.75rem';
        el.style.textAlign = 'right';
    } else {
        el.innerText = `${title}: --:--`;
    }
}

// Auto Init on Lang Update
window.addEventListener('sideQuestsLangUpdated', () => {
    // Only if visible, maybe?
    if(document.getElementById('ws-hint-btn')) {
        updateHintButton(); // This is now _updateHintButton
    }
});
