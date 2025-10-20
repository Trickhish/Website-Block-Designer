# WebsiteBuilder Framework

A vanilla JavaScript framework for rapidly building beautiful, responsive websites through a declarative, component-based API.

## Table of Contents
- [Getting Started](#getting-started)
- [Core Architecture](#core-architecture)
- [Website Class](#website-class)
- [Page Management](#page-management)
- [Navigation System](#navigation-system)
- [Theme System](#theme-system)
- [Component Library](#component-library)
- [Styling System](#styling-system)
- [Examples](#examples)
- [Browser Support](#browser-support)

## Getting Started

### Basic Setup

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
</head>
<body>
    <script src="builder.js"></script>
    <script>
        // Create website
        const website = new Website({
            smoothScrolling: true,
            defaultPage: 'home'
        });

        // Create page
        const homePage = new Page('home');
        
        // Add components
        homePage.add(new NavBar({
            logo: "My Website",
            pageNavigation: true,
            themeToggle: true
        }));
        
        homePage.add(new HeroBanner("Welcome!", {
            subtitle: "Build amazing websites easily",
            buttons: [
                { title: "Get Started", link: "about", primary: true }
            ]
        }));

        // Add page to website and display
        website.add(homePage);
        website.display('body');
    </script>
</body>
</html>
```

## Core Architecture

### Website Class

The main container that manages pages, themes, and global settings.

```javascript
const website = new Website({
    smoothScrolling: true,           // Enable smooth scroll behavior
    defaultPage: "home",             // Initial page to display
    darkMode: false,                 // Start in light/dark mode
    colors: {                        // Custom color scheme
        primary: '#6c63ff',
        primaryDark: '#5952d4',
        light: {
            text: '#333',
            background: '#ffffff',
            backgroundAlt: '#f8f9fa'
        },
        dark: {
            text: '#e1e1e1',
            background: '#1a1a2e',
            backgroundAlt: '#16213e'
        }
    }
});
```

#### Website Methods

```javascript
// Page management
website.add(page);                   // Add a page
website.showPage('pageName');        // Navigate to page
website.getPageNames();              // Get all page names
website.getCurrentPageName();        // Get current page

// Theme management
website.setTheme('dark');            // Set theme (light/dark)
website.toggleTheme();               // Toggle between themes
website.updateColors({              // Update color scheme
    primary: '#ff6b6b'
});
```

### Page Management

Pages are containers for components (sections).

```javascript
const page = new Page('pageName');

// Add components to page
page.add(new NavBar({...}));
page.add(new HeroBanner("Title", {...}));
page.add(new FeatureGrid("Features", {...}));
page.add(new Footer({...}));
```

### Navigation System

#### Automatic Page Navigation

The NavBar component can automatically generate navigation links:

```javascript
new NavBar({
    logo: "My Site",
    pageNavigation: true,    // Auto-generates links for all pages
    themeToggle: true,       // Adds theme toggle button
    logoSize: "large"        // small, medium, large
})
```

#### Smart Link Detection

Buttons automatically detect page names and handle navigation:

```javascript
new HeroBanner("Welcome", {
    buttons: [
        { title: "About Us", link: "about" },      // Auto-navigates to 'about' page
        { title: "Contact", link: "contact" },     // Auto-navigates to 'contact' page
        { title: "External", link: "https://..." } // Regular external link
    ]
})
```

## Theme System

### Built-in Themes

The framework includes light and dark themes with automatic switching:

```javascript
// Theme toggle in navbar
new NavBar({
    themeToggle: true  // Adds moon/sun toggle button
});

// Manual theme control
website.setTheme('dark');
website.toggleTheme();
```

### Custom Color Schemes

Define your brand colors:

```javascript
const website = new Website({
    colors: {
        primary: '#ff6b6b',        // Brand primary color
        primaryDark: '#ff5252',    // Darker shade for hover states
        
        light: {
            text: '#2c3e50',       // Main text color in light mode
            textMuted: '#666666',  // Muted text (descriptions)
            background: '#ffffff', // Main background
            backgroundAlt: '#f8f9fa', // Alternate background (cards)
            border: 'rgba(0,0,0,0.1)', // Border color
            shadow: '0 2px 10px rgba(0,0,0,0.1)', // Box shadows
            shadowHover: '0 4px 20px rgba(0,0,0,0.15)'
        },
        
        dark: {
            text: '#ecf0f1',
            textMuted: '#bdc3c7',
            background: '#2c3e50',
            backgroundAlt: '#34495e',
            border: 'rgba(255,255,255,0.1)',
            shadow: '0 2px 10px rgba(0,0,0,0.3)',
            shadowHover: '0 4px 20px rgba(0,0,0,0.4)'
        }
    }
});
```

### Dynamic Color Updates

```javascript
// Update colors after website creation
website.updateColors({
    primary: '#9b59b6',
    light: {
        background: '#faf5ff'
    }
});
```

## Component Library

### Navigation Components

#### NavBar
```javascript
new NavBar({
    logo: "Brand Name",              // Text logo
    logoImage: "logo.png",           // Image logo
    logoImageDark: "logo-dark.png",  // Dark mode logo
    logoSize: "medium",              // small, medium, large
    pageNavigation: true,            // Auto page navigation
    themeToggle: true,               // Theme toggle button
    links: [                         // Custom links
        { title: "External", href: "https://..." }
    ]
})
```

### Hero Components

#### HeroBanner
```javascript
new HeroBanner("Main Title", {
    subtitle: "Subtitle text",
    bgImage: "hero.jpg",             // Background image
    bgColor: "#6c63ff",              // Or background color/gradient
    textColor: "auto",               // auto, light, dark, inherit
    height: "100vh",                 // Section height
    buttonsPlacement: "center",      // left, center, right
    buttons: [
        { title: "Get Started", link: "contact", primary: true },
        { title: "Learn More", link: "about", primary: false }
    ]
})
```

### Content Components

#### FeatureGrid
```javascript
new FeatureGrid("Why Choose Us?", {
    id: "features",                  // Anchor ID
    columns: 3,                      // Grid columns
    items: [
        {
            icon: "⚡",               // Emoji or text icon
            title: "Fast",
            description: "Lightning fast performance"
        },
        {
            icon: "🎨",
            title: "Beautiful",
            description: "Stunning designs"
        }
    ]
})
```

#### TextSection
```javascript
new TextSection("About Us", 
    `<p>Rich HTML content goes here.</p>
     <h3>Subheading</h3>
     <ul>
        <li>List item 1</li>
        <li>List item 2</li>
     </ul>`, 
    {
        alignment: "center",         // left, center, right
        maxWidth: "800px",
        bgColor: "transparent"       // Optional background
    }
)
```

#### Gallery
```javascript
new Gallery("Our Work", {
    lightbox: true,                  // Enable lightbox
    columns: 3,
    images: [
        "image1.jpg",
        { src: "image2.jpg", alt: "Description" },
        "image3.jpg"
    ]
})
```

### Interactive Components

#### FAQ
```javascript
new FAQ("Frequently Asked Questions", {
    subtitle: "Find answers to common questions",
    questions: [
        {
            question: "How does it work?",
            answer: "It's simple! Just follow these steps..."
        },
        {
            question: "What's included?",
            answer: "Everything you need to get started."
        }
    ]
})
```

#### ContactForm
```javascript
new ContactForm("Get In Touch", {
    subtitle: "We'd love to hear from you",
    action: "/submit",               // Form action URL
    method: "POST",                  // Form method
    fields: [
        { type: 'text', name: 'name', label: 'Full Name', required: true },
        { type: 'email', name: 'email', label: 'Email', required: true },
        { type: 'tel', name: 'phone', label: 'Phone', required: false },
        { type: 'textarea', name: 'message', label: 'Message', required: true }
    ],
    buttonText: "Send Message"
})
```

### Business Components

#### PricingTable
```javascript
new PricingTable("Choose Your Plan", {
    plans: [
        {
            title: "Basic",
            price: "9",
            currency: "€",
            period: "month",
            description: "Perfect for individuals",
            features: [
                "Feature 1",
                "Feature 2",
                "Feature 3"
            ],
            buttonText: "Get Started",
            buttonLink: "signup"
        },
        {
            title: "Pro",
            price: "29",
            featured: true,              // Highlight this plan
            features: ["Everything in Basic", "Advanced features"],
            buttonLink: "signup"
        }
    ]
})
```

#### Testimonials
```javascript
new Testimonials("What Our Customers Say", {
    columns: 3,
    items: [
        {
            clientName: "John Doe",
            grade: 5,                    // 1-5 stars
            comment: "Excellent service and support!"
        },
        {
            clientName: "Jane Smith",
            grade: 4,
            comment: "Great experience overall."
        }
    ]
})
```

#### TeamSection
```javascript
new TeamSection("Meet Our Team", {
    subtitle: "The people behind the magic",
    members: [
        {
            name: "John Doe",
            role: "CEO & Founder",
            description: "Passionate about creating amazing experiences",
            image: "team/john.jpg"
        },
        {
            name: "Jane Smith",
            role: "Lead Designer",
            description: "Bringing beautiful designs to life",
            image: "team/jane.jpg"
        }
    ]
})
```

### Media Components

#### VideoSection
```javascript
new VideoSection("Watch Our Story", "video.mp4", {
    subtitle: "See how we make the difference",
    poster: "video-poster.jpg",      // Poster image
    autoplay: false,                 // Auto-play video
    controls: true                   // Show video controls
})
```

### Timeline & Stats

#### StatsSection
```javascript
new StatsSection("By The Numbers", {
    stats: [
        { number: "1000", suffix: "+", label: "Happy Customers" },
        { number: "50", suffix: "K", label: "Projects Completed" },
        { number: "99", suffix: "%", label: "Satisfaction Rate" },
        { number: "24", suffix: "/7", label: "Support Available" }
    ]
})
```

#### Timeline
```javascript
new Timeline("Our Journey", {
    events: [
        {
            date: "2020",
            title: "Company Founded",
            description: "Started with a simple idea and big dreams"
        },
        {
            date: "2021",
            title: "First Major Client",
            description: "Landed our breakthrough project"
        },
        {
            date: "2024",
            title: "Global Expansion",
            description: "Now serving clients worldwide"
        }
    ]
})
```

### Call-to-Action Components

#### CTA
```javascript
new CTA("Ready to Get Started?", {
    subtitle: "Join thousands of satisfied customers",
    bgColor: "transparent",          // transparent, color, or gradient
    bgImage: "cta-bg.jpg",          // Background image
    textColor: "auto",              // auto, light, dark, inherit
    buttons: [
        { title: "Start Free Trial", link: "signup", primary: true },
        { title: "Learn More", link: "about", primary: false }
    ]
})
```

#### Footer
```javascript
new Footer({
    copyright: "© 2024 My Company. All rights reserved.",
    links: [
        { title: "Privacy Policy", href: "/privacy" },
        { title: "Terms of Service", href: "/terms" },
        { title: "Contact", href: "/contact" }
    ],
    social: [
        { name: "Twitter", link: "https://twitter.com/..." },
        { name: "Facebook", link: "https://facebook.com/..." },
        { name: "LinkedIn", link: "https://linkedin.com/..." }
    ]
})
```

## Styling System

### CSS Class Convention

All CSS classes use the `wb-` prefix (WebBuilder) to avoid conflicts:

- **Component blocks**: `wb-navbar`, `wb-hero`, `wb-features`
- **Elements**: `wb-navbar__logo`, `wb-hero__title`
- **Modifiers**: `wb-button--primary`, `wb-navbar--fixed`

### CSS Variables

The framework uses CSS custom properties for theming:

```css
:root {
    --primary-color: #6c63ff;
    --primary-dark: #5952d4;
    --text-color: #333;
    --bg-color: #ffffff;
    /* ... more variables */
}

[data-theme="dark"] {
    --text-color: #e1e1e1;
    --bg-color: #1a1a2e;
    /* ... dark theme overrides */
}
```

## Responsive Design System

WebBuilder Framework features a comprehensive responsive design system with mobile-first approach and optimized layouts for all screen sizes.

### Breakpoint System

The framework uses three main breakpoints:

- **Mobile**: Default styles (up to 768px)
- **Tablet**: 769px - 1024px
- **Desktop**: 1025px and above
- **Large Desktop**: 1400px and above

### Mobile Navigation (Burger Menu)

The NavBar component automatically switches to a burger menu on mobile devices:

```javascript
new NavBar({
    logo: "Brand Name",
    pageNavigation: true,
    themeToggle: true
    // Burger menu is automatically enabled on mobile
})
```

#### Mobile Menu Features:
- **Slide-in overlay**: Full-screen navigation overlay
- **Animated burger icon**: Three-line hamburger that transforms to X
- **Auto-close**: Menu closes when links are clicked
- **Touch-friendly**: Large touch targets for better mobile UX

### Component Responsive Behavior

#### Grid Components
All grid-based components automatically adjust their columns:

```javascript
// FeatureGrid example - responsive columns
new FeatureGrid("Features", {
    columns: 3,  // 3 columns on desktop
    // Automatically becomes:
    // - 2 columns on tablet
    // - 1 column on mobile
    items: [...]
})
```

**Responsive Column Behavior:**
- **Desktop**: As specified (e.g., 3 columns)
- **Tablet**: 2 columns maximum
- **Mobile**: 1 column

#### Typography Scaling

Font sizes automatically scale across devices:

```css
/* Desktop */
.wb-hero__title { font-size: 3.5rem; }
.wb-section-title { font-size: 3rem; }

/* Tablet */
.wb-hero__title { font-size: 2.5rem; }
.wb-section-title { font-size: 2.5rem; }

/* Mobile */
.wb-hero__title { font-size: 2rem; }
.wb-section-title { font-size: 2rem; }
```

#### Spacing & Layout

Containers and spacing adapt to screen size:

```css
/* Container padding */
.wb-container {
    max-width: 1200px;       /* Desktop */
    padding: 0 2rem;         /* Tablet */
    padding: 0 1rem;         /* Mobile */
    max-width: 1400px;       /* Large Desktop */
}

/* Section padding */
.wb-section {
    padding: 5rem 0;         /* Desktop */
    padding: 3rem 0;         /* Mobile */
}
```

### Component-Specific Responsive Features

#### PricingTable
```javascript
new PricingTable("Pricing", {
    plans: [...]
    // Desktop: 3 columns side by side
    // Tablet: 2 columns
    // Mobile: 1 column (stacked)
})
```

#### Gallery
```javascript
new Gallery("Portfolio", {
    images: [...],
    columns: 3
    // Auto-adjusts to 2 columns on tablet, varies on mobile
})
```

#### Stats Section
```javascript
new StatsSection("Numbers", {
    stats: [...]
    // Desktop: 4 columns
    // Tablet/Mobile: 2 columns
})
```

#### Forms
Mobile-optimized form inputs:
- **Font size**: 16px to prevent iOS zoom
- **Larger touch targets**: Improved mobile usability
- **Stacked layout**: Single column on mobile

#### Buttons
```javascript
// Button groups stack on mobile
new CTA("Call to Action", {
    buttons: [
        { title: "Primary", primary: true },
        { title: "Secondary", primary: false }
    ]
    // Desktop: side by side
    // Mobile: stacked vertically
})
```

### Mobile-First Development

The framework follows mobile-first principles:

1. **Default styles target mobile devices**
2. **Progressive enhancement for larger screens**
3. **Touch-friendly interface elements**
4. **Optimized performance for mobile networks**

### Responsive Best Practices

#### Content Strategy
- **Prioritize important content** for mobile users
- **Use shorter headlines** on mobile devices
- **Ensure readable font sizes** (minimum 16px)

#### Performance
- **Lazy loading**: Images load as needed
- **Optimized animations**: Reduced motion on mobile
- **Minimal dependencies**: Faster load times

#### Accessibility
- **Large touch targets**: Minimum 44px tap targets
- **Keyboard navigation**: Full keyboard support
- **Screen reader friendly**: Semantic HTML structure

### Testing Responsive Design

#### Browser Dev Tools
```javascript
// Test different screen sizes in browser
// Chrome DevTools: Toggle device toolbar (Ctrl/Cmd + Shift + M)
```

#### Real Device Testing
- **iOS Safari**: Test on actual iPhone/iPad
- **Android Chrome**: Test on Android devices
- **Different orientations**: Portrait and landscape

#### Common Breakpoints for Testing
- **320px**: Small mobile (iPhone SE)
- **375px**: Standard mobile (iPhone)
- **768px**: Tablet breakpoint
- **1024px**: Small desktop/large tablet
- **1200px**: Standard desktop
- **1400px+**: Large desktop

### Custom Responsive Styling

You can add custom responsive styles:

```css
/* Custom mobile styles */
@media (max-width: 768px) {
    .custom-component {
        font-size: 0.9rem;
        padding: 1rem;
    }
}

/* Custom tablet styles */
@media (min-width: 769px) and (max-width: 1024px) {
    .custom-component {
        font-size: 1.1rem;
        padding: 1.5rem;
    }
}
```

## Examples

### Complete Single Page

```javascript
const website = new Website({
    smoothScrolling: true,
    colors: { primary: '#ff6b6b' }
});

const page = new Page('home');

page.add(new NavBar({
    logo: "My Brand",
    themeToggle: true
}));

page.add(new HeroBanner("Welcome to My Site", {
    subtitle: "Build amazing things",
    bgImage: "hero.jpg",
    buttons: [{ title: "Get Started", link: "#contact", primary: true }]
}));

page.add(new FeatureGrid("Features", {
    items: [
        { icon: "⚡", title: "Fast", description: "Lightning fast" },
        { icon: "🎨", title: "Beautiful", description: "Stunning design" }
    ]
}));

page.add(new ContactForm("Contact Us", {
    fields: [
        { type: 'text', name: 'name', label: 'Name', required: true },
        { type: 'email', name: 'email', label: 'Email', required: true }
    ]
}));

page.add(new Footer({ copyright: "© 2024 My Brand" }));

website.add(page);
website.display('body');
```

### Multi-Page Website

```javascript
const website = new Website({
    defaultPage: 'home',
    pageNavigation: true
});

// Home page
const homePage = new Page('home');
homePage.add(new NavBar({ logo: "Brand", pageNavigation: true }));
homePage.add(new HeroBanner("Welcome"));

// About page
const aboutPage = new Page('about');
aboutPage.add(new NavBar({ logo: "Brand", pageNavigation: true }));
aboutPage.add(new TextSection("About Us", "<p>Our story...</p>"));

// Contact page
const contactPage = new Page('contact');
contactPage.add(new NavBar({ logo: "Brand", pageNavigation: true }));
contactPage.add(new ContactForm("Get In Touch"));

website.add(homePage);
website.add(aboutPage);
website.add(contactPage);
website.display('body');
```

### Custom Styling

```html
<style>
/* Override component styles */
.wb-hero {
    background: linear-gradient(45deg, #667eea, #764ba2);
}

/* Custom component styling */
.wb-navbar__logo {
    font-family: 'Custom Font', serif;
    font-size: 2rem;
}

/* Theme-aware custom styles */
[data-theme="dark"] .custom-element {
    background: var(--bg-alt);
    color: var(--text-color);
}
</style>
```

## Browser Support

- **Chrome/Edge**: Latest 2 versions
- **Firefox**: Latest 2 versions  
- **Safari**: Latest 2 versions
- **Mobile**: iOS Safari 12+, Chrome Android latest

### Requirements

- ES6+ support (classes, arrow functions, template literals)
- CSS Grid and Flexbox support
- CSS Custom Properties support
- Media queries support for responsive design

### Mobile Browser Optimizations

The framework includes specific optimizations for mobile browsers:

- **iOS Safari**: Prevents zoom on form inputs (16px font size)
- **Android Chrome**: Touch-friendly tap targets (44px minimum)
- **Mobile Performance**: Optimized animations and transitions
- **Touch Events**: Proper touch event handling for mobile interactions

## Best Practices

### Performance
- Use `loading="lazy"` for images (automatically applied)
- Optimize images before using
- Keep component trees shallow when possible

### Accessibility
- Always provide `alt` text for images
- Use semantic HTML structure
- Test with keyboard navigation
- Ensure color contrast meets WCAG guidelines

### SEO
- Use descriptive page titles
- Structure content with proper headings (h1, h2, h3)
- Include meta descriptions in page head
- Use semantic HTML elements

### Development Tips
- Start with a single page and expand
- Use the theme system for consistent colors
- Test responsive design on multiple devices and orientations
- Validate forms before submission
- Use the smart link detection for internal navigation
- Design mobile-first, then enhance for desktop
- Keep touch targets at least 44px for mobile usability
- Test the burger menu functionality on actual mobile devices
- Ensure all content is accessible on small screens

## Troubleshooting

### Common Issues

**Components not displaying:**
- Ensure `builder.js` is loaded before your script
- Check browser console for errors
- Verify all required parameters are provided

**Theme not switching:**
- Make sure `themeToggle: true` is set in NavBar
- Check if custom CSS is overriding theme variables

**Page navigation not working:**
- Verify `pageNavigation: true` in NavBar
- Ensure page names match link references
- Check that all pages are added to website before display

**Styling conflicts:**
- Use `wb-` prefixed classes for consistency
- Avoid global CSS that might conflict
- Use CSS specificity correctly

**Mobile menu not working:**
- Ensure JavaScript is enabled
- Check for console errors
- Verify touch events are supported

**Responsive layouts breaking:**
- Test different screen sizes in dev tools
- Check for fixed widths that prevent responsiveness
- Ensure CSS Grid and Flexbox are supported

**Content not scaling properly:**
- Use relative units (rem, em, %) instead of fixed pixels
- Test on actual mobile devices
- Check viewport meta tag is present

---

This framework is designed to be simple yet powerful. Start with basic components and gradually add more complex features as needed. The declarative API makes it easy to build and maintain professional websites without writing HTML or CSS manually.