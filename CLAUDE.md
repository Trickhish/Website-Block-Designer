# WebsiteBuilder Framework

## Project Overview

WebsiteBuilder is a vanilla JavaScript framework for rapidly building beautiful, responsive websites through a declarative, class-based API. It allows developers to compose pages from pre-styled section components without writing HTML or CSS manually.

## Architecture

### Core Concepts

1. **Website**: The main container that manages pages and global settings
2. **Page**: Represents a single page composed of multiple sections
3. **Sections**: Reusable components (NavBar, HeroBanner, Testimonials, etc.)

### Design Philosophy

- **Zero dependencies**: Pure vanilla JavaScript
- **Component-based**: Each section is a self-contained class
- **Declarative API**: Build websites by instantiating and configuring classes
- **Render pattern**: Each component has a `render()` method that returns a DOM element
- **Style injection**: CSS is injected programmatically into the document head

## File Structure

```
websitebuilder/
├── src/
│   ├── core/
│   │   ├── Website.js       # Main container class
│   │   └── Page.js          # Page management
│   ├── components/
│   │   ├── NavBar.js        # Navigation bar
│   │   ├── HeroBanner.js    # Hero section
│   │   ├── Testimonials.js  # Testimonials grid
│   │   ├── FeatureGrid.js   # Features grid
│   │   └── Footer.js        # Footer section
│   ├── styles/
│   │   └── styles.js        # CSS-in-JS styles
│   └── index.js             # Main entry point
├── examples/
│   └── demo.html            # Usage example
└── README.md
```

## API Reference

### Website Class

```javascript
const website = new Website({
    smoothScrolling: true,      // Enable smooth scroll behavior
    defaultPage: "home",        // Initial page to display
    theme: "light"              // Theme (not fully implemented)
});

website.add(page);              // Add a page
website.display('body');        // Render to DOM
```

### Page Class

```javascript
const page = new Page("home");
page.add(section);              // Add a section component
```

### NavBar Component

```javascript
new NavBar({
    style: "default",           // Style variant (currently only default)
    logo: "Logo Text/HTML",     // Logo content
    fixed: true,                // Fixed positioning
    links: [
        {
            title: "Link Text",
            href: "/path"
        }
    ]
})
```

### HeroBanner Component

```javascript
new HeroBanner("Title Text", {
    subtitle: "Subtitle text",
    bgImage: "url",             // Background image URL
    bgColor: "#hex or gradient",
    height: "100vh",            // Section height
    buttonsPlacement: "center", // left, center, right
    overlay: true,              // Dark overlay on bg image
    buttons: [
        {
            title: "Button Text",
            link: "#anchor",
            primary: true       // Primary or secondary style
        }
    ]
})
```

### Testimonials Component

```javascript
new Testimonials("Section Title", {
    id: "testimonials-section", // Anchor ID
    columns: 3,                 // Grid columns
    items: [
        {
            clientName: "Name",
            grade: 5,           // 1-5 stars
            comment: "Comment text"
        }
    ]
})
```

### FeatureGrid Component

```javascript
new FeatureGrid("Section Title", {
    id: "features-section",
    columns: 3,
    items: [
        {
            icon: "emoji or text",
            title: "Feature Title",
            description: "Description text"
        }
    ]
})
```

### Footer Component

```javascript
new Footer({
    copyright: "Copyright text",
    links: [
        {
            title: "Link Text",
            href: "/path"
        }
    ],
    social: [
        {
            name: "Platform Name",
            link: "url"
        }
    ]
})
```

## CSS Class Naming Convention

All CSS classes use the `wb-` (WebBuilder) prefix to avoid conflicts:

- `wb-navbar`, `wb-navbar__container`, `wb-navbar__link`
- `wb-hero`, `wb-hero__title`, `wb-hero__buttons`
- `wb-testimonials`, `wb-testimonial-card`
- `wb-features`, `wb-feature-card`
- `wb-footer`, `wb-footer__links`

BEM-like naming: `block`, `block__element`, `block--modifier`

## Styling System

Styles are defined as a string template and injected into `<style>` tag in the document head. The system includes:

- **Reset styles**: Basic CSS reset
- **Container**: Max-width 1200px, centered layout
- **Responsive breakpoints**: Mobile styles at 768px
- **Component styles**: Each component has dedicated styles
- **Utility classes**: Buttons, containers, etc.

## Future Enhancements

### Potential New Components
- **PricingTable**: Pricing cards with features
- **ContactForm**: Contact form with validation
- **Gallery**: Image gallery with lightbox
- **Timeline**: Vertical/horizontal timeline
- **Stats**: Animated statistics counters
- **FAQ**: Accordion-style FAQ section
- **Team**: Team member cards
- **CTA (Call-to-Action)**: Conversion-focused section
- **BlogGrid**: Blog post cards grid
- **VideoSection**: Embedded video with overlay

### Framework Improvements
- **Theme system**: Dark/light themes with custom colors
- **Animation system**: Scroll animations and transitions
- **Responsive images**: Automatic image optimization
- **Form validation**: Built-in form validation
- **Modal system**: Popup/modal components
- **Multi-page routing**: SPA-style navigation
- **State management**: Reactive state updates
- **Plugin system**: Extensibility via plugins
- **TypeScript support**: Type definitions
- **Build system**: Minification and bundling

## Development Guidelines

### Adding New Components

1. Create a new class in `src/components/`
2. Implement constructor with options parameter
3. Implement `render()` method that returns DOM element
4. Add component styles to `src/styles/styles.js`
5. Export from main `index.js`
6. Add documentation to this file

### Component Template

```javascript
class NewComponent {
    constructor(title, options = {}) {
        this.title = title;
        this.options = {
            // Default options
            id: options.id || null,
            customOption: options.customOption || 'default',
            ...options
        };
    }

    render() {
        const section = document.createElement('section');
        section.className = 'wb-newcomponent';
        if (this.options.id) section.id = this.options.id;

        // Build DOM structure
        const container = document.createElement('div');
        container.className = 'wb-container';
        
        const title = document.createElement('h2');
        title.className = 'wb-section-title';
        title.textContent = this.title;
        container.appendChild(title);

        // Add more elements...

        section.appendChild(container);
        return section;
    }
}
```

### Style Guidelines

- Use BEM naming convention
- Keep specificity low
- Mobile-first responsive design
- Use CSS Grid and Flexbox
- Consistent spacing (rem units)
- Smooth transitions (0.3s)

## Known Limitations

- **No server-side rendering**: Client-side only
- **No routing**: Single page display
- **No state management**: Manual DOM updates
- **No build process**: No minification/bundling
- **Limited browser support**: Modern browsers only (ES6+)
- **No localStorage**: As per Claude artifacts restrictions

## Testing Considerations

When adding new features, test:
- Different content lengths
- Empty/missing options
- Mobile responsiveness
- Cross-browser compatibility
- Accessibility (keyboard navigation, screen readers)
- Performance with many components

## Examples

See `examples/demo.html` for a complete working example showing all components in use.

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS Safari 12+, Chrome Android latest

## License

This is a demo framework. Use freely for any purpose.