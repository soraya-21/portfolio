// I18n Logic
let currentLang = localStorage.getItem('lang') || 'fr';
let translations = {};

// Theme Logic
const themeBtn = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
let currentTheme = localStorage.getItem('theme') || 'dark';
let particleColor = 'rgba(74, 144, 226, 0.8)';
let particleLineColor = '74, 144, 226';

function updateParticleColor(theme) {
    if (theme === 'light') {
        particleColor = 'rgba(121, 145, 197, 0.6)';
        particleLineColor = '37, 99, 235';
    } else {
        particleColor = 'rgba(19, 48, 77, 0.8)';
        particleLineColor = '74, 144, 226';
    }
}

function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateParticleColor(theme);
}

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(currentTheme);
    });
}

// Initialize theme
applyTheme(currentTheme);

const flags = {
    fr: "assets/flags/fr.png",
    en: "assets/flags/us.png",
    yo: "assets/flags/ng.png",
    zh: "assets/flags/cn.png",
    ja: "assets/flags/jp.png",
    ko: "assets/flags/kr.png"
};

const nativeLanguageNames = {
    fr: "Français",
    en: "English",
    yo: "Yorùbá",
    zh: "中文",
    ja: "日本語",
    ko: "한국어"
};

function updateLanguageSelector() {
    const customOptions = document.querySelector('.custom-options');
    const selectedFlag = document.getElementById('selected-flag');
    const selectedText = document.getElementById('selected-lang-text');
    
    if (!customOptions) return;

    if (selectedFlag) selectedFlag.src = flags[currentLang];
    if (selectedText) selectedText.textContent = nativeLanguageNames[currentLang] || currentLang;

    customOptions.innerHTML = '';
    Object.keys(nativeLanguageNames).forEach(langCode => {
        const option = document.createElement('div');
        option.classList.add('custom-option');
        if (langCode === currentLang) option.classList.add('selected');
        option.dataset.value = langCode;
        
        option.innerHTML = `
            <img src="${flags[langCode]}" alt="${langCode}" class="flag-icon">
            <span>${nativeLanguageNames[langCode]}</span>
        `;
        
        option.addEventListener('click', () => {
            if (langCode === currentLang) return;
            currentLang = langCode;
            localStorage.setItem('lang', currentLang);
            loadTranslations(currentLang);
            document.querySelector('.custom-select').classList.remove('open');
        });
        
        customOptions.appendChild(option);
    });
}


// Custom Dropdown Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const customSelectWrapper = document.querySelector('.custom-select');
    const customSelectTrigger = document.querySelector('.custom-select-trigger');

    if (customSelectTrigger && customSelectWrapper) {
        customSelectTrigger.addEventListener('click', () => {
            customSelectWrapper.classList.toggle('open');
        });
    }

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(section => {
        observer.observe(section);
    });

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (customSelectWrapper && !customSelectWrapper.contains(e.target)) {
            customSelectWrapper.classList.remove('open');
        }
    });
});

async function loadTranslations(lang) {
    try {
        const response = await fetch(`./lang/${lang}.json`);
        translations = await response.json();
        updateText();
        updateProjects(); // Update projects when language changes
        updateLanguageSelector(); // Update language selector options
        
        // Dispatch event for other scripts (like side-quests.js)
        window.dispatchEvent(new CustomEvent('translationsLoaded', { 
            detail: { language: lang, translations: translations } 
        }));
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

function updateText() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let value = translations;
        
        for (const k of keys) {
            if (value) value = value[k];
        }
        
        if (value) {
            if (element.getAttribute('data-i18n-html') === 'true') {
                element.innerHTML = value;
            } else {

                if (value.includes('<br>') || value.includes('<strong>')) {
                     element.innerHTML = value;
                } else {
                     element.textContent = value;
                }
            }
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const keys = key.split('.');
        let value = translations;
        
        for (const k of keys) {
            if (value) value = value[k];
        }
        
        if (value) {
            element.placeholder = value;
        }
    });
}

const langSelect = document.getElementById('language-select');
if (langSelect) {
    langSelect.value = currentLang;
    langSelect.addEventListener('change', (e) => {
        currentLang = e.target.value;
        localStorage.setItem('lang', currentLang);
        loadTranslations(currentLang);
    });
}

