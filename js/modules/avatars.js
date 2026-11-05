// Mini Avatars
// 3D mini-figurines that accompany the content of the portfolio.
//
// 1. Config         -> image paths, project cards, companion reactions (edit here)
// 2. Component      -> create / hydrate / setExpression
// 3. Fade-in        -> avatars appear when they enter the viewport
// 4. Project cards  -> small avatar in some project cards
// 5. Companion      -> fixed figurine that reacts to the visitor
// 6. Init
//
// Usage in HTML (hydrated automatically):
//   <span data-avatar="happy"            expression (key of AVATARS)
//         data-variant="inline"          inline | heading | card | standalone | companion
//         data-size="md"                 xs | sm | md | lg (optional, variants have a default)
//         data-animation="float"         float | breathe | none
//         data-hover="laughing"          expression shown while hovered (optional, makes it interactive)
//         data-interactive               hover hop/tilt (optional)
//         data-alt="..."                 alt text (optional: decorative by default)
//         data-loading="eager"></span>   eager for avatars above the fold (lazy by default)
//
// Usage in JS:
//   const el = MiniAvatar.create({ expression: 'coding', variant: 'card' });
//   MiniAvatar.setExpression(el, 'proud');
//   MiniAvatar.show('puzzle-reaction', 'celebrating');               // reaction slot (games)
//   MiniAvatar.show('ws-reaction', 'confused', { duration: 2500 });  // hides itself after 2.5 s
//   MiniAvatar.clear('puzzle-reaction');

