// Photo Puzzle Logic
// puzzleOrder[position] = id of the piece currently at that position.
// A piece id encodes its correct place: row = floor(id / size), col = id % size.
// The puzzle is solved when puzzleOrder[i] === i for every i.

const PUZZLE_PHOTOS = [
    'assets/images/puzzle/boss-lady.webp',
    'assets/images/puzzle/foot-de-rue-avatar.webp',
    'assets/images/puzzle/minecraft-avatar.webp',
    'assets/images/puzzle/ranma-avatar.webp',
    'assets/images/puzzle/valkyrie-apocalypse-avatar.webp',
];

let puzzleSize = 3;
let puzzlePhotoIndex = 0;
let puzzleOrder = [];
let puzzleSelected = null;
let puzzleMoves = 0;
let puzzleSolved = false;
let puzzleSeconds = 0;
let puzzleTimerInterval = null;

// One Top 3 per level AND per photo, e.g. "puzzle_top3_5_ranma-avatar".
const puzzleScoresKey = (size = puzzleSize, photoIndex = puzzlePhotoIndex) => {
    const photoName = PUZZLE_PHOTOS[photoIndex].split('/').pop().replace(/\.[^.]+$/, '');
    return `puzzle_top3_${size}_${photoName}`;
};

(function migrateOldPuzzleScores() {
    try {
        [3, 5, 7].forEach(size => {
            const oldKey = `puzzle_top3_${size}`;
            const oldRaw = localStorage.getItem(oldKey);
            if (oldRaw === null) return;

            const newKey = puzzleScoresKey(size, 0);
            const merged = [
                ...JSON.parse(oldRaw),
                ...JSON.parse(localStorage.getItem(newKey) || '[]'),
            ]
                .sort((a, b) => a.time - b.time || a.moves - b.moves)
                .slice(0, 3);

            localStorage.setItem(newKey, JSON.stringify(merged));
            localStorage.removeItem(oldKey);
        });
    } catch (e) {
        console.warn('Puzzle scores migration failed:', e);
    }
})();
const puzzleGrid = () => document.getElementById('puzzle-grid');

function formatPuzzleTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

//   Timer  

function startPuzzleTimer() {
    if (puzzleTimerInterval) return; // already running
    puzzleTimerInterval = setInterval(() => {
        puzzleSeconds++;
        updatePuzzleStats();
    }, 1000);
}

function stopPuzzleTimer() {
    clearInterval(puzzleTimerInterval);
    puzzleTimerInterval = null;
}

function updatePuzzleStats() {
    document.getElementById('puzzle-timer').textContent = formatPuzzleTime(puzzleSeconds);
    document.getElementById('puzzle-moves').textContent = puzzleMoves;
}

//   Game  

function isPuzzleSolved() {
    return puzzleOrder.every((pieceId, position) => pieceId === position);
}

function shufflePuzzle() {
    // Fisher-Yates, repeated until the result is not already solved
    do {
        for (let i = puzzleOrder.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [puzzleOrder[i], puzzleOrder[j]] = [puzzleOrder[j], puzzleOrder[i]];
        }
    } while (isPuzzleSolved());
}

window.initPuzzle = function () {
    stopPuzzleTimer();
    puzzleSeconds = 0;
    puzzleMoves = 0;
    puzzleSelected = null;
    puzzleSolved = false;

    puzzleOrder = [...Array(puzzleSize * puzzleSize).keys()];
    shufflePuzzle();

    document.getElementById('puzzle-message').innerHTML = '';
    document.getElementById('puzzle-preview').src = PUZZLE_PHOTOS[puzzlePhotoIndex];

    buildPuzzleGrid();
    updatePuzzleStats();
    renderPuzzleScores();
};

function buildPuzzleGrid() {
    const grid = puzzleGrid();
    const photo = PUZZLE_PHOTOS[puzzlePhotoIndex];

    grid.classList.remove('solved');
    grid.style.gridTemplateColumns = `repeat(${puzzleSize}, 1fr)`;
    grid.innerHTML = '';

    puzzleOrder.forEach((_, position) => {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.style.backgroundImage = `url('${photo}')`;
        piece.style.backgroundSize = `${puzzleSize * 100}% ${puzzleSize * 100}%`;
        piece.addEventListener('click', () => onPuzzlePieceClick(position));
        grid.appendChild(piece);
        paintPuzzlePiece(position);
    });
}