// Initial load
loadTranslations(currentLang);

// Avatar aléatoire
const avatars = [
    "./assets/images/avatar_soraya_blue_1_portfolio.png",
    "./assets/images/avatar_soraya_blue_2_portfolio.png",
    "./assets/images/avatar_soraya_blue_portfolio.png",
    "./assets/images/avatar_soraya_portfolio.png"
];
const imgAvatar = document.getElementById("profile-avatar");

// Function to set random avatar
function setRandomAvatar() {
    if (!imgAvatar) return;
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    imgAvatar.onload = () => imgAvatar.classList.add("loaded");
    imgAvatar.src = randomAvatar;
}
setRandomAvatar();

// Popup CV
const openCvBtn = document.getElementById('open-cv');
const closeCvBtn = document.getElementById('close-cv');
const cvPopup = document.getElementById('cv-popup');

if (openCvBtn && cvPopup) {
    openCvBtn.addEventListener('click', e => {
        e.preventDefault();
        cvPopup.classList.add('active');
    });
}

if (closeCvBtn && cvPopup) {
    closeCvBtn.addEventListener('click', () => {
        cvPopup.classList.remove('active');
    });
}

if (cvPopup) {
    cvPopup.addEventListener('click', e => {
        if (e.target === cvPopup) {
            cvPopup.classList.remove('active');
        }
    });
}

// Particules
const canvas = document.getElementById('particles');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight;
    
    let particles = []; 
    const num = 120;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.8;
            this.speedX = Math.random() * 0.6 - 0.3;
            this.speedY = Math.random() * 0.6 - 0.3;
        }
        update() {
            this.x += this.speedX; 
            this.y += this.speedY;
            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = particleColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function initParticles() { 
        particles = []; 
        for (let i = 0; i < num; i++) particles.push(new Particle()); 
    }
    initParticles();
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${particleLineColor}, ${0.3 * (1 - distance/120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
    
    window.addEventListener('resize', () => { 
        canvas.width = window.innerWidth; 
        canvas.height = window.innerHeight; 
        initParticles(); 
    });
}

const container = document.getElementById('projects-container');
const modal = document.getElementById('project-modal');
const modalTitle = modal?.querySelector('.modal-title');
const modalDesc = modal?.querySelector('.modal-desc');
const modalTech = modal?.querySelector('.modal-tech');
const modalImages = modal?.querySelector('.modal-images');
const modalClose = modal?.querySelector('.close');

function updateProjects() {
    if (!container || !translations.projects || !translations.projects.list) return;
    
    container.innerHTML = ''; // Clear existing projects
    const projectsList = translations.projects.list;
    const clickDetailsText = translations.projects.click_details;
    const techLabel = translations.projects.tech_label;

    projectsList.forEach(proj => {
        const card = document.createElement('div');
        card.className = 'project-card';
                
        card.setAttribute('data-after', clickDetailsText);
        card.innerHTML = `<h4>${proj.title}</h4><p>${proj.short}</p>`;
        container.appendChild(card);

        card.onclick = () => {
            if (modalTitle) modalTitle.textContent = proj.title;
            if (modalDesc) modalDesc.textContent = proj.desc;
            if (modalTech) modalTech.textContent = techLabel + proj.tech;
            
            if (modalImages) {
                modalImages.innerHTML = ''; // Clear previous images
                if (proj.images && proj.images.length > 0) {
                    modalImages.style.display = "block";
                    proj.images.forEach(src => {
                        const img = document.createElement('img');
                        img.src = src;
                        img.alt = proj.title;
                        img.style.cssText = 'width:100%; border-radius:16px; margin:12px 0; transition:0.3s;';
                        img.onmouseover = () => img.style.transform = 'scale(1.03)';
                        img.onmouseout = () => img.style.transform = 'scale(1)';
                        modalImages.appendChild(img);
                    });
                } else {
                    modalImages.style.display = "none";
                }
            }
            
            modal.style.display = 'flex';
        };
    });
}

if (modalClose) {
    modalClose.onclick = () => {
        if (modal) modal.style.display = 'none';
    }
}

if (modal) {
    modal.onclick = e => { 
        if (e.target === modal) modal.style.display = 'none'; 
    };
}