(function () {
    'use strict';

    // ======================================================================
    // 1. CONFIG
    // ======================================================================

    const AVATAR_BASE = 'assets/avatar/';
    const AVATAR_EXT = '.webp'; // lightweight versions; the PNG masters sit next to them

    // expression name -> file (without extension), relative to AVATAR_BASE
    const AVATARS = {
        // Emotions
        happy:       'emotions/happy',
        thinking:    'emotions/thinking',
        surprised:   'emotions/surprised',
        confident:   'emotions/confident',
        annoyed:     'emotions/annoyed',
        laughing:    'emotions/laughing',
        shy:         'emotions/shy',
        tired:       'emotions/tired',
        playful:     'emotions/playful',
        focused:     'emotions/focused',
        determined:  'emotions/determined',
        sad:         'emotions/sad',
        curious:     'emotions/curious',
        proud:       'emotions/proud',
        confused:    'emotions/confused',
        // Poses
        coding:      'poses/coding',
        presenting:  'poses/presenting',
        coffee:      'poses/coffee',
        celebrating: 'poses/celebrating',
        waving:      'poses/waving',
        reading:     'poses/reading',     // landscape image (books, cup, bag)
        // Scenes (landscape, with props)
        science:     'scenes/science',
        skincare:    'scenes/skincare',
        developer:   'scenes/developer',
        // One file per theme: the dark version is a full scene fading into the dark page,
        // which would look like a dark stain on the light theme -> cut-out character instead
        hobbies:     { dark: 'scenes/hobbies', light: 'scenes/hobbies-cutout' },
    };

    // Project cards that get an avatar.
    // Key = position in "projects.list" of the lang files (same order in every language).
    const PROJECT_CARD_AVATARS = {
        // e.g. 0: 'proud',  // first project of the list
    };

    // Companion: expression for each situation (highest priority first)
    const COMPANION_REACTIONS = {
        openProject:  'focused',   // a project modal is open
        pageBottom:   'waving',    // the footer (contact) is visible
        hoverProject: 'thinking',  // the mouse is over a project card
        idle:         'curious',   // default
    };

    // Default size of each variant (overridable with data-size)
    const VARIANT_DEFAULT_SIZE = { card: null, inline: null, heading: null, standalone: 'md', companion: null };

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');


    // ======================================================================
    // 2. COMPONENT
    // ======================================================================

    const currentTheme = () =>
        document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';

    function avatarSrc(expression) {
        const file = AVATARS[expression];
        if (!file) {
            console.warn(`[MiniAvatar] Unknown expression "${expression}". Available: ${Object.keys(AVATARS).join(', ')}`);
            return null;
        }
        // a string, or { dark, light } for avatars that have one file per theme
        const path = typeof file === 'string' ? file : (file[currentTheme()] || file.dark);
        return AVATAR_BASE + path + AVATAR_EXT;
    }

    // Real proportions of the image on the avatar box (the CSS 3:4 box is only a placeholder:
    // scenes like "reading" or "hobbies" are landscape)
    function applyRatio(el, img) {
        const set = () => { el.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`; };
        if (img.complete && img.naturalWidth) set();
        else img.addEventListener('load', set, { once: true });
    }

    function preload(expression) {
        const src = avatarSrc(expression);
        if (src) new Image().src = src;
    }

    /**
     * Builds the avatar inside `el` (an empty <span>).
     * @param {HTMLElement} el
     * @param {{expression:string, variant?:string, size?:string, animation?:string,
     *          alt?:string, interactive?:boolean, hover?:string, loading?:string}} options
     */
    function build(el, options) {
        const {
            expression,
            variant = 'inline',
            size = VARIANT_DEFAULT_SIZE[variant],
            animation = 'float',
            alt = '',
            hover = null,
            loading = 'lazy',
        } = options;
        const interactive = options.interactive || Boolean(hover);
        const src = avatarSrc(expression);
        if (!src) return el;

        el.classList.add('mini-avatar', `mini-avatar--${variant}`);
        if (size) el.classList.add(`mini-avatar--${size}`);
        if (animation && animation !== 'none') el.classList.add(`mini-avatar--${animation}`);
        if (interactive) el.classList.add('mini-avatar--interactive');

        // Random negative delay: avatars never float in sync
        el.style.setProperty('--float-delay', `${(-Math.random() * 5).toFixed(2)}s`);

        // Decorative by default (hidden from screen readers)
        if (!alt) el.setAttribute('aria-hidden', 'true');

        const body = document.createElement('span');
        body.className = 'mini-avatar__body';

        // Two stacked images: the inactive one receives the next expression, then they crossfade
        for (let i = 0; i < 2; i++) {
            const img = document.createElement('img');
            img.className = 'mini-avatar__img';
            img.alt = i === 0 ? alt : '';
            img.decoding = 'async';
            img.draggable = false;
            if (i === 0) {
                img.loading = loading;
                img.src = src;
                img.classList.add('is-active');
                applyRatio(el, img);
            }
            body.appendChild(img);
        }
        el.appendChild(body);
        el.dataset.expression = expression;

        if (hover) {
            const base = expression;
            preload(hover);
            el.addEventListener('mouseenter', () => setExpression(el, hover));
            el.addEventListener('mouseleave', () => setExpression(el, base));
        }

        if (variant !== 'companion') observeFadeIn(el);
        return el;
    }

    function create(options) {
        return build(document.createElement('span'), options);
    }

    /** Turns every <span data-avatar="..."> of `root` into an avatar. */
    function hydrate(root = document) {
        root.querySelectorAll('[data-avatar]:not(.mini-avatar)').forEach(el => {
            const d = el.dataset;
            build(el, {
                expression: d.avatar,
                variant: d.variant,
                size: d.size,
                animation: d.animation,
                alt: d.alt,
                hover: d.hover,
                interactive: 'interactive' in d,
                loading: d.loading,
            });
        });
    }

    /**
     * Smoothly switches the avatar to another expression (crossfade + small bounce).
     * `force`: reload even if it's the same expression (e.g. its file depends on the theme).
     */
    function setExpression(el, expression, force = false) {
        if (!el || (el.dataset.expression === expression && !force)) return;
        const src = avatarSrc(expression);
        if (!src) return;

        const imgs = el.querySelectorAll('.mini-avatar__img');
        const active = el.querySelector('.mini-avatar__img.is-active');
        const next = imgs[0] === active ? imgs[1] : imgs[0];
        el.dataset.expression = expression;

        // Ignore the result of an older switch if the expression changed again meanwhile
        const token = (el._miniAvatarToken = (el._miniAvatarToken || 0) + 1);
        const show = () => {
            next.onload = null;
            if (token !== el._miniAvatarToken) return;
            el.style.aspectRatio = `${next.naturalWidth} / ${next.naturalHeight}`;
            next.classList.add('is-active');
            active.classList.remove('is-active');
            if (!force) react(el); // no bounce for a simple theme switch
        };
        next.onload = show;
        next.src = src;
        if (next.complete && next.naturalWidth) show(); // already in cache
    }

    // --- Reaction slots: an empty container where a game shows an avatar on demand ---

    function resolveSlot(slot) {
        return typeof slot === 'string' ? document.getElementById(slot) : slot;
    }

    /**
     * Shows an avatar in `slot` (created the first time, then the expression just changes).
     * @param {string|HTMLElement} slot  id or element of the container
     * @param {string} expression
     * @param {{duration?: number, size?: string}} options  duration (ms): hides it automatically
     */
    function show(slot, expression, { duration = 0, size = 'md' } = {}) {
        slot = resolveSlot(slot);
        if (!slot) return null;
        clearTimeout(slot._miniAvatarTimer);

        let el = slot.querySelector('.mini-avatar');
        if (el) {
            setExpression(el, expression);
        } else {
            el = create({ expression, variant: 'standalone', size, loading: 'eager' });
            slot.appendChild(el);
        }
        if (duration) slot._miniAvatarTimer = setTimeout(() => clear(slot), duration);
        return el;
    }

    /** Removes the avatar of a reaction slot. */
    function clear(slot) {
        slot = resolveSlot(slot);
        if (!slot) return;
        clearTimeout(slot._miniAvatarTimer);
        slot.replaceChildren();
    }

    function react(el) {
        if (reducedMotion.matches) return;
        el.classList.remove('is-reacting');
        void el.offsetWidth; // restart the animation
        el.classList.add('is-reacting');
        el.addEventListener('animationend', () => el.classList.remove('is-reacting'), { once: true });
    }


    // ======================================================================
    // 3. FADE-IN
    // ======================================================================

    const fadeInObserver = 'IntersectionObserver' in window
        ? new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    fadeInObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 })
        : null;

    function observeFadeIn(el) {
        if (fadeInObserver) fadeInObserver.observe(el);
        else el.classList.add('is-visible');
    }


    // ======================================================================
    // 3b. GLUE (inline & heading avatars never end up alone on a new line)
    // ======================================================================

    // Browsers always allow a line break before an image, even after a no-break character.
    // So the last word before the avatar is moved, with the avatar, into a nowrap wrapper:
    //   <span data-i18n>...beaucoup de </span><span class="mini-avatar-glue">plaisir<avatar></span>
    // Redone after each language change, because script.js rewrites the translated text.
    function glue(avatar) {
        let wrapper = avatar.parentElement.classList.contains('mini-avatar-glue') ? avatar.parentElement : null;
        const textNode = (wrapper || avatar).previousSibling;
        if (!textNode) return;
        const isTextNode = textNode.nodeType === Node.TEXT_NODE;
        // only plain text (a text node, or an element without children like <br> or <strong>)
        if (!isTextNode && (textNode.nodeType !== Node.ELEMENT_NODE || textNode.children.length)) return;

        const full = textNode.textContent;
        if (textNode._miniAvatarGlued === full) return; // already split, nothing changed since
        if (!full.trim()) return;

        // last word; if there is no space or the "word" is a long chunk (zh, ja) -> last 2 characters
        const match = full.match(/^([\s\S]*\s)(\S+)\s*$/);
        const useWord = match && match[2].length <= 15;
        const rest = useWord ? match[1] : full.slice(0, -2);
        const word = useWord ? match[2] : full.slice(-2);

        if (!wrapper) {
            wrapper = document.createElement('span');
            wrapper.className = 'mini-avatar-glue';
            avatar.before(wrapper);
            wrapper.append(document.createTextNode(''), avatar);
        }
        textNode.textContent = rest;
        textNode._miniAvatarGlued = rest;
        wrapper.firstChild.textContent = word;
    }

    function glueAll() {
        document.querySelectorAll('.mini-avatar--inline, .mini-avatar--heading').forEach(glue);
    }


    // ======================================================================
    // 4. PROJECT CARDS
    // ======================================================================

    // Cards are rebuilt by updateProjects() (script.js) on every language change,
    // so we watch the container and decorate the new cards.
    function initProjectCards() {
        const container = document.getElementById('projects-container');
        if (!container) return;

        const decorate = () => {
            container.querySelectorAll(':scope > .project-card').forEach((card, index) => {
                const expression = PROJECT_CARD_AVATARS[index];
                if (!expression || card.querySelector('.mini-avatar')) return;
                card.classList.add('has-mini-avatar');
                card.appendChild(create({ expression, variant: 'card', animation: 'breathe' }));
            });
        };

        new MutationObserver(decorate).observe(container, { childList: true });
        decorate();
    }


    // ======================================================================
    // 5. COMPANION
    // ======================================================================

    function initCompanion() {
        const header = document.querySelector('header');
        const footer = document.getElementById('contact');
        const projects = document.getElementById('projects-container');
        const modal = document.getElementById('project-modal');
        const cvPopup = document.getElementById('cv-popup');
        if (!header || !('IntersectionObserver' in window)) return;

        const companion = create({
            expression: COMPANION_REACTIONS.idle,
            variant: 'companion',
            animation: 'breathe',
            interactive: true,
            loading: 'eager',
        });
        document.body.appendChild(companion);
        Object.values(COMPANION_REACTIONS).forEach(preload); // instant reactions

        const state = { pastHeader: false, bottom: false, hover: false, modal: false, cv: false };

        const update = () => {
            // Visible once the header is scrolled past, hidden while the CV popup is open
            companion.classList.toggle('is-visible', state.pastHeader && !state.cv);

            const expression =
                state.modal  ? COMPANION_REACTIONS.openProject :
                state.bottom ? COMPANION_REACTIONS.pageBottom :
                state.hover  ? COMPANION_REACTIONS.hoverProject :
                               COMPANION_REACTIONS.idle;
            setExpression(companion, expression);
        };

        // Scrolled past the header?
        new IntersectionObserver(([entry]) => {
            state.pastHeader = !entry.isIntersecting;
            update();
        }).observe(header);

        // Bottom of the page (footer / contact visible)
        if (footer) {
            new IntersectionObserver(([entry]) => {
                state.bottom = entry.isIntersecting;
                update();
            }, { threshold: 0.3 }).observe(footer);
        }

        // Hover on a project card (event delegation: cards are rebuilt on language change)
        if (projects) {
            projects.addEventListener('mouseover', e => {
                if (e.target.closest('.project-card') && !state.hover) { state.hover = true; update(); }
            });
            projects.addEventListener('mouseout', e => {
                const from = e.target.closest('.project-card');
                const to = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.project-card');
                if (from && !to) { state.hover = false; update(); }
            });
        }

        // Project modal open/closed (script.js toggles style.display)
        if (modal) {
            new MutationObserver(() => {
                state.modal = modal.style.display === 'flex';
                if (!state.modal) state.hover = false;
                update();
            }).observe(modal, { attributes: true, attributeFilter: ['style'] });
        }

        // CV popup open/closed (script.js toggles the "active" class)
        if (cvPopup) {
            new MutationObserver(() => {
                state.cv = cvPopup.classList.contains('active');
                update();
            }).observe(cvPopup, { attributes: true, attributeFilter: ['class'] });
        }
    }


    // ======================================================================
    // 6. INIT
    // ======================================================================

    function init() {
        hydrate();
        glueAll();
        initProjectCards();
        initCompanion();
    }

    // script.js rewrites the translated texts on every language change, then fires this event
    window.addEventListener('translationsLoaded', glueAll);

    // Theme switch: reload the avatars that have one file per theme (e.g. "hobbies")
    new MutationObserver(() => {
        document.querySelectorAll('.mini-avatar').forEach(el => {
            if (typeof AVATARS[el.dataset.expression] === 'object') setExpression(el, el.dataset.expression, true);
        });
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

    // Public API
    window.MiniAvatar = { create, hydrate, setExpression, show, clear, AVATARS };
})();
