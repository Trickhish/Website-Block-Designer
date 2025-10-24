// ============================================
// WEBSITE BUILDER FRAMEWORK
// ============================================

class Website {
    constructor(options = {}) {
        this.pages = {};
        this.currentPage = null;
        this.options = {
            smoothScrolling: options.smoothScrolling || false,
            defaultPage: options.defaultPage || 'home',
            theme: options.theme || 'light',
            darkMode: options.darkMode || false,
            colors: {
                primary: options.colors?.primary || '#6c63ff',
                primaryDark: options.colors?.primaryDark || '#5952d4',
                // Light theme colors
                light: {
                    text: options.colors?.light?.text || '#333',
                    textMuted: options.colors?.light?.textMuted || '#666',
                    background: options.colors?.light?.background || '#ffffff',
                    backgroundAlt: options.colors?.light?.backgroundAlt || '#f8f9fa',
                    border: options.colors?.light?.border || 'rgba(0,0,0,0.1)',
                    shadow: options.colors?.light?.shadow || '0 2px 10px rgba(0,0,0,0.1)',
                    shadowHover: options.colors?.light?.shadowHover || '0 4px 20px rgba(0,0,0,0.15)',
                    ...options.colors?.light
                },
                // Dark theme colors
                dark: {
                    text: options.colors?.dark?.text || '#e1e1e1',
                    textMuted: options.colors?.dark?.textMuted || '#b0b0b0',
                    background: options.colors?.dark?.background || '#1a1a2e',
                    backgroundAlt: options.colors?.dark?.backgroundAlt || '#16213e',
                    border: options.colors?.dark?.border || 'rgba(255,255,255,0.1)',
                    shadow: options.colors?.dark?.shadow || '0 2px 10px rgba(0,0,0,0.3)',
                    shadowHover: options.colors?.dark?.shadowHover || '0 4px 20px rgba(0,0,0,0.4)',
                    ...options.colors?.dark
                },
                ...options.colors
            },
            ...options
        };
        this.container = null;
    }

    add(page) {
        this.pages[page.name] = page;
        page.website = this;
        return this;
    }

    display(containerSelector = 'body') {
        this.container = document.querySelector(containerSelector);
        
        if (!this.container) {
            console.error('Container not found');
            return;
        }

        // Apply smooth scrolling if enabled
        if (this.options.smoothScrolling) {
            document.documentElement.style.scrollBehavior = 'smooth';
        }

        // Apply theme and custom colors
        this.setTheme(this.options.darkMode ? 'dark' : 'light');

        // Display default page
        this.showPage(this.options.defaultPage);
    }

    setTheme(theme) {
        this.options.theme = theme;
        this.options.darkMode = theme === 'dark';
        document.body.setAttribute('data-theme', theme);
        
        // Apply custom colors to CSS variables
        this.applyCustomColors();
        
        // Trigger theme change event for components that need to update
        const event = new CustomEvent('themechange', { detail: { theme } });
        document.dispatchEvent(event);
    }

    applyCustomColors() {
        const root = document.documentElement;
        const colors = this.options.colors;
        const themeColors = colors[this.options.theme] || colors.light;
        
        // Apply primary colors (theme-independent)
        root.style.setProperty('--primary-color', colors.primary);
        root.style.setProperty('--primary-dark', colors.primaryDark);
        
        // Apply theme-specific colors
        root.style.setProperty('--text-color', themeColors.text);
        root.style.setProperty('--text-muted', themeColors.textMuted);
        root.style.setProperty('--bg-color', themeColors.background);
        root.style.setProperty('--bg-alt', themeColors.backgroundAlt);
        root.style.setProperty('--border-color', themeColors.border);
        root.style.setProperty('--shadow', themeColors.shadow);
        root.style.setProperty('--shadow-hover', themeColors.shadowHover);
    }

    toggleTheme() {
        const newTheme = this.options.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        return newTheme;
    }

    showPage(pageName) {
        const page = this.pages[pageName];
        if (!page) {
            console.error(`Page "${pageName}" not found`);
            return;
        }

        this.currentPage = page;
        this.container.innerHTML = '';
        this.container.appendChild(page.render());

        // Trigger page change event for components that need to update
        const event = new CustomEvent('pagechange', { 
            detail: { 
                pageName: pageName, 
                page: page,
                pages: Object.keys(this.pages)
            } 
        });
        document.dispatchEvent(event);

        // Handle hash navigation
        if (window.location.hash) {
            setTimeout(() => {
                const element = document.querySelector(window.location.hash);
                if (element) element.scrollIntoView();
            }, 100);
        }
    }

    getPageNames() {
        return Object.keys(this.pages);
    }

    getCurrentPageName() {
        return this.currentPage ? this.currentPage.name : null;
    }

    updateColors(newColors) {
        // Deep merge new colors with existing colors
        this.options.colors = this.mergeColors(this.options.colors, newColors);
        this.applyCustomColors();
    }

    mergeColors(existing, updates) {
        const result = { ...existing };
        
        Object.keys(updates).forEach(key => {
            if (key === 'light' || key === 'dark') {
                result[key] = { ...existing[key], ...updates[key] };
            } else {
                result[key] = updates[key];
            }
        });
        
        return result;
    }
}

class TeamSection {
    constructor(title, options = {}) {
        this.title = title;
        this.options = {
            id: options.id || null,
            subtitle: options.subtitle || '',
            members: options.members || [],
            columns: options.columns || 3,
            ...options
        };
    }

    render() {
        const section = document.createElement('section');
        section.className = 'wb-team';
        if (this.options.id) section.id = this.options.id;

        const container = document.createElement('div');
        container.className = 'wb-container';

        const title = document.createElement('h2');
        title.className = 'wb-section-title';
        title.textContent = this.title;
        container.appendChild(title);

        if (this.options.subtitle) {
            const subtitle = document.createElement('p');
            subtitle.className = 'wb-team__subtitle';
            subtitle.textContent = this.options.subtitle;
            container.appendChild(subtitle);
        }

        const grid = document.createElement('div');
        grid.className = 'wb-team__grid';

        this.options.members.forEach(member => {
            const card = document.createElement('div');
            card.className = 'wb-team-card';

            if (member.image) {
                const img = document.createElement('img');
                img.className = 'wb-team-card__image';
                img.src = member.image;
                img.alt = member.name;
                img.loading = 'lazy';
                card.appendChild(img);
            }

            const info = document.createElement('div');
            info.className = 'wb-team-card__info';

            const name = document.createElement('h3');
            name.className = 'wb-team-card__name';
            name.textContent = member.name;
            info.appendChild(name);

            if (member.role) {
                const role = document.createElement('p');
                role.className = 'wb-team-card__role';
                role.textContent = member.role;
                info.appendChild(role);
            }

            if (member.description) {
                const desc = document.createElement('p');
                desc.className = 'wb-team-card__description';
                desc.textContent = member.description;
                info.appendChild(desc);
            }

            card.appendChild(info);
            grid.appendChild(card);
        });

        container.appendChild(grid);
        section.appendChild(container);
        return section;
    }
}

class TextSection {
    constructor(title, content, options = {}) {
        this.title = title;
        this.content = content;
        this.options = {
            id: options.id || null,
            alignment: options.alignment || 'left', // left, center, right
            maxWidth: options.maxWidth || '800px',
            bgColor: options.bgColor || 'transparent',
            ...options
        };
    }

    render() {
        const section = document.createElement('section');
        section.className = 'wb-text-section';
        if (this.options.id) section.id = this.options.id;

        if (this.options.bgColor !== 'transparent') {
            section.style.backgroundColor = this.options.bgColor;
        }

        const container = document.createElement('div');
        container.className = 'wb-container';

        const content = document.createElement('div');
        content.className = `wb-text-section__content wb-text-section__content--${this.options.alignment}`;
        content.style.maxWidth = this.options.maxWidth;

        if (this.title) {
            const title = document.createElement('h2');
            title.className = 'wb-section-title';
            title.textContent = this.title;
            content.appendChild(title);
        }

        const text = document.createElement('div');
        text.className = 'wb-text-section__text';
        text.innerHTML = this.content;
        content.appendChild(text);

        container.appendChild(content);
        section.appendChild(container);
        return section;
    }
}

class FAQ {
    constructor(title, options = {}) {
        this.title = title;
        this.options = {
            id: options.id || null,
            subtitle: options.subtitle || '',
            questions: options.questions || [],
            ...options
        };
    }

    render() {
        const section = document.createElement('section');
        section.className = 'wb-faq';
        if (this.options.id) section.id = this.options.id;

        const container = document.createElement('div');
        container.className = 'wb-container';

        const title = document.createElement('h2');
        title.className = 'wb-section-title';
        title.textContent = this.title;
        container.appendChild(title);

        if (this.options.subtitle) {
            const subtitle = document.createElement('p');
            subtitle.className = 'wb-faq__subtitle';
            subtitle.textContent = this.options.subtitle;
            container.appendChild(subtitle);
        }

        const faqList = document.createElement('div');
        faqList.className = 'wb-faq__list';

        this.options.questions.forEach((item, index) => {
            const faqItem = document.createElement('div');
            faqItem.className = 'wb-faq__item';

            const question = document.createElement('button');
            question.className = 'wb-faq__question';
            question.textContent = item.question;
            question.addEventListener('click', () => this.toggleAnswer(faqItem));

            const answer = document.createElement('div');
            answer.className = 'wb-faq__answer';
            answer.innerHTML = item.answer;

            faqItem.appendChild(question);
            faqItem.appendChild(answer);
            faqList.appendChild(faqItem);
        });

        container.appendChild(faqList);
        section.appendChild(container);
        return section;
    }

    toggleAnswer(faqItem) {
        const isActive = faqItem.classList.contains('wb-faq__item--active');
        
        // Close all other items
        faqItem.parentNode.querySelectorAll('.wb-faq__item').forEach(item => {
            item.classList.remove('wb-faq__item--active');
        });

        // Toggle current item
        if (!isActive) {
            faqItem.classList.add('wb-faq__item--active');
        }
    }
}

class StatsSection {
    constructor(title, options = {}) {
        this.title = title;
        this.options = {
            id: options.id || null,
            stats: options.stats || [],
            bgColor: options.bgColor || 'transparent',
            ...options
        };
    }

