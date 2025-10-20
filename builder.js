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

        .wb-navbar__links {
            gap: 1rem;
        }

        .wb-section-title {
            font-size: 2rem;
        }

        .wb-navbar__right {
            gap: 0.5rem;
        }

        .wb-navbar__links {
            gap: 1rem;
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
        Timeline
    };
}