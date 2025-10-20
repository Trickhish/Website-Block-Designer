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

                if (this.options.smoothScrolling) {
                    document.documentElement.style.scrollBehavior = 'smooth';
                }

                document.body.setAttribute('data-theme', this.options.theme);
                this.showPage(this.options.defaultPage);
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

                if (window.location.hash) {
                    setTimeout(() => {
                        const element = document.querySelector(window.location.hash);
                        if (element) element.scrollIntoView();
                    }, 100);
                }
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

        class NavBar {
            constructor(options = {}) {
                this.options = {
                    style: options.style || 'default',
                    links: options.links || [],
                    logo: options.logo || null,
                    fixed: options.fixed !== false,
                    ...options
                };
            }

            render() {
                const nav = document.createElement('nav');
                nav.className = `wb-navbar wb-navbar--${this.options.style}`;
                if (this.options.fixed) nav.classList.add('wb-navbar--fixed');

                const container = document.createElement('div');
                container.className = 'wb-navbar__container';

                if (this.options.logo) {
                    const logo = document.createElement('div');
                    logo.className = 'wb-navbar__logo';
                    logo.innerHTML = this.options.logo;
                    container.appendChild(logo);
                }

                const linksContainer = document.createElement('ul');
                linksContainer.className = 'wb-navbar__links';

                this.options.links.forEach(link => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = link.href;
                    a.textContent = link.title;
                    a.className = 'wb-navbar__link';
                    li.appendChild(a);
                    linksContainer.appendChild(li);
                });

                container.appendChild(linksContainer);
                nav.appendChild(container);

                return nav;
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
                    ...options
                };
            }

            render() {
                const hero = document.createElement('section');
                hero.className = 'wb-hero';
                hero.style.minHeight = this.options.height;

                if (this.options.bgImage) {
                    hero.style.backgroundImage = `url(${this.options.bgImage})`;
                    hero.style.backgroundSize = 'cover';
                    hero.style.backgroundPosition = 'center';
                } else {
                    hero.style.backgroundColor = this.options.bgColor;
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
                        btnContainer.appendChild(button);
                    });

                    content.appendChild(btnContainer);
                }

                hero.appendChild(content);
                return hero;
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

                const copyright = document.createElement('div');
                copyright.className = 'wb-footer__copyright';
                copyright.textContent = this.options.copyright;
                container.appendChild(copyright);

                footer.appendChild(container);
                return footer;
            }
        }

        // ============================================
        // STYLES
        // ============================================

        const styles = `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                line-height: 1.6;
                color: #333;
            }

            .wb-container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 20px;
            }

            .wb-navbar {
                background: white;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                padding: 1rem 0;
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

            .wb-navbar__logo {
                font-size: 1.5rem;
                font-weight: bold;
                color: #1a1a2e;
            }

            .wb-navbar__links {
                display: flex;
                list-style: none;
                gap: 2rem;
            }

            .wb-navbar__link {
                text-decoration: none;
                color: #333;
                font-weight: 500;
                transition: color 0.3s;
            }

            .wb-navbar__link:hover {
                color: #6c63ff;
            }

            .wb-hero {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                text-align: center;
                overflow: hidden;
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
            }

            .wb-button--primary {
                background: #6c63ff;
                color: white;
            }

            .wb-button--primary:hover {
                background: #5952d4;
                transform: translateY(-2px);
            }

            .wb-button--secondary {
                background: transparent;
                color: white;
                border-color: white;
            }

            .wb-button--secondary:hover {
                background: white;
                color: #6c63ff;
            }

            .wb-testimonials {
                padding: 5rem 0;
                background: #f8f9fa;
            }

            .wb-section-title {
                text-align: center;
                font-size: 2.5rem;
                margin-bottom: 3rem;
                color: #1a1a2e;
            }

            .wb-testimonials__grid {
                display: grid;
                gap: 2rem;
            }

            .wb-testimonial-card {
                background: white;
                padding: 2rem;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                transition: transform 0.3s;
            }

            .wb-testimonial-card:hover {
                transform: translateY(-5px);
            }

            .wb-testimonial-card__stars {
                color: #ffd700;
                font-size: 1.5rem;
                margin-bottom: 1rem;
            }

            .wb-testimonial-card__comment {
                color: #666;
                margin-bottom: 1rem;
                line-height: 1.8;
            }

            .wb-testimonial-card__name {
                font-weight: 600;
                color: #1a1a2e;
            }

            .wb-features {
                padding: 5rem 0;
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
                background: #f8f9fa;
            }

            .wb-feature-card__icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }

            .wb-feature-card__title {
                font-size: 1.5rem;
                margin-bottom: 1rem;
                color: #1a1a2e;
            }

            .wb-feature-card__description {
                color: #666;
                line-height: 1.8;
            }

            .wb-footer {
                background: #1a1a2e;
                color: white;
                padding: 3rem 0 1rem;
            }

            .wb-footer__links {
                display: flex;
                justify-content: center;
                gap: 2rem;
                margin-bottom: 2rem;
                flex-wrap: wrap;
            }

            .wb-footer__link {
                color: white;
                text-decoration: none;
                transition: color 0.3s;
            }

            .wb-footer__link:hover {
                color: #6c63ff;
            }

            .wb-footer__social {
                display: flex;
                justify-content: center;
                gap: 1.5rem;
                margin-bottom: 2rem;
            }

            .wb-footer__social-link {
                color: white;
                text-decoration: none;
                transition: color 0.3s;
            }

            .wb-footer__social-link:hover {
                color: #6c63ff;
            }

            .wb-footer__copyright {
                text-align: center;
                padding-top: 2rem;
                border-top: 1px solid rgba(255,255,255,0.1);
                opacity: 0.7;
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
                    font-size: 0.9rem;
                }

                .wb-section-title {
                    font-size: 2rem;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);