    render() {
        const section = document.createElement('section');
        section.className = 'wb-stats';
        if (this.options.id) section.id = this.options.id;

        if (this.options.bgColor !== 'transparent') {
            section.style.backgroundColor = this.options.bgColor;
        }

        const container = document.createElement('div');
        container.className = 'wb-container';

        if (this.title) {
            const title = document.createElement('h2');
            title.className = 'wb-section-title';
            title.textContent = this.title;
            container.appendChild(title);
        }

        const grid = document.createElement('div');
        grid.className = 'wb-stats__grid';

        this.options.stats.forEach(stat => {
            const statItem = document.createElement('div');
            statItem.className = 'wb-stat-item';

            const number = document.createElement('div');
            number.className = 'wb-stat-item__number';
            number.textContent = stat.number;
            
            const label = document.createElement('div');
            label.className = 'wb-stat-item__label';
            label.textContent = stat.label;

            if (stat.suffix) {
                number.textContent += stat.suffix;
            }

            statItem.appendChild(number);
            statItem.appendChild(label);
            grid.appendChild(statItem);
        });

        container.appendChild(grid);
        section.appendChild(container);
        return section;
    }
}

class VideoSection {
    constructor(title, videoUrl, options = {}) {
        this.title = title;
        this.videoUrl = videoUrl;
        this.options = {
            id: options.id || null,
            subtitle: options.subtitle || '',
            poster: options.poster || null,
            autoplay: options.autoplay || false,
            controls: options.controls !== false,
            ...options
        };
    }

    render() {
        const section = document.createElement('section');
        section.className = 'wb-video';
        if (this.options.id) section.id = this.options.id;

        const container = document.createElement('div');
        container.className = 'wb-container';

        if (this.title) {
            const title = document.createElement('h2');
            title.className = 'wb-section-title';
            title.textContent = this.title;
            container.appendChild(title);
        }

        if (this.options.subtitle) {
            const subtitle = document.createElement('p');
            subtitle.className = 'wb-video__subtitle';
            subtitle.textContent = this.options.subtitle;
            container.appendChild(subtitle);
        }

        const videoContainer = document.createElement('div');
        videoContainer.className = 'wb-video__container';

        const video = document.createElement('video');
        video.className = 'wb-video__player';
        video.src = this.videoUrl;
        video.controls = this.options.controls;
        video.autoplay = this.options.autoplay;
        
        if (this.options.poster) {
            video.poster = this.options.poster;
        }

        videoContainer.appendChild(video);
        container.appendChild(videoContainer);
        section.appendChild(container);
        return section;
    }
}

class Timeline {
    constructor(title, options = {}) {
        this.title = title;
        this.options = {
            id: options.id || null,
            events: options.events || [],
            ...options
        };
    }

    render() {
        const section = document.createElement('section');
        section.className = 'wb-timeline';
        if (this.options.id) section.id = this.options.id;

        const container = document.createElement('div');
        container.className = 'wb-container';

        const title = document.createElement('h2');
        title.className = 'wb-section-title';
        title.textContent = this.title;
        container.appendChild(title);

        const timeline = document.createElement('div');
        timeline.className = 'wb-timeline__container';

        this.options.events.forEach((event, index) => {
            const item = document.createElement('div');
            item.className = 'wb-timeline__item';

            const marker = document.createElement('div');
            marker.className = 'wb-timeline__marker';

            const content = document.createElement('div');
            content.className = 'wb-timeline__content';

            if (event.date) {
                const date = document.createElement('div');
                date.className = 'wb-timeline__date';
                date.textContent = event.date;
                content.appendChild(date);
            }

            const eventTitle = document.createElement('h3');
            eventTitle.className = 'wb-timeline__title';
            eventTitle.textContent = event.title;
            content.appendChild(eventTitle);

            if (event.description) {
                const desc = document.createElement('p');
                desc.className = 'wb-timeline__description';
                desc.textContent = event.description;
                content.appendChild(desc);
            }

            item.appendChild(marker);
            item.appendChild(content);
            timeline.appendChild(item);
        });

        container.appendChild(timeline);
        section.appendChild(container);
        return section;
    }
}

class Page {
    constructor(name, options = {}) {
        this.name = name;
        this.sections = [];
        this.options = options;
        this.website = null;
    }

    add(section) {
        this.sections.push(section);
        section.page = this;
        return this;
    }

    render() {
        const pageContainer = document.createElement('div');
        pageContainer.className = 'wb-page';
        pageContainer.id = `page-${this.name}`;

        this.sections.forEach(section => {
            pageContainer.appendChild(section.render());
        });

        return pageContainer;
    }
}

// ============================================
// SECTION COMPONENTS
// ============================================

class NavBar {
    constructor(options = {}) {
        this.options = {
            style: options.style || 'default',
            links: options.links || [],
            logo: options.logo || null,
            logoImage: options.logoImage || null,
            logoImageDark: options.logoImageDark || null,
            logoSize: options.logoSize || 'medium',
            fixed: options.fixed !== false,
            themeToggle: options.themeToggle !== false,
            pageNavigation: options.pageNavigation !== false,
            pageNavigationStyle: options.pageNavigationStyle || 'inline', // 'inline' or 'dropdown'
            ...options
        };
        this.website = null;
    }

    render() {
        const nav = document.createElement('nav');
        nav.className = `wb-navbar wb-navbar--${this.options.style}`;
        if (this.options.fixed) nav.classList.add('wb-navbar--fixed');

        const container = document.createElement('div');
        container.className = 'wb-navbar__container';

        // Left side - Logo
        const leftSide = document.createElement('div');
        leftSide.className = 'wb-navbar__left';

        if (this.options.logo || this.options.logoImage) {
            const logoContainer = document.createElement('div');
            logoContainer.className = `wb-navbar__logo wb-navbar__logo--${this.options.logoSize}`;

            if (this.options.logoImage) {
                const logoImg = document.createElement('img');
                logoImg.className = 'wb-navbar__logo-image';
                logoImg.src = this.options.logoImage;
                logoImg.alt = 'Logo';
                
                if (this.options.logoImageDark) {
                    const logoImgDark = document.createElement('img');
                    logoImgDark.className = 'wb-navbar__logo-image wb-navbar__logo-image--dark';
                    logoImgDark.src = this.options.logoImageDark;
                    logoImgDark.alt = 'Logo';
                    logoContainer.appendChild(logoImgDark);
                }
                
                logoContainer.appendChild(logoImg);
            }

            if (this.options.logo) {
                const logoText = document.createElement('span');
                logoText.className = 'wb-navbar__logo-text';
                logoText.innerHTML = this.options.logo;
                logoContainer.appendChild(logoText);
            }

            leftSide.appendChild(logoContainer);
        }

        container.appendChild(leftSide);

        // Mobile burger menu button
        const burgerButton = document.createElement('button');
        burgerButton.className = 'wb-navbar__burger';
        burgerButton.innerHTML = `
            <span class="wb-navbar__burger-line"></span>
            <span class="wb-navbar__burger-line"></span>
            <span class="wb-navbar__burger-line"></span>
        `;
        burgerButton.addEventListener('click', () => this.toggleMobileMenu(nav));

        // Right side - Links and theme toggle
        const rightSide = document.createElement('div');
        rightSide.className = 'wb-navbar__right';

        // Links
        const linksContainer = document.createElement('ul');
        linksContainer.className = 'wb-navbar__links';

        // Add page navigation links if enabled
        if (this.options.pageNavigation && this.page && this.page.website) {
            const website = this.page.website;
            const pageNames = website.getPageNames();
            const currentPageName = website.getCurrentPageName();
            
            pageNames.forEach(pageName => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '#';
                a.textContent = pageName.charAt(0).toUpperCase() + pageName.slice(1);
                a.className = `wb-navbar__link wb-navbar__page-link ${currentPageName === pageName ? 'wb-navbar__link--active' : ''}`;
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    website.showPage(pageName);
                    // Close mobile menu when link is clicked
                    nav.classList.remove('wb-navbar--mobile-open');
                });
                li.appendChild(a);
                linksContainer.appendChild(li);
            });
        }

        // Add custom links
        this.options.links.forEach(link => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = link.href;
            a.textContent = link.title;
            a.className = 'wb-navbar__link';
            a.addEventListener('click', () => {
                // Close mobile menu when link is clicked
                nav.classList.remove('wb-navbar--mobile-open');
            });
            li.appendChild(a);
            linksContainer.appendChild(li);
        });

        rightSide.appendChild(linksContainer);

        // Theme toggle button
        if (this.options.themeToggle) {
            const themeToggle = document.createElement('button');
            themeToggle.className = 'wb-navbar__theme-toggle';
            themeToggle.innerHTML = '🌙';
            themeToggle.setAttribute('aria-label', 'Toggle theme');
            themeToggle.addEventListener('click', () => this.toggleTheme(themeToggle));
            
            // Listen for theme changes to update button
            document.addEventListener('themechange', (e) => {
                themeToggle.innerHTML = e.detail.theme === 'dark' ? '☀️' : '🌙';
            });

            rightSide.appendChild(themeToggle);
        }

        container.appendChild(rightSide);
        container.appendChild(burgerButton);
        nav.appendChild(container);

        // Listen for page changes to update active links
        if (this.options.pageNavigation) {
            document.addEventListener('pagechange', (e) => {
                const pageLinks = nav.querySelectorAll('.wb-navbar__page-link');
                pageLinks.forEach(link => {
                    link.classList.remove('wb-navbar__link--active');
                    if (link.textContent.toLowerCase() === e.detail.pageName) {
                        link.classList.add('wb-navbar__link--active');
                    }
                });
            });
        }

        return nav;
    }

    toggleTheme(button) {
        // Find the website instance to toggle theme
        if (this.page && this.page.website) {
            const newTheme = this.page.website.toggleTheme();
            button.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
        }
    }

    toggleMobileMenu(nav) {
        nav.classList.toggle('wb-navbar--mobile-open');
    }
}

class HeroBanner {
    constructor(title, options = {}) {
        this.title = title;
        this.options = {
            subtitle: options.subtitle || '',
            bgImage: options.bgImage || null,
            bgColor: options.bgColor || '#1a1a2e',
            height: options.height || '100vh',
            buttonsPlacement: options.buttonsPlacement || 'center',
            buttons: options.buttons || [],
            overlay: options.overlay !== false,
            textColor: options.textColor || 'auto', // auto, light, dark
            ...options
        };
    }

    render() {
        const hero = document.createElement('section');
        hero.className = 'wb-hero';
        hero.style.minHeight = this.options.height;

        // Determine text color based on background
        let textColorClass = '';
        if (this.options.textColor === 'auto') {
            if (this.options.bgImage || this.isColorDark(this.options.bgColor)) {
                textColorClass = 'wb-hero--light-text';
            } else {
                textColorClass = 'wb-hero--dark-text';
            }
        } else if (this.options.textColor === 'light') {
            textColorClass = 'wb-hero--light-text';
        } else if (this.options.textColor === 'dark') {
            textColorClass = 'wb-hero--dark-text';
        }

        if (textColorClass) {
            hero.classList.add(textColorClass);
        }

        if (this.options.bgImage) {
            hero.style.setProperty('background-image', `url(${this.options.bgImage})`, 'important');
            hero.style.setProperty('background-size', 'cover', 'important');
            hero.style.setProperty('background-position', 'center', 'important');
        } else {
            // Check if bgColor is a gradient (contains 'gradient')
            if (this.options.bgColor.includes('gradient')) {
                hero.style.setProperty('background-image', this.options.bgColor, 'important');
                hero.style.setProperty('background-color', 'transparent', 'important');
            } else {
                hero.style.setProperty('background-color', this.options.bgColor, 'important');
                hero.style.setProperty('background-image', 'none', 'important');
            }
        }

        if (this.options.overlay && this.options.bgImage) {
            const overlay = document.createElement('div');
            overlay.className = 'wb-hero__overlay';
            hero.appendChild(overlay);
        }

        const content = document.createElement('div');
        content.className = 'wb-hero__content';

        const titleEl = document.createElement('h1');
        titleEl.className = 'wb-hero__title';
        titleEl.textContent = this.title;
        content.appendChild(titleEl);

        if (this.options.subtitle) {
            const subtitle = document.createElement('p');
            subtitle.className = 'wb-hero__subtitle';
            subtitle.textContent = this.options.subtitle;
            content.appendChild(subtitle);
        }

        if (this.options.buttons.length > 0) {
            const btnContainer = document.createElement('div');
            btnContainer.className = `wb-hero__buttons wb-hero__buttons--${this.options.buttonsPlacement}`;

            this.options.buttons.forEach(btn => {
                const button = document.createElement('a');
                button.href = btn.link;
                button.className = `wb-button ${btn.primary ? 'wb-button--primary' : 'wb-button--secondary'}`;
                button.textContent = btn.title;
                
                // Smart link detection - check if link matches a page name
                if (btn.link && this.page && this.page.website) {
                    const pageNames = this.page.website.getPageNames();
                    const linkName = btn.link.replace('#', '').toLowerCase();
                    
                    if (pageNames.includes(linkName)) {
                        button.addEventListener('click', (e) => {
                            e.preventDefault();
                            this.page.website.showPage(linkName);
                        });
                    }
                }
                
                btnContainer.appendChild(button);
            });

            content.appendChild(btnContainer);
        }

        hero.appendChild(content);
        return hero;
    }

    isColorDark(color) {
        // Convert color to RGB values and calculate luminance
        let r, g, b;
        
        // Handle CSS color names
        const colorNames = {
            'white': [255, 255, 255],
            'black': [0, 0, 0],
            'red': [255, 0, 0],
            'green': [0, 128, 0],
            'blue': [0, 0, 255],
            'yellow': [255, 255, 0],
            'cyan': [0, 255, 255],
            'magenta': [255, 0, 255],
            'silver': [192, 192, 192],
            'gray': [128, 128, 128],
            'grey': [128, 128, 128],
            'maroon': [128, 0, 0],
            'olive': [128, 128, 0],
            'lime': [0, 255, 0],
            'aqua': [0, 255, 255],
            'teal': [0, 128, 128],
            'navy': [0, 0, 128],
            'fuchsia': [255, 0, 255],
            'purple': [128, 0, 128]
        };
        
        if (colorNames[color.toLowerCase()]) {
            [r, g, b] = colorNames[color.toLowerCase()];
        } else if (color.startsWith('#')) {
            // Hex color
            const hex = color.slice(1);
            r = parseInt(hex.substr(0, 2), 16);
            g = parseInt(hex.substr(2, 2), 16);
            b = parseInt(hex.substr(4, 2), 16);
        } else if (color.startsWith('rgb')) {
            // RGB color
            const values = color.match(/\d+/g);
            r = parseInt(values[0]);
            g = parseInt(values[1]);
            b = parseInt(values[2]);
        } else {
            // Default to dark for unknown formats
            return true;
        }
        
        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance < 0.5;
    }
}

class Testimonials {
    constructor(title, options = {}) {
        this.title = title;
        this.options = {
            id: options.id || null,
            items: options.items || [],
            columns: options.columns || 3,
            ...options
        };
    }

    render() {
        const section = document.createElement('section');
        section.className = 'wb-testimonials';
        if (this.options.id) section.id = this.options.id;

        const container = document.createElement('div');
        container.className = 'wb-container';

        const title = document.createElement('h2');
        title.className = 'wb-section-title';
        title.textContent = this.title;
        container.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'wb-testimonials__grid';
        grid.style.gridTemplateColumns = `repeat(auto-fit, minmax(280px, 1fr))`;

        this.options.items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'wb-testimonial-card';

            const stars = document.createElement('div');
            stars.className = 'wb-testimonial-card__stars';
            stars.innerHTML = '★'.repeat(item.grade) + '☆'.repeat(5 - item.grade);

            const comment = document.createElement('p');
            comment.className = 'wb-testimonial-card__comment';
            comment.textContent = item.comment;

            const name = document.createElement('div');
            name.className = 'wb-testimonial-card__name';
            name.textContent = item.clientName;

            card.appendChild(stars);
            card.appendChild(comment);
            card.appendChild(name);
            grid.appendChild(card);
        });

        container.appendChild(grid);
        section.appendChild(container);
        return section;
    }
}

class Footer {
    constructor(options = {}) {
        this.options = {
            copyright: options.copyright || `© ${new Date().getFullYear()} All rights reserved`,
            links: options.links || [],
            social: options.social || [],
            ...options
        };
    }

    render() {
        const footer = document.createElement('footer');
        footer.className = 'wb-footer';

        const container = document.createElement('div');
        container.className = 'wb-container';

        // Links
        if (this.options.links.length > 0) {
            const linksContainer = document.createElement('div');
            linksContainer.className = 'wb-footer__links';

            this.options.links.forEach(link => {
                const a = document.createElement('a');
                a.href = link.href;
                a.textContent = link.title;
                a.className = 'wb-footer__link';
                linksContainer.appendChild(a);
            });

            container.appendChild(linksContainer);
        }

        // Social
        if (this.options.social.length > 0) {
            const socialContainer = document.createElement('div');
            socialContainer.className = 'wb-footer__social';

            this.options.social.forEach(social => {
                const a = document.createElement('a');
                a.href = social.link;
                a.textContent = social.name;
                a.className = 'wb-footer__social-link';
                a.target = '_blank';
                socialContainer.appendChild(a);
            });

            container.appendChild(socialContainer);
        }

        // Copyright
        const copyright = document.createElement('div');
        copyright.className = 'wb-footer__copyright';
        copyright.textContent = this.options.copyright;
        container.appendChild(copyright);

        footer.appendChild(container);
        return footer;
    }
}

class FeatureGrid {
    constructor(title, options = {}) {
        this.title = title;
        this.options = {
            items: options.items || [],
            columns: options.columns || 3,
            id: options.id || null,
            ...options
        };
    }

    render() {
        const section = document.createElement('section');
        section.className = 'wb-features';
        if (this.options.id) section.id = this.options.id;

        const container = document.createElement('div');
        container.className = 'wb-container';

        const title = document.createElement('h2');
        title.className = 'wb-section-title';
        title.textContent = this.title;
        container.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'wb-features__grid';

        this.options.items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'wb-feature-card';

            if (item.icon) {
                const icon = document.createElement('div');
                icon.className = 'wb-feature-card__icon';
                icon.textContent = item.icon;
                card.appendChild(icon);
            }

            const cardTitle = document.createElement('h3');
            cardTitle.className = 'wb-feature-card__title';
            cardTitle.textContent = item.title;
            card.appendChild(cardTitle);

            const desc = document.createElement('p');
            desc.className = 'wb-feature-card__description';
            desc.textContent = item.description;
            card.appendChild(desc);

            grid.appendChild(card);
        });

        container.appendChild(grid);
        section.appendChild(container);
        return section;
    }
}

class PricingTable {
    constructor(title, options = {}) {
        this.title = title;
        this.options = {
            id: options.id || null,
            plans: options.plans || [],
            columns: options.columns || 3,
            ...options
        };
    }

    render() {
        const section = document.createElement('section');
        section.className = 'wb-pricing';
        if (this.options.id) section.id = this.options.id;

        const container = document.createElement('div');
        container.className = 'wb-container';

        const title = document.createElement('h2');
        title.className = 'wb-section-title';
        title.textContent = this.title;
        container.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'wb-pricing__grid';

        this.options.plans.forEach(plan => {
            const card = document.createElement('div');
            card.className = `wb-pricing-card ${plan.featured ? 'wb-pricing-card--featured' : ''}`;

            const planTitle = document.createElement('h3');
            planTitle.className = 'wb-pricing-card__title';
            planTitle.textContent = plan.title;
            card.appendChild(planTitle);

            const price = document.createElement('div');
            price.className = 'wb-pricing-card__price';
            price.innerHTML = `<span class="wb-pricing-card__currency">${plan.currency || '$'}</span><span class="wb-pricing-card__amount">${plan.price}</span><span class="wb-pricing-card__period">/${plan.period || 'month'}</span>`;
            card.appendChild(price);

            if (plan.description) {
                const desc = document.createElement('p');
                desc.className = 'wb-pricing-card__description';
                desc.textContent = plan.description;
                card.appendChild(desc);
            }

            const features = document.createElement('ul');
            features.className = 'wb-pricing-card__features';
            (plan.features || []).forEach(feature => {
                const li = document.createElement('li');
                li.className = 'wb-pricing-card__feature';
                li.textContent = feature;
                features.appendChild(li);
            });
            card.appendChild(features);

            const button = document.createElement('a');
            button.className = `wb-button ${plan.featured ? 'wb-button--primary' : 'wb-button--secondary'}`;
            button.href = plan.buttonLink || '#';
            button.textContent = plan.buttonText || 'Choose Plan';
            card.appendChild(button);

            grid.appendChild(card);
        });

        container.appendChild(grid);
        section.appendChild(container);
        return section;
    }
}

class ContactForm {
    constructor(title, options = {}) {
        this.title = title;
        this.options = {
            id: options.id || null,
            subtitle: options.subtitle || '',
            action: options.action || '#',
            method: options.method || 'POST',
            fields: options.fields || [
                { type: 'text', name: 'name', label: 'Name', required: true },
                { type: 'email', name: 'email', label: 'Email', required: true },
                { type: 'textarea', name: 'message', label: 'Message', required: true }
            ],
            buttonText: options.buttonText || 'Send Message',
            ...options
        };
    }

    render() {
        const section = document.createElement('section');
        section.className = 'wb-contact';
        if (this.options.id) section.id = this.options.id;

        const container = document.createElement('div');
        container.className = 'wb-container';

        const title = document.createElement('h2');
        title.className = 'wb-section-title';
        title.textContent = this.title;
        container.appendChild(title);

        if (this.options.subtitle) {
            const subtitle = document.createElement('p');
            subtitle.className = 'wb-contact__subtitle';
            subtitle.textContent = this.options.subtitle;
            container.appendChild(subtitle);
        }

        const form = document.createElement('form');
        form.className = 'wb-contact__form';
        form.action = this.options.action;
        form.method = this.options.method;

        this.options.fields.forEach(field => {
            const fieldGroup = document.createElement('div');
            fieldGroup.className = 'wb-form-group';

            const label = document.createElement('label');
            label.className = 'wb-form-label';
            label.textContent = field.label;
            label.setAttribute('for', field.name);
            fieldGroup.appendChild(label);

            let input;
            if (field.type === 'textarea') {
                input = document.createElement('textarea');
                input.rows = 5;
            } else {
                input = document.createElement('input');
                input.type = field.type;
            }
            
            input.className = 'wb-form-input';
            input.name = field.name;
            input.id = field.name;
            if (field.required) input.required = true;
            if (field.placeholder) input.placeholder = field.placeholder;

            fieldGroup.appendChild(input);
            form.appendChild(fieldGroup);
        });

        const button = document.createElement('button');
        button.type = 'submit';
        button.className = 'wb-button wb-button--primary';
        button.textContent = this.options.buttonText;
        form.appendChild(button);

        container.appendChild(form);
        section.appendChild(container);
        return section;
    }
}

class Gallery {
    constructor(title, options = {}) {
        this.title = title;
        this.options = {
            id: options.id || null,
            images: options.images || [],
            columns: options.columns || 3,
            lightbox: options.lightbox !== false,
            ...options
        };
    }

    render() {
        const section = document.createElement('section');
        section.className = 'wb-gallery';
        if (this.options.id) section.id = this.options.id;

        const container = document.createElement('div');
        container.className = 'wb-container';

        const title = document.createElement('h2');
        title.className = 'wb-section-title';
        title.textContent = this.title;
        container.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'wb-gallery__grid';

        this.options.images.forEach((image, index) => {
            const item = document.createElement('div');
            item.className = 'wb-gallery__item';

            const img = document.createElement('img');
            img.className = 'wb-gallery__image';
            img.src = image.src || image;
            img.alt = image.alt || `Gallery image ${index + 1}`;
            img.loading = 'lazy';

            if (this.options.lightbox) {
                img.style.cursor = 'pointer';
                img.addEventListener('click', () => this.openLightbox(image.src || image, image.alt));
            }

            item.appendChild(img);
            grid.appendChild(item);
        });

        container.appendChild(grid);
        section.appendChild(container);
        return section;
    }

    openLightbox(src, alt) {
        const lightbox = document.createElement('div');
        lightbox.className = 'wb-lightbox';
        lightbox.innerHTML = `
            <div class="wb-lightbox__overlay"></div>
            <div class="wb-lightbox__content">
                <img src="${src}" alt="${alt}" class="wb-lightbox__image">
                <button class="wb-lightbox__close">&times;</button>
            </div>
        `;

        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        const close = () => {
            document.body.removeChild(lightbox);
            document.body.style.overflow = '';
        };

        lightbox.querySelector('.wb-lightbox__close').addEventListener('click', close);
        lightbox.querySelector('.wb-lightbox__overlay').addEventListener('click', close);
    }
}

class CTA {
    constructor(title, options = {}) {
        this.title = title;
        this.options = {
            id: options.id || null,
            subtitle: options.subtitle || '',
            bgColor: options.bgColor || 'transparent',
            bgImage: options.bgImage || null,
            buttons: options.buttons || [],
            textColor: options.textColor || 'auto', // auto, light, dark, inherit
            ...options
        };
    }

    render() {
        const section = document.createElement('section');
        section.className = 'wb-cta';
        if (this.options.id) section.id = this.options.id;
        
        // Determine text color based on background
        let textColor;
        if (this.options.textColor === 'auto') {
            if (this.options.bgImage) {
                textColor = 'white'; // Assume images are dark
            } else if (this.options.bgColor === 'transparent') {
                textColor = 'inherit'; // Use theme colors for transparent
            } else if (this.isColorDark(this.options.bgColor)) {
                textColor = 'white';
            } else {
                textColor = 'var(--text-color)';
            }
        } else if (this.options.textColor === 'inherit') {
            textColor = 'inherit';
        } else {
            textColor = this.options.textColor;
        }
        
        if (this.options.bgImage) {
            section.style.setProperty('background-image', `url(${this.options.bgImage})`, 'important');
            section.style.setProperty('background-size', 'cover', 'important');
            section.style.setProperty('background-position', 'center', 'important');
        } else if (this.options.bgColor !== 'transparent') {
            // Only apply background if not transparent
            if (this.options.bgColor.includes('gradient')) {
                section.style.setProperty('background-image', this.options.bgColor, 'important');
                section.style.setProperty('background-color', 'transparent', 'important');
            } else {
                section.style.setProperty('background-color', this.options.bgColor, 'important');
                section.style.setProperty('background-image', 'none', 'important');
            }
        }
        section.style.color = textColor;

        const container = document.createElement('div');
        container.className = 'wb-container';

        const content = document.createElement('div');
        content.className = 'wb-cta__content';

        const title = document.createElement('h2');
        title.className = 'wb-cta__title';
        title.textContent = this.title;
        content.appendChild(title);

        if (this.options.subtitle) {
            const subtitle = document.createElement('p');
            subtitle.className = 'wb-cta__subtitle';
            subtitle.textContent = this.options.subtitle;
            content.appendChild(subtitle);
        }

        if (this.options.buttons.length > 0) {
            const btnContainer = document.createElement('div');
            btnContainer.className = 'wb-cta__buttons';

            this.options.buttons.forEach(btn => {
                const button = document.createElement('a');
                button.href = btn.link || '#';
                button.className = `wb-button ${btn.primary ? 'wb-button--primary' : 'wb-button--secondary'}`;
                button.textContent = btn.title;
                
                // Smart link detection - check if link matches a page name
                if (btn.link && this.page && this.page.website) {
                    const pageNames = this.page.website.getPageNames();
                    const linkName = btn.link.replace('#', '').toLowerCase();
                    
                    if (pageNames.includes(linkName)) {
                        button.addEventListener('click', (e) => {
                            e.preventDefault();
                            this.page.website.showPage(linkName);
                        });
                    }
                }
                
                btnContainer.appendChild(button);
            });

            content.appendChild(btnContainer);
        }

        container.appendChild(content);
        section.appendChild(container);
        return section;
    }

    isColorDark(color) {
        // Convert color to RGB values and calculate luminance
        let r, g, b;
        
        // Handle CSS color names
        const colorNames = {
            'white': [255, 255, 255],
            'black': [0, 0, 0],
            'red': [255, 0, 0],
            'green': [0, 128, 0],
            'blue': [0, 0, 255],
            'yellow': [255, 255, 0],
            'cyan': [0, 255, 255],
            'magenta': [255, 0, 255],
            'silver': [192, 192, 192],
            'gray': [128, 128, 128],
            'grey': [128, 128, 128],
            'maroon': [128, 0, 0],
            'olive': [128, 128, 0],
            'lime': [0, 255, 0],
            'aqua': [0, 255, 255],
            'teal': [0, 128, 128],
            'navy': [0, 0, 128],
            'fuchsia': [255, 0, 255],
            'purple': [128, 0, 128]
        };
        
        if (colorNames[color.toLowerCase()]) {
            [r, g, b] = colorNames[color.toLowerCase()];
        } else if (color.startsWith('#')) {
            // Hex color
            const hex = color.slice(1);
            r = parseInt(hex.substr(0, 2), 16);
            g = parseInt(hex.substr(2, 2), 16);
            b = parseInt(hex.substr(4, 2), 16);
        } else if (color.startsWith('rgb')) {
            // RGB color
            const values = color.match(/\d+/g);
            r = parseInt(values[0]);
            g = parseInt(values[1]);
            b = parseInt(values[2]);
        } else {
            // Default to dark for unknown formats (gradients, etc.)
            return true;
        }
        
        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance < 0.5;
    }
}

// ============================================
// ADMIN COMPONENTS
// ============================================

class Sidebar {
    constructor(options = {}) {
        this.options = {
            logo: options.logo || 'Admin Panel',
            logoImage: options.logoImage || null,
            items: options.items || [],
            collapsible: options.collapsible !== false,
            defaultCollapsed: options.defaultCollapsed || false,
            ...options
        };
        this.collapsed = this.options.defaultCollapsed;
    }

    render() {
        const sidebar = document.createElement('aside');
        sidebar.className = 'wb-sidebar';
        if (this.collapsed) sidebar.classList.add('wb-sidebar--collapsed');

        // Logo/Header
        const header = document.createElement('div');
        header.className = 'wb-sidebar__header';

        if (this.options.logoImage) {
            const logoImg = document.createElement('img');
            logoImg.src = this.options.logoImage;
            logoImg.alt = 'Logo';
            logoImg.className = 'wb-sidebar__logo-image';
            header.appendChild(logoImg);
        } else {
            const logoText = document.createElement('h2');
            logoText.className = 'wb-sidebar__logo';
            logoText.textContent = this.options.logo;
            header.appendChild(logoText);
        }

        // Collapse toggle button
        if (this.options.collapsible) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'wb-sidebar__toggle';
            toggleBtn.innerHTML = '☰';
            toggleBtn.addEventListener('click', () => this.toggleSidebar(sidebar));
            header.appendChild(toggleBtn);
        }

        sidebar.appendChild(header);

        // Navigation items
        const nav = document.createElement('nav');
        nav.className = 'wb-sidebar__nav';

        this.options.items.forEach(item => {
            if (item.separator) {
                const separator = document.createElement('div');
                separator.className = 'wb-sidebar__separator';
                if (item.label) {
                    separator.textContent = item.label;
                }
                nav.appendChild(separator);
            } else {
                const link = document.createElement('a');
                link.href = item.href || '#';
                link.className = 'wb-sidebar__item';
                if (item.active) link.classList.add('wb-sidebar__item--active');

                if (item.icon) {
                    const icon = document.createElement('span');
                    icon.className = 'wb-sidebar__icon';
                    icon.innerHTML = item.icon;
                    link.appendChild(icon);
                }

                const text = document.createElement('span');
                text.className = 'wb-sidebar__text';
                text.textContent = item.title;
                link.appendChild(text);

                if (item.badge) {
                    const badge = document.createElement('span');
                    badge.className = 'wb-sidebar__badge';
                    badge.textContent = item.badge;
                    link.appendChild(badge);
                }

                link.addEventListener('click', (e) => {
                    if (item.onClick) {
                        e.preventDefault();
                        item.onClick(e);
                    }
                    // Update active state
                    nav.querySelectorAll('.wb-sidebar__item').forEach(i => {
                        i.classList.remove('wb-sidebar__item--active');
                    });
                    link.classList.add('wb-sidebar__item--active');
                });

                nav.appendChild(link);
            }
        });

        sidebar.appendChild(nav);
        return sidebar;
    }

    toggleSidebar(sidebar) {
        this.collapsed = !this.collapsed;
        sidebar.classList.toggle('wb-sidebar--collapsed');
        // Trigger event for layout adjustments
        const event = new CustomEvent('sidebarToggle', { detail: { collapsed: this.collapsed } });
        document.dispatchEvent(event);
    }
}

class Card {
    constructor(options = {}) {
        this.options = {
            title: options.title || '',
            content: options.content || '',
            footer: options.footer || null,
            icon: options.icon || null,
            value: options.value || null,
            subtitle: options.subtitle || null,
            actions: options.actions || [],
            variant: options.variant || 'default', // default, info, success, warning, danger
            ...options
        };
    }

    render() {
        const card = document.createElement('div');
        card.className = `wb-card wb-card--${this.options.variant}`;

        if (this.options.title || this.options.actions.length > 0) {
            const header = document.createElement('div');
            header.className = 'wb-card__header';

            if (this.options.icon || this.options.title) {
                const titleContainer = document.createElement('div');
                titleContainer.className = 'wb-card__title-container';

                if (this.options.icon) {
                    const icon = document.createElement('span');
                    icon.className = 'wb-card__icon';
                    icon.innerHTML = this.options.icon;
                    titleContainer.appendChild(icon);
                }

                if (this.options.title) {
                    const title = document.createElement('h3');
                    title.className = 'wb-card__title';
                    title.textContent = this.options.title;
                    titleContainer.appendChild(title);
                }

                header.appendChild(titleContainer);
            }

            if (this.options.actions.length > 0) {
                const actionsContainer = document.createElement('div');
                actionsContainer.className = 'wb-card__actions';

                this.options.actions.forEach(action => {
                    const btn = document.createElement('button');
                    btn.className = 'wb-card__action-btn';
                    btn.textContent = action.title;
                    btn.addEventListener('click', action.onClick);
                    actionsContainer.appendChild(btn);
                });

                header.appendChild(actionsContainer);
            }

            card.appendChild(header);
        }

        const body = document.createElement('div');
        body.className = 'wb-card__body';

        if (this.options.value !== null) {
            const value = document.createElement('div');
            value.className = 'wb-card__value';
            value.textContent = this.options.value;
            body.appendChild(value);

            if (this.options.subtitle) {
                const subtitle = document.createElement('div');
                subtitle.className = 'wb-card__subtitle';
                subtitle.textContent = this.options.subtitle;
                body.appendChild(subtitle);
            }
        } else if (this.options.content) {
            if (typeof this.options.content === 'string') {
                body.innerHTML = this.options.content;
            } else {
                body.appendChild(this.options.content);
            }
        }

        card.appendChild(body);

        if (this.options.footer) {
            const footer = document.createElement('div');
            footer.className = 'wb-card__footer';
            if (typeof this.options.footer === 'string') {
                footer.innerHTML = this.options.footer;
            } else {
                footer.appendChild(this.options.footer);
            }
            card.appendChild(footer);
        }

        return card;
    }
}

class DataTable {
    constructor(options = {}) {
        this.options = {
            columns: options.columns || [],
            data: options.data || [],
            searchable: options.searchable !== false,
            sortable: options.sortable !== false,
            pagination: options.pagination !== false,
            itemsPerPage: options.itemsPerPage || 10,
            actions: options.actions || [],
            selectable: options.selectable || false,
            ...options
        };
        this.currentPage = 1;
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.searchTerm = '';
    }

    render() {
        const container = document.createElement('div');
        container.className = 'wb-datatable';

        // Search bar
        if (this.options.searchable) {
            const searchBar = document.createElement('div');
            searchBar.className = 'wb-datatable__search';

            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'Search...';
            searchInput.className = 'wb-datatable__search-input';
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value;
                this.updateTable(container);
            });