// Shows the right slice of the photo on the piece at this position
function paintPuzzlePiece(position) {
    const piece = puzzleGrid().children[position];
    const pieceId = puzzleOrder[position];
    const step = 100 / (puzzleSize - 1);
    const col = pieceId % puzzleSize;
    const row = Math.floor(pieceId / puzzleSize);
    piece.style.backgroundPosition = `${col * step}% ${row * step}%`;
}

function onPuzzlePieceClick(position) {
    if (puzzleSolved) return;
    startPuzzleTimer(); // starts on the first click only

    const pieces = puzzleGrid().children;

    // First click: select
    if (puzzleSelected === null) {
        puzzleSelected = position;
        pieces[position].classList.add('selected');
        return;
    }

    // Second click: swap (or deselect if it's the same piece)
    pieces[puzzleSelected].classList.remove('selected');
    if (puzzleSelected !== position) {
        [puzzleOrder[puzzleSelected], puzzleOrder[position]] =
            [puzzleOrder[position], puzzleOrder[puzzleSelected]];
        paintPuzzlePiece(puzzleSelected);
        paintPuzzlePiece(position);
        puzzleMoves++;
        updatePuzzleStats();
    }
    puzzleSelected = null;

    if (isPuzzleSolved()) finishPuzzle();
}

function finishPuzzle() {
    puzzleSolved = true;
    stopPuzzleTimer();
    puzzleGrid().classList.add('solved');

    const isRecord = savePuzzleScore();

    const winText = window.getTranslation('side_quests.puzzle.win', 'Bravo ! Terminé en {time} et {moves} coups 🎉')
        .replace('{time}', formatPuzzleTime(puzzleSeconds))
        .replace('{moves}', puzzleMoves);

    let html = `<span style="color: #4cd964;">${winText}</span>`;
    if (isRecord) {
        html += `<br>🏆 ${window.getTranslation('side_quests.puzzle.new_record', 'Nouveau record !')}`;
    }
    document.getElementById('puzzle-message').innerHTML = html;
}

//Top 3 scores (one list per level and per photo)

function getPuzzleScores() {
    try {
        return JSON.parse(localStorage.getItem(puzzleScoresKey()) || '[]');
    } catch {
        return [];
    }
}

// Returns true if this game is the new best score for this level + photo
function savePuzzleScore() {
    const entry = { time: puzzleSeconds, moves: puzzleMoves };
    const scores = getPuzzleScores();

    scores.push(entry);
    scores.sort((a, b) => a.time - b.time || a.moves - b.moves); // fastest first, then fewest moves
    const top3 = scores.slice(0, 3);

    localStorage.setItem(puzzleScoresKey(), JSON.stringify(top3));
    renderPuzzleScores();
    return top3[0] === entry;
}

function renderPuzzleScores() {
    const list = document.getElementById('puzzle-scores');
    const scores = getPuzzleScores();

    if (scores.length === 0) {
        list.innerHTML = `<li>${window.getTranslation('side_quests.puzzle.no_score', 'Aucun score pour ce niveau et cette photo')}</li>`;
        return;
    }

    const medals = ['🥇', '🥈', '🥉'];
    const movesLabel = window.getTranslation('side_quests.puzzle.moves', 'Coups').toLowerCase();
    list.innerHTML = scores
        .map((s, i) => `<li>${medals[i]} ${formatPuzzleTime(s.time)} · ${s.moves} ${movesLabel}</li>`)
        .join('');
}

window.resetPuzzleScores = function () {
    localStorage.removeItem(puzzleScoresKey());
    renderPuzzleScores();
};

//   Settings (level & photo)  

window.selectPuzzleSize = function (size) {
    puzzleSize = size;
    document.querySelectorAll('.puzzle-size-btn').forEach(btn => {
        btn.classList.toggle('active', Number(btn.dataset.size) === size);
    });
    initPuzzle();
};

window.selectPuzzlePhoto = function (index) {
    puzzlePhotoIndex = index;
    document.querySelectorAll('.puzzle-thumb').forEach((img, i) => {
        img.classList.toggle('active', i === index);
    });
    initPuzzle();
};

window.renderPuzzlePhotos = function () {
    document.getElementById('puzzle-photos').innerHTML = PUZZLE_PHOTOS.map((src, i) => `
        <img src="${src}" alt="Photo ${i + 1}" loading="lazy"
             class="puzzle-thumb ${i === puzzlePhotoIndex ? 'active' : ''}"
             onclick="selectPuzzlePhoto(${i})">
    `).join('');
};

// Re-translate the score list when the language changes
window.addEventListener('sideQuestsLangUpdated', () => {
    if (puzzleGrid()) renderPuzzleScores();
});