            searchBar.appendChild(searchInput);
            container.appendChild(searchBar);
        }

        // Table
        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'wb-datatable__wrapper';

        const table = document.createElement('table');
        table.className = 'wb-datatable__table';

        // Header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        if (this.options.selectable) {
            const th = document.createElement('th');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.addEventListener('change', (e) => this.selectAll(e.target.checked, container));
            th.appendChild(checkbox);
            headerRow.appendChild(th);
        }

        this.options.columns.forEach(column => {
            const th = document.createElement('th');
            th.textContent = column.title;
            if (this.options.sortable && column.sortable !== false) {
                th.className = 'wb-datatable__th--sortable';
                th.addEventListener('click', () => {
                    this.sortBy(column.key, container);
                });
            }
            headerRow.appendChild(th);
        });

        if (this.options.actions.length > 0) {
            const th = document.createElement('th');
            th.textContent = 'Actions';
            headerRow.appendChild(th);
        }

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Body
        const tbody = document.createElement('tbody');
        tbody.className = 'wb-datatable__tbody';
        table.appendChild(tbody);

        tableWrapper.appendChild(table);
        container.appendChild(tableWrapper);

        // Pagination
        if (this.options.pagination) {
            const pagination = document.createElement('div');
            pagination.className = 'wb-datatable__pagination';
            container.appendChild(pagination);
        }

        this.updateTable(container);
        return container;
    }

    updateTable(container) {
        const tbody = container.querySelector('.wb-datatable__tbody');
        tbody.innerHTML = '';

        // Filter data
        let filteredData = this.options.data;
        if (this.searchTerm) {
            filteredData = filteredData.filter(row => {
                return this.options.columns.some(column => {
                    const value = row[column.key];
                    return value && value.toString().toLowerCase().includes(this.searchTerm.toLowerCase());
                });
            });
        }

        // Sort data
        if (this.sortColumn) {
            filteredData.sort((a, b) => {
                const aVal = a[this.sortColumn];
                const bVal = b[this.sortColumn];
                if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        // Paginate
        const totalItems = filteredData.length;
        const totalPages = Math.ceil(totalItems / this.options.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.options.itemsPerPage;
        const endIndex = startIndex + this.options.itemsPerPage;
        const paginatedData = this.options.pagination ? filteredData.slice(startIndex, endIndex) : filteredData;

        // Render rows
        paginatedData.forEach((row, index) => {
            const tr = document.createElement('tr');

            if (this.options.selectable) {
                const td = document.createElement('td');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.dataset.index = index;
                td.appendChild(checkbox);
                tr.appendChild(td);
            }

            this.options.columns.forEach(column => {
                const td = document.createElement('td');
                if (column.render) {
                    const content = column.render(row[column.key], row);
                    if (typeof content === 'string') {
                        td.innerHTML = content;
                    } else {
                        td.appendChild(content);
                    }
                } else {
                    td.textContent = row[column.key] || '';
                }
                tr.appendChild(td);
            });

            if (this.options.actions.length > 0) {
                const td = document.createElement('td');
                td.className = 'wb-datatable__actions';

                this.options.actions.forEach(action => {
                    const btn = document.createElement('button');
                    btn.className = `wb-datatable__action-btn wb-datatable__action-btn--${action.variant || 'default'}`;
                    btn.textContent = action.title;
                    btn.addEventListener('click', () => action.onClick(row));
                    td.appendChild(btn);
                });

                tr.appendChild(td);
            }

            tbody.appendChild(tr);
        });

        // Update pagination
        if (this.options.pagination) {
            this.updatePagination(container, totalPages);
        }
    }

    updatePagination(container, totalPages) {
        const pagination = container.querySelector('.wb-datatable__pagination');
        pagination.innerHTML = '';

        if (totalPages <= 1) return;

        const prevBtn = document.createElement('button');
        prevBtn.textContent = 'Previous';
        prevBtn.disabled = this.currentPage === 1;
        prevBtn.addEventListener('click', () => {
            this.currentPage--;
            this.updateTable(container);
        });
        pagination.appendChild(prevBtn);

        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
        pagination.appendChild(pageInfo);

        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next';
        nextBtn.disabled = this.currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            this.currentPage++;
            this.updateTable(container);
        });
        pagination.appendChild(nextBtn);
    }

    sortBy(key, container) {
        if (this.sortColumn === key) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = key;
            this.sortDirection = 'asc';
        }
        this.updateTable(container);
    }

    selectAll(checked, container) {
        const checkboxes = container.querySelectorAll('tbody input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = checked);
    }
}

class AdminLayout {
    constructor(options = {}) {
        this.options = {
            sidebar: options.sidebar || null,
            content: options.content || [],
            topBar: options.topBar || null,
            ...options
        };
    }

    render() {
        const layout = document.createElement('div');
        layout.className = 'wb-admin-layout';

        // Sidebar
        if (this.options.sidebar) {
            const sidebar = this.options.sidebar.render();
            layout.appendChild(sidebar);

            // Listen for sidebar toggle to adjust layout
            document.addEventListener('sidebarToggle', (e) => {
                if (e.detail.collapsed) {
                    layout.classList.add('wb-admin-layout--sidebar-collapsed');
                } else {
                    layout.classList.remove('wb-admin-layout--sidebar-collapsed');
                }
            });
        }

        // Main content area
        const main = document.createElement('main');
        main.className = 'wb-admin-main';

        // Top bar
        if (this.options.topBar) {
            const topBar = document.createElement('div');
            topBar.className = 'wb-admin-topbar';

            if (typeof this.options.topBar === 'string') {
                topBar.innerHTML = this.options.topBar;
            } else if (this.options.topBar.render) {
                topBar.appendChild(this.options.topBar.render());
            } else {
                topBar.appendChild(this.options.topBar);
            }

            main.appendChild(topBar);
        }

        // Content container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'wb-admin-content';

        this.options.content.forEach(section => {
            if (section.render) {
                contentContainer.appendChild(section.render());
            } else {
                contentContainer.appendChild(section);
            }
        });

        main.appendChild(contentContainer);
        layout.appendChild(main);

        return layout;
    }
}

class AdminSection {
    constructor(title, options = {}) {
        this.title = title;
        this.options = {
            id: options.id || null,
            content: options.content || [],
            actions: options.actions || [],
            ...options
        };
    }

    render() {
        const section = document.createElement('section');
        section.className = 'wb-admin-section';
        if (this.options.id) section.id = this.options.id;

        const header = document.createElement('div');
        header.className = 'wb-admin-section__header';

        const title = document.createElement('h2');
        title.className = 'wb-admin-section__title';
        title.textContent = this.title;
        header.appendChild(title);

        if (this.options.actions.length > 0) {
            const actions = document.createElement('div');
            actions.className = 'wb-admin-section__actions';

            this.options.actions.forEach(action => {
                const btn = document.createElement('button');
                btn.className = `wb-button ${action.primary ? 'wb-button--primary' : ''}`;
                btn.textContent = action.title;
                btn.addEventListener('click', action.onClick);
                actions.appendChild(btn);
            });

            header.appendChild(actions);
        }

        section.appendChild(header);

        const content = document.createElement('div');
        content.className = 'wb-admin-section__content';

        this.options.content.forEach(item => {
            if (item.render) {
                content.appendChild(item.render());
            } else if (typeof item === 'string') {
                const p = document.createElement('p');
                p.innerHTML = item;
                content.appendChild(p);
            } else {
                content.appendChild(item);
            }
        });

        section.appendChild(content);
        return section;
    }
}

class CardGrid {
    constructor(options = {}) {
        this.options = {
            cards: options.cards || [],
            columns: options.columns || 4,
            ...options
        };
    }

    render() {
        const grid = document.createElement('div');
        grid.className = 'wb-card-grid';
        grid.style.gridTemplateColumns = `repeat(auto-fit, minmax(250px, 1fr))`;

        this.options.cards.forEach(cardOptions => {
            const card = new Card(cardOptions);
            grid.appendChild(card.render());
        });

        return grid;
    }
}

// ============================================
// INJECT STYLES
// ============================================

const styles = `
    :root {
        --primary-color: #6c63ff;
        --primary-dark: #5952d4;
        --text-color: #333;
        --text-muted: #666;
        --bg-color: #ffffff;
        --bg-alt: #f8f9fa;
        --border-color: rgba(0,0,0,0.1);
        --shadow: 0 2px 10px rgba(0,0,0,0.1);
        --shadow-hover: 0 4px 20px rgba(0,0,0,0.15);
    }

    [data-theme="dark"] {
        --text-color: #e1e1e1;
        --text-muted: #b0b0b0;
        --bg-color: #1a1a2e;
        --bg-alt: #16213e;
        --border-color: rgba(255,255,255,0.1);
        --shadow: 0 2px 10px rgba(0,0,0,0.3);
        --shadow-hover: 0 4px 20px rgba(0,0,0,0.4);
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        line-height: 1.6;
        color: var(--text-color);
        background-color: var(--bg-color);
        transition: background-color 0.3s, color 0.3s;
    }

    /* Global text color inheritance */
    h1, h2, h3, h4, h5, h6, p, span, div {
        color: inherit;
    }

    .wb-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }

    /* Navbar */
    .wb-navbar {
        background: var(--bg-color);
        box-shadow: var(--shadow);
        padding: 1rem 0;
        transition: background-color 0.3s, box-shadow 0.3s;
    }

    .wb-navbar--fixed {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
    }

    .wb-navbar__container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .wb-navbar__left,
    .wb-navbar__right {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .wb-navbar__logo {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--text-color);
        transition: color 0.3s;
    }

    .wb-navbar__logo--small {
        font-size: 1.2rem;
    }

    .wb-navbar__logo--large {
        font-size: 1.8rem;
    }

    .wb-navbar__logo-image {
        height: 40px;
        width: auto;
        transition: opacity 0.3s;
    }

    [data-theme="dark"] .wb-navbar__logo-image:not(.wb-navbar__logo-image--dark) {
        opacity: 0;
        position: absolute;
    }

    [data-theme="light"] .wb-navbar__logo-image--dark {
        opacity: 0;
        position: absolute;
    }

    .wb-navbar__logo--small .wb-navbar__logo-image {
        height: 32px;
    }

    .wb-navbar__logo--large .wb-navbar__logo-image {
        height: 48px;
    }

    .wb-navbar__links {
        display: flex;
        list-style: none;
        gap: 2rem;
        margin: 0;
    }

    .wb-navbar__burger {
        display: none;
        flex-direction: column;
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        width: 30px;
        height: 24px;
        justify-content: space-between;
    }

    .wb-navbar__burger-line {
        width: 100%;
        height: 3px;
        background-color: var(--text-color);
        transition: all 0.3s ease;
        transform-origin: center;
    }

    .wb-navbar--mobile-open .wb-navbar__burger-line:nth-child(1) {
        transform: rotate(45deg) translate(6px, 6px);
    }

    .wb-navbar--mobile-open .wb-navbar__burger-line:nth-child(2) {
        opacity: 0;
    }

    .wb-navbar--mobile-open .wb-navbar__burger-line:nth-child(3) {
        transform: rotate(-45deg) translate(6px, -6px);
    }

    .wb-navbar__link {
        text-decoration: none;
        color: var(--text-color);
        font-weight: 500;
        transition: color 0.3s;
    }

    .wb-navbar__link:hover {
        color: var(--primary-color);
    }

    .wb-navbar__link--active {
        color: var(--primary-color);
        font-weight: 600;
    }

    .wb-navbar__theme-toggle {
        background: none;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 0.5rem;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 40px;
        height: 40px;
    }

    .wb-navbar__theme-toggle:hover {
        background-color: var(--bg-alt);
        transform: scale(1.05);
    }

    /* Hero */
    .wb-hero {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        text-align: center;
        overflow: hidden;
    }

    .wb-hero--light-text {
        color: white;
    }

    .wb-hero--dark-text {
        color: var(--text-color);
    }

    .wb-hero__overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
    }

    .wb-hero__content {
        position: relative;
        z-index: 1;
        max-width: 800px;
        padding: 2rem;
    }

    .wb-hero__title {
        font-size: 3.5rem;
        font-weight: 800;
        margin-bottom: 1rem;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .wb-hero__subtitle {
        font-size: 1.5rem;
        margin-bottom: 2rem;
        opacity: 0.95;
    }

    .wb-hero__buttons {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .wb-hero__buttons--center {
        justify-content: center;
    }

    .wb-hero__buttons--left {
        justify-content: flex-start;
    }

    .wb-hero__buttons--right {
        justify-content: flex-end;
    }

    .wb-button {
        display: inline-block;
        padding: 1rem 2rem;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        transition: all 0.3s;
        border: 2px solid transparent;
        cursor: pointer;
    }

    .wb-button--primary {
        background: var(--primary-color);
        color: white;
    }

    .wb-button--primary:hover {
        background: var(--primary-dark);
        transform: translateY(-2px);
    }

    .wb-button--secondary {
        background: transparent;
        color: var(--text-color);
        border-color: var(--border-color);
    }

    .wb-button--secondary:hover {
        background: var(--bg-alt);
        color: var(--primary-color);
    }

    /* Section Title */
    .wb-section-title {
        text-align: center;
        font-size: 2.5rem;
        margin-bottom: 3rem;
        color: var(--text-color);
        transition: color 0.3s;
    }

    /* Testimonials */
    .wb-testimonials {
        padding: 5rem 0;
        background: var(--bg-alt);
        transition: background-color 0.3s;
    }

    .wb-testimonials__grid {
        display: grid;
        gap: 2rem;
    }

    .wb-testimonial-card {
        background: var(--bg-color);
        padding: 2rem;
        border-radius: 12px;
        box-shadow: var(--shadow);
        transition: all 0.3s;
    }

    .wb-testimonial-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-hover);
    }

    .wb-testimonial-card__stars {
        color: #ffd700;
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    .wb-testimonial-card__comment {
        color: var(--text-muted);
        margin-bottom: 1rem;
        line-height: 1.8;
        transition: color 0.3s;
    }

    .wb-testimonial-card__name {
        font-weight: 600;
        color: var(--text-color);
        transition: color 0.3s;
    }

    /* Features */
    .wb-features {
        padding: 5rem 0;
        background: var(--bg-color);
        transition: background-color 0.3s;
    }

    .wb-features__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
    }

    .wb-feature-card {
        padding: 2rem;
        text-align: center;
        border-radius: 12px;
        transition: all 0.3s;
    }

    .wb-feature-card:hover {
        background: var(--bg-alt);
    }

    .wb-feature-card__icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .wb-feature-card__title {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: var(--text-color);
        transition: color 0.3s;
    }

    .wb-feature-card__description {
        color: var(--text-muted);
        line-height: 1.8;
        transition: color 0.3s;
    }

    /* Pricing */
    .wb-pricing {
        padding: 5rem 0;
        background: var(--bg-alt);
        transition: background-color 0.3s;
    }

    .wb-pricing__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
    }

    .wb-pricing-card {
        background: var(--bg-color);
        padding: 2.5rem 2rem;
        border-radius: 16px;
        box-shadow: var(--shadow);
        text-align: center;
        transition: all 0.3s;
        position: relative;
        border: 2px solid transparent;
    }

    .wb-pricing-card--featured {
        border-color: var(--primary-color);
        transform: scale(1.05);
    }

    .wb-pricing-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-hover);
    }

    .wb-pricing-card--featured:hover {
        transform: scale(1.05) translateY(-5px);
    }

    .wb-pricing-card__title {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--text-color);
        transition: color 0.3s;
    }

    .wb-pricing-card__price {
        margin-bottom: 1rem;
        color: var(--primary-color);
    }

    .wb-pricing-card__currency {
        font-size: 1.2rem;
        font-weight: 500;
    }

    .wb-pricing-card__amount {
        font-size: 3rem;
        font-weight: 800;
    }

    .wb-pricing-card__period {
        font-size: 1rem;
        color: var(--text-muted);
        transition: color 0.3s;
    }

    .wb-pricing-card__description {
        color: var(--text-muted);
        margin-bottom: 2rem;
        transition: color 0.3s;
    }

    .wb-pricing-card__features {
        list-style: none;
        margin-bottom: 2rem;
    }

    .wb-pricing-card__feature {
        padding: 0.5rem 0;
        color: var(--text-color);
        position: relative;
        padding-left: 1.5rem;
        transition: color 0.3s;
    }

    .wb-pricing-card__feature:before {
        content: "✓";
        position: absolute;
        left: 0;
        color: var(--primary-color);
        font-weight: bold;
    }

    /* Contact Form */
    .wb-contact {
        padding: 5rem 0;
        background: var(--bg-color);
        transition: background-color 0.3s;
    }

    .wb-contact__subtitle {
        text-align: center;
        color: var(--text-muted);
        font-size: 1.2rem;
        margin-bottom: 3rem;
        transition: color 0.3s;
    }

    .wb-contact__form {
        max-width: 600px;
        margin: 0 auto;
    }

    .wb-form-group {
        margin-bottom: 1.5rem;
    }

    .wb-form-label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--text-color);
        transition: color 0.3s;
    }

    .wb-form-input {
        width: 100%;
        padding: 1rem;
        border: 2px solid var(--border-color);
        border-radius: 8px;
        font-size: 1rem;
        background: var(--bg-color);
        color: var(--text-color);
        transition: all 0.3s;
    }

    .wb-form-input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
    }

    /* Gallery */
    .wb-gallery {
        padding: 5rem 0;
        background: var(--bg-alt);
        transition: background-color 0.3s;
    }

    .wb-gallery__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-top: 2rem;
    }

    .wb-gallery__item {
        position: relative;
        overflow: hidden;
        border-radius: 12px;
        aspect-ratio: 1;
    }

    .wb-gallery__image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s;
    }

    .wb-gallery__image:hover {
        transform: scale(1.05);
    }

    /* Lightbox */
    .wb-lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .wb-lightbox__overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        cursor: pointer;
    }

    .wb-lightbox__content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        z-index: 1;
    }

    .wb-lightbox__image {
        max-width: 100%;
        max-height: 100%;
        border-radius: 8px;
    }

    .wb-lightbox__close {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        padding: 0.5rem;
    }

    /* CTA */
    .wb-cta {
        padding: 5rem 0;
        text-align: center;
        position: relative;
    }

    .wb-cta__content {
        position: relative;
        z-index: 1;
    }

    .wb-cta__title {
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 1rem;
    }

    .wb-cta__subtitle {
        font-size: 1.2rem;
        margin-bottom: 2rem;
        opacity: 0.9;
    }

    .wb-cta__buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    /* Team Section */
    .wb-team {
        padding: 5rem 0;
        background: var(--bg-color);
        transition: background-color 0.3s;
    }

    .wb-team__subtitle {
        text-align: center;
        color: var(--text-muted);
        font-size: 1.2rem;
        margin-bottom: 3rem;
        transition: color 0.3s;
    }

    .wb-team__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
    }

    .wb-team-card {
        background: var(--bg-alt);
        border-radius: 16px;
        overflow: hidden;
        box-shadow: var(--shadow);
        transition: all 0.3s;
        text-align: center;
    }

    .wb-team-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-hover);
    }

    .wb-team-card__image {
        width: 100%;
        height: 250px;
        object-fit: cover;
    }

    .wb-team-card__info {
        padding: 2rem;
    }

    .wb-team-card__name {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--text-color);
        transition: color 0.3s;
    }

    .wb-team-card__role {
        color: var(--primary-color);
        font-weight: 500;
        margin-bottom: 1rem;
    }

    .wb-team-card__description {
        color: var(--text-muted);
        line-height: 1.6;
        transition: color 0.3s;
    }

    /* Text Section */
    .wb-text-section {
        padding: 5rem 0;
        background: var(--bg-color);
        transition: background-color 0.3s;
    }

    .wb-text-section__content {
        margin: 0 auto;
    }

    .wb-text-section__content--left {
        text-align: left;
    }

    .wb-text-section__content--center {
        text-align: center;
        margin-left: auto;
        margin-right: auto;
    }

    .wb-text-section__content--right {
        text-align: right;
        margin-left: auto;
    }

    .wb-text-section__text {
        color: var(--text-color);
        line-height: 1.8;
        font-size: 1.1rem;
        transition: color 0.3s;
    }

    .wb-text-section__text p {
        margin-bottom: 1.5rem;
    }

    .wb-text-section__text h3 {
        color: var(--text-color);
        margin: 2rem 0 1rem 0;
        transition: color 0.3s;
    }

    .wb-text-section__text ul,
    .wb-text-section__text ol {
        margin-left: 2rem;
        margin-bottom: 1.5rem;
    }

    .wb-text-section__text li {
        margin-bottom: 0.5rem;
        color: var(--text-color);
        transition: color 0.3s;
    }

    /* FAQ Section */
    .wb-faq {
        padding: 5rem 0;
        background: var(--bg-alt);
        transition: background-color 0.3s;
    }

    .wb-faq__subtitle {
        text-align: center;
        color: var(--text-muted);
        font-size: 1.2rem;
        margin-bottom: 3rem;
        transition: color 0.3s;
    }

    .wb-faq__list {
        max-width: 800px;
        margin: 0 auto;
    }

    .wb-faq__item {
        margin-bottom: 1rem;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        overflow: hidden;
        background: var(--bg-color);
        transition: all 0.3s;
    }

    .wb-faq__question {
        width: 100%;
        padding: 1.5rem;
        background: none;
        border: none;
        text-align: left;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-color);
        cursor: pointer;
        transition: all 0.3s;
        position: relative;
    }

    .wb-faq__question:after {
        content: '+';
        position: absolute;
        right: 1.5rem;
        top: 50%;
        transform: translateY(-50%);
        font-size: 1.5rem;
        color: var(--primary-color);
        transition: transform 0.3s;
    }

    .wb-faq__item--active .wb-faq__question:after {
        transform: translateY(-50%) rotate(45deg);
    }

    .wb-faq__question:hover {
        background: var(--bg-alt);
    }

    .wb-faq__answer {
        max-height: 0;
        overflow: hidden;
        padding: 0 1.5rem;
        color: var(--text-muted);
        line-height: 1.6;
        transition: all 0.3s ease;
    }

    .wb-faq__item--active .wb-faq__answer {
        max-height: 200px;
        padding: 0 1.5rem 1.5rem;
    }

    /* Stats Section */
    .wb-stats {
        padding: 5rem 0;
        background: var(--bg-color);
        transition: background-color 0.3s;
    }

    .wb-stats__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 3rem;
        margin-top: 3rem;
    }

    .wb-stat-item {
        text-align: center;
    }

    .wb-stat-item__number {
        font-size: 3.5rem;
        font-weight: 800;
        color: var(--primary-color);
        margin-bottom: 0.5rem;
        line-height: 1;
    }

    .wb-stat-item__label {
        font-size: 1.1rem;
        color: var(--text-muted);
        font-weight: 500;
        transition: color 0.3s;
    }

    /* Video Section */
    .wb-video {
        padding: 5rem 0;
        background: var(--bg-color);
        transition: background-color 0.3s;
    }

    .wb-video__subtitle {
        text-align: center;
        color: var(--text-muted);
        font-size: 1.2rem;
        margin-bottom: 3rem;
        transition: color 0.3s;
    }

    .wb-video__container {
        max-width: 800px;
        margin: 0 auto;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: var(--shadow-hover);
    }

    .wb-video__player {
        width: 100%;
        height: auto;
        display: block;
    }

    /* Timeline Section */
    .wb-timeline {
        padding: 5rem 0;
        background: var(--bg-alt);
        transition: background-color 0.3s;
    }

    .wb-timeline__container {
        max-width: 600px;
        margin: 3rem auto 0;
        position: relative;
    }

    .wb-timeline__container:before {
        content: '';
        position: absolute;
        left: 20px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: var(--primary-color);
    }

    .wb-timeline__item {
        display: flex;
        margin-bottom: 3rem;
        position: relative;
    }

    .wb-timeline__marker {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--primary-color);
        border: 4px solid var(--bg-color);
        box-shadow: var(--shadow);
        flex-shrink: 0;
        z-index: 1;
    }

    .wb-timeline__content {
        background: var(--bg-color);
        padding: 2rem;
        border-radius: 12px;
        margin-left: 2rem;
        box-shadow: var(--shadow);
        flex: 1;
        transition: all 0.3s;
    }

    .wb-timeline__content:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-hover);
    }

    .wb-timeline__date {
        color: var(--primary-color);
        font-weight: 600;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
    }

    .wb-timeline__title {
        color: var(--text-color);
        margin-bottom: 1rem;
        transition: color 0.3s;
    }

    .wb-timeline__description {
        color: var(--text-muted);
        line-height: 1.6;
        transition: color 0.3s;
    }

    /* Footer */
    .wb-footer {
        background: var(--bg-alt);
        color: var(--text-color);
        padding: 3rem 0 1rem;
        transition: all 0.3s;
        border-top: 1px solid var(--border-color);
    }

    .wb-footer__links {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
    }

    .wb-footer__link {
        color: var(--text-color);
        text-decoration: none;
        transition: color 0.3s;
    }

    .wb-footer__link:hover {
        color: var(--primary-color);
    }

    .wb-footer__social {
        display: flex;
        justify-content: center;
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .wb-footer__social-link {
        color: var(--text-color);
        text-decoration: none;
        transition: color 0.3s;
    }

    .wb-footer__social-link:hover {
        color: var(--primary-color);
    }

    .wb-footer__copyright {
        text-align: center;
        padding-top: 2rem;
        border-top: 1px solid var(--border-color);
        opacity: 0.7;
        color: var(--text-muted);
        transition: all 0.3s;
    }

    @media (max-width: 768px) {
        .wb-hero__title {
            font-size: 2rem;
        }

        .wb-hero__subtitle {
            font-size: 1rem;
        }

        .wb-section-title {
            font-size: 2rem;
        }

        .wb-pricing-card--featured {
            transform: none;
        }

        .wb-gallery__grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }

        .wb-cta__title {
            font-size: 2rem;
        }

        .wb-cta__buttons {
            flex-direction: column;
            align-items: center;
        }

        /* Mobile navbar styles */
        .wb-navbar__burger {
            display: flex;
        }

        .wb-navbar__right {
            position: fixed;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100vh;
            background-color: var(--bg-color);
            flex-direction: column;
            justify-content: center;
            align-items: center;
            transition: left 0.3s ease;
            z-index: 1000;
        }

        .wb-navbar--mobile-open .wb-navbar__right {
            left: 0;
        }

        .wb-navbar__links {
            flex-direction: column;
            gap: 2rem;
            text-align: center;
        }

        .wb-navbar__link {
            font-size: 1.2rem;
            padding: 1rem;
        }

        .wb-navbar__theme-toggle {
            margin-top: 2rem;
            font-size: 1.5rem;
            padding: 1rem;
        }

        /* Enhanced responsive grid systems */
        .wb-features__grid,
        .wb-testimonials__grid,
        .wb-team__grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }

        .wb-pricing__grid {
            grid-template-columns: 1fr;
            gap: 2rem;
        }

        /* Better mobile spacing */
        .wb-container {
            padding: 0 1rem;
        }

        .wb-section {
            padding: 3rem 0;
        }

        /* Mobile form improvements */
        .wb-contact-form__field {
            margin-bottom: 1.5rem;
        }

        .wb-contact-form__input,
        .wb-contact-form__textarea {
            font-size: 16px; /* Prevents zoom on iOS */
        }

        /* Stats section mobile */
        .wb-stats__grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
        }

        /* FAQ mobile improvements */
        .wb-faq__question {
            font-size: 1rem;
            padding: 1rem;
        }

        /* Timeline mobile */
        .wb-timeline__item {
            margin-left: 0;
            padding-left: 2rem;
        }

        .wb-timeline__item::before {
            left: 0;
        }
    }

    /* Tablet styles */
    @media (min-width: 769px) and (max-width: 1024px) {
        .wb-features__grid,
        .wb-testimonials__grid,
        .wb-team__grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .wb-pricing__grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .wb-gallery__grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .wb-stats__grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .wb-hero__title {
            font-size: 2.5rem;
        }

        .wb-section-title {
            font-size: 2.5rem;
        }

        .wb-container {
            padding: 0 2rem;
        }
    }

    /* Large screens - enhanced spacing */
    @media (min-width: 1400px) {
        .wb-container {
            max-width: 1400px;
        }

        .wb-hero__title {
            font-size: 4rem;
        }

        .wb-section-title {
            font-size: 3.5rem;
        }
    }

    /* ============================================ */
    /* ADMIN PANEL STYLES */
    /* ============================================ */

    /* Admin Layout */
    .wb-admin-layout {
        display: flex;
        min-height: 100vh;
        background-color: var(--bg-alt);
    }

    .wb-admin-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-left: 260px;
        transition: margin-left 0.3s ease;
    }

    .wb-admin-layout--sidebar-collapsed .wb-admin-main {
        margin-left: 70px;
    }

    /* Sidebar */
    .wb-sidebar {
        position: fixed;
        left: 0;
        top: 0;
        width: 260px;
        height: 100vh;
        background-color: var(--bg-color);
        border-right: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        transition: width 0.3s ease;
        z-index: 100;
        overflow-y: auto;
    }

    .wb-sidebar--collapsed {
        width: 70px;
    }

    .wb-sidebar__header {
        padding: 1.5rem;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 70px;
    }

    .wb-sidebar__logo {
        margin: 0;
        font-size: 1.3rem;
        color: var(--primary-color);
        white-space: nowrap;
        overflow: hidden;
    }

    .wb-sidebar--collapsed .wb-sidebar__logo {
        display: none;
    }

    .wb-sidebar__logo-image {
        max-width: 150px;
        max-height: 40px;
    }

    .wb-sidebar--collapsed .wb-sidebar__logo-image {
        max-width: 40px;
    }

    .wb-sidebar__toggle {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-color);
        padding: 0.5rem;
    }

    .wb-sidebar__nav {
        flex: 1;
        padding: 1rem 0;
    }

    .wb-sidebar__item {
        display: flex;
        align-items: center;
        padding: 0.875rem 1.5rem;
        color: var(--text-color);
        text-decoration: none;
        transition: all 0.3s;
        border-left: 3px solid transparent;
        gap: 1rem;
    }

    .wb-sidebar__item:hover {
        background-color: var(--bg-alt);
        border-left-color: var(--primary-color);
    }

    .wb-sidebar__item--active {
        background-color: var(--bg-alt);
        border-left-color: var(--primary-color);
        color: var(--primary-color);
    }

    .wb-sidebar__icon {
        font-size: 1.3rem;
        min-width: 24px;
        text-align: center;
    }

    .wb-sidebar__text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .wb-sidebar--collapsed .wb-sidebar__text {
        display: none;
    }

    .wb-sidebar__badge {
        margin-left: auto;
        background-color: var(--primary-color);
        color: white;
        font-size: 0.75rem;
        padding: 0.2rem 0.5rem;
        border-radius: 10px;
        min-width: 20px;
        text-align: center;
    }

    .wb-sidebar--collapsed .wb-sidebar__badge {
        display: none;
    }

    .wb-sidebar__separator {
        padding: 1rem 1.5rem 0.5rem;
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .wb-sidebar--collapsed .wb-sidebar__separator {
        padding: 1rem 0.5rem;
        text-align: center;
    }

    /* Admin Top Bar */
    .wb-admin-topbar {
        background-color: var(--bg-color);
        border-bottom: 1px solid var(--border-color);
        padding: 1rem 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 70px;
    }

    /* Admin Content */
    .wb-admin-content {
        flex: 1;
        padding: 2rem;
    }

    /* Admin Section */
    .wb-admin-section {
        margin-bottom: 2rem;
    }

    .wb-admin-section__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.5rem;
    }

    .wb-admin-section__title {
        margin: 0;
        font-size: 1.5rem;
        color: var(--text-color);
    }

    .wb-admin-section__actions {
        display: flex;
        gap: 0.5rem;
    }

    .wb-admin-section__content {
        background-color: var(--bg-color);
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: var(--shadow);
    }

    /* Card Component */
    .wb-card {
        background-color: var(--bg-color);
        border-radius: 8px;
        box-shadow: var(--shadow);
        overflow: hidden;
        transition: all 0.3s;
    }

    .wb-card:hover {
        box-shadow: var(--shadow-hover);
    }

    .wb-card--info {
        border-left: 4px solid #3498db;
    }

    .wb-card--success {
        border-left: 4px solid #2ecc71;
    }

    .wb-card--warning {
        border-left: 4px solid #f39c12;
    }

    .wb-card--danger {
        border-left: 4px solid #e74c3c;
    }

    .wb-card__header {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .wb-card__title-container {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .wb-card__icon {
        font-size: 1.5rem;
    }

    .wb-card__title {
        margin: 0;
        font-size: 1.1rem;
        color: var(--text-color);
    }

    .wb-card__actions {
        display: flex;
        gap: 0.5rem;
    }

    .wb-card__action-btn {
        background: none;
        border: 1px solid var(--border-color);
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        cursor: pointer;
        color: var(--text-color);
        transition: all 0.3s;
        font-size: 0.875rem;
    }

    .wb-card__action-btn:hover {
        background-color: var(--bg-alt);
        border-color: var(--primary-color);
        color: var(--primary-color);
    }

    .wb-card__body {
        padding: 1.5rem;
    }

    .wb-card__value {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--text-color);
        margin-bottom: 0.5rem;
    }

    .wb-card__subtitle {
        font-size: 0.875rem;
        color: var(--text-muted);
    }

    .wb-card__footer {
        padding: 1rem 1.5rem;
        background-color: var(--bg-alt);
        font-size: 0.875rem;
        color: var(--text-muted);
    }

    /* Card Grid */
    .wb-card-grid {
        display: grid;
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    /* DataTable */
    .wb-datatable {
        background-color: var(--bg-color);
        border-radius: 8px;
        box-shadow: var(--shadow);
        overflow: hidden;
    }

    .wb-datatable__search {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid var(--border-color);
    }

    .wb-datatable__search-input {
        width: 100%;
        max-width: 400px;
        padding: 0.5rem 1rem;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        font-size: 0.875rem;
        background-color: var(--bg-color);
        color: var(--text-color);
    }

    .wb-datatable__search-input:focus {
        outline: none;
        border-color: var(--primary-color);
    }

    .wb-datatable__wrapper {
        overflow-x: auto;
    }

    .wb-datatable__table {
        width: 100%;
        border-collapse: collapse;
    }

    .wb-datatable__table thead {
        background-color: var(--bg-alt);
    }

    .wb-datatable__table th {
        padding: 1rem 1.5rem;
        text-align: left;
        font-weight: 600;
        color: var(--text-color);
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .wb-datatable__th--sortable {
        cursor: pointer;
        user-select: none;
    }

    .wb-datatable__th--sortable:hover {
        background-color: var(--bg-color);
    }

    .wb-datatable__table td {
        padding: 1rem 1.5rem;
        border-top: 1px solid var(--border-color);
        color: var(--text-color);
    }

    .wb-datatable__table tbody tr:hover {
        background-color: var(--bg-alt);
    }

    .wb-datatable__actions {
        display: flex;
        gap: 0.5rem;
    }

    .wb-datatable__action-btn {
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        font-size: 0.875rem;
        transition: all 0.3s;
    }

    .wb-datatable__action-btn--default {
        background-color: var(--bg-alt);
        color: var(--text-color);
    }

    .wb-datatable__action-btn--default:hover {
        background-color: var(--primary-color);
        color: white;
    }

    .wb-datatable__action-btn--danger {
        background-color: #e74c3c;
        color: white;
    }

    .wb-datatable__action-btn--danger:hover {
        background-color: #c0392b;
    }

    .wb-datatable__action-btn--success {
        background-color: #2ecc71;
        color: white;
    }

    .wb-datatable__action-btn--success:hover {
        background-color: #27ae60;
    }

    .wb-datatable__pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 1rem;
        border-top: 1px solid var(--border-color);
    }

    .wb-datatable__pagination button {
        padding: 0.5rem 1rem;
        border: 1px solid var(--border-color);
        background-color: var(--bg-color);
        color: var(--text-color);
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;
    }

    .wb-datatable__pagination button:hover:not(:disabled) {
        background-color: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }

    .wb-datatable__pagination button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .wb-datatable__pagination span {
        color: var(--text-muted);
        font-size: 0.875rem;
    }

    /* Admin Panel Responsive */
    @media (max-width: 1024px) {
        .wb-admin-main {
            margin-left: 0;
        }

        .wb-sidebar {
            transform: translateX(-100%);
        }

        .wb-sidebar--mobile-open {
            transform: translateX(0);
        }

        .wb-admin-content {
            padding: 1rem;
        }

        .wb-card-grid {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 768px) {
        .wb-admin-section__header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }

        .wb-datatable__table {
            font-size: 0.875rem;
        }

        .wb-datatable__table th,
        .wb-datatable__table td {
            padding: 0.75rem 1rem;
        }

        .wb-card__value {
            font-size: 2rem;
        }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Export classes for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Website,
        Page,
        NavBar,
        HeroBanner,
        Testimonials,
        Footer,
        FeatureGrid,
        PricingTable,
        ContactForm,
        Gallery,
        CTA,
        TeamSection,
        TextSection,
        FAQ,
        StatsSection,
        VideoSection,
        Timeline,
        Sidebar,
        Card,
        DataTable,
        AdminLayout,
        AdminSection,
        CardGrid
    };
}