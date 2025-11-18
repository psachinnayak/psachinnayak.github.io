# CLAUDE.md - Project Guidelines for Claude Code

## Project Overview

This is a GitHub Pages site hosted at **https://samples.sachinnayak.info/** that showcases samples and demos built by Sachin Nayak. The primary feature is a Visual Sudoku Solver that teaches users how to solve Sudoku puzzles using step-by-step visual cues.

### Live URLs
- **Homepage**: https://samples.sachinnayak.info/
- **Sudoku Solver**: https://samples.sachinnayak.info/visual-sudoku-solver.html
- **Blog**: https://blog.sachinnayak.info

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6)
- **CSS Framework**: Bootstrap 4.3.1
- **Build Tool**: Babel (for minification)
- **Hosting**: GitHub Pages
- **Analytics**: Google Analytics (UA-46266367-5)

## Project Structure

```
psachinnayak.github.io/
├── index.html                    # Homepage
├── visual-sudoku-solver.html     # Main Sudoku solver application
├── CNAME                         # Custom domain configuration
├── package.json                  # Node.js dependencies
├── public/
│   ├── css/
│   │   ├── index.css             # Homepage styles
│   │   ├── visual-sudoku-solver.css  # Sudoku page styles
│   │   ├── bootstrap.min.css     # Bootstrap framework
│   │   ├── main.css              # Shared styles
│   │   └── default.css           # Default styles
│   ├── js/
│   │   ├── SudokuSolver.js       # Core solving algorithm
│   │   ├── SudokuBoard.js        # Board rendering logic
│   │   ├── visual-sudoku-solver.js   # UI interactions
│   │   ├── framework.js          # Utility functions
│   │   └── default.js            # Default behaviors
│   └── images/
│       ├── sachin-background.png # Custom background image
│       └── sudoku-resized.png    # Sample puzzle image
└── src/
    └── jsx/                      # Source JSX files (pre-build)
```

## Design System

### Color Palette

The site uses a **dark theme with cyan/electric blue accents**:

#### Primary Colors
- **Background**: Black gradient `#0a0a0a → #1a1a1a → #0f0f0f`
- **Accent**: Cyan/Electric Blue `#00d4ff`, `#0ea5e9`, `#00f2ff`
- **Text Primary**: White `#ffffff`
- **Text Secondary**: Light gray `#d1d5db`, `#e5e7eb`
- **Muted Text**: `#9ca3af`

#### Component Colors
- **Card Background**: `rgba(15, 15, 15, 0.95)`
- **Card Border**: `rgba(0, 212, 255, 0.3)`
- **Button Gradient**: `linear-gradient(135deg, #00d4ff 0%, #0ea5e9 100%)`
- **Hover Glow**: `rgba(0, 212, 255, 0.5)`

### Design Patterns

1. **Glassmorphism**: Cards and UI elements use backdrop blur and semi-transparent backgrounds
2. **Gradient Backgrounds**: Linear gradients for buttons and accents
3. **Hover Effects**: Transform (translateY, scale), glow shadows, color transitions
4. **Animations**: Pulse animations for Sudoku cell highlights

### Typography

- **Font Family**: System fonts (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto...`)
- **Headings**: Bold (700-800 weight), gradient text fill for titles
- **Body**: Regular weight (400), 0.95-1.1rem sizes

## Key Files

### HTML Pages

- **`index.html`**: Landing page with navigation and sample cards
- **`visual-sudoku-solver.html`**: Interactive Sudoku solver with presets, editor, and step-by-step solving

### CSS Files

- **`public/css/index.css`**: Homepage styling including:
  - Background image configuration
  - Navigation and footer styles
  - Sample card with hover effects
  - Responsive breakpoints

- **`public/css/visual-sudoku-solver.css`**: Sudoku page styling including:
  - Sudoku board cells and grid
  - Editor panel styling
  - Button variants (primary, success, warning, info, danger)
  - Flash animations (red, orange, blue)
  - Dropdown menus
  - Responsive design

### JavaScript Files

- **`public/js/SudokuSolver.js`**: Core algorithm for solving Sudoku puzzles
- **`public/js/SudokuBoard.js`**: Renders the Sudoku board and handles cell updates
- **`public/js/visual-sudoku-solver.js`**: UI logic, presets, and user interactions

## Development Guidelines

### CSS Conventions

1. **Use CSS custom properties** for repeated color values where appropriate
2. **Mobile-first approach**: Base styles for mobile, then media queries for larger screens
3. **Transitions**: Use `all 0.3s ease` for smooth animations
4. **Box shadows**: Layer multiple shadows for depth effect
5. **Z-index management**: Background elements at -1, modals at higher values

### Responsive Breakpoints

```css
/* Tablet */
@media (max-width: 768px) { }

/* Mobile */
@media (max-width: 480px) { }

/* Desktop */
@media (min-width: 48em) { }
```

### Adding New Samples

1. Create a new HTML file in the root directory
2. Create corresponding CSS in `public/css/`
3. Add JavaScript logic in `public/js/`
4. Add a card link on the homepage (`index.html`)
5. Include "Back to Home" navigation link
6. Maintain consistent dark theme with cyan accents

### Background Image Usage

Both pages use `sachin-background.png` with these settings:
- **Homepage**: `opacity: 0.35`
- **Sudoku page**: `opacity: 0.30`

To adjust visibility, modify the `opacity` value in the `body::before` pseudo-element.

## Build Process

```bash
# Install dependencies
npm install

# Build (minify JS and copy CSS)
npm run build
```

The build script uses Babel to minify JavaScript and copies CSS to the `build/` directory.

## Deployment

This site is automatically deployed via **GitHub Pages** when changes are pushed to the main branch. The custom domain `samples.sachinnayak.info` is configured in the `CNAME` file.

### Deployment Checklist

1. Test all pages locally
2. Verify responsive design on mobile/tablet
3. Check that all links work correctly
4. Ensure images are optimized for web
5. Commit and push to main branch
6. GitHub Pages will automatically deploy

## Common Tasks

### Changing the Background Image

1. Add your image to `public/images/`
2. Update the URL in both CSS files:
   - `public/css/index.css` (line ~42)
   - `public/css/visual-sudoku-solver.css` (line ~89)

### Adjusting Color Scheme

The primary accent color is cyan (`#00d4ff`). To change it:

1. Search and replace `#00d4ff` with your new color
2. Also update related shades: `#0ea5e9`, `#00f2ff`
3. Update rgba values: `rgba(0, 212, 255, ...)`

### Adding a New Preset to Sudoku

1. Open `public/js/visual-sudoku-solver.js`
2. Add a new preset array (9x9 grid, 0 for empty cells)
3. Add a dropdown item in `visual-sudoku-solver.html`

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Bootstrap 4.3.1 compatibility
- CSS Grid and Flexbox
- Backdrop-filter (glassmorphism) - graceful degradation in unsupported browsers

## External Resources

- **Bootstrap 4.3.1**: CSS framework (included locally)
- **jQuery 3.3.1**: Required for Bootstrap components
- **Popper.js 1.14.7**: Required for Bootstrap dropdowns

## Notes for Claude

### When Making Changes

1. **Maintain the dark theme**: Always use the black background with cyan accents
2. **Keep glassmorphism effects**: Use `backdrop-filter: blur()` for cards
3. **Preserve hover animations**: Include transform and glow effects
4. **Test responsiveness**: Check mobile breakpoints after CSS changes
5. **Update both CSS files**: Homepage and Sudoku page share similar styling patterns

### File Editing Priorities

- Prefer editing existing CSS over adding inline styles
- Keep JavaScript modular and well-commented
- Maintain consistent naming conventions
- Don't remove Google Analytics tracking

### Common Patterns

```css
/* Standard button hover */
.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 212, 255, 0.6);
}

/* Card glassmorphism */
.card {
    background: rgba(15, 15, 15, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 212, 255, 0.3);
    border-radius: 1rem;
}

/* Cyan accent link */
a {
    color: #00d4ff;
    transition: all 0.3s ease;
}
a:hover {
    color: #00f2ff;
    text-shadow: 0 0 10px rgba(0, 242, 255, 0.5);
}
```

## Contact

- **Author**: Sachin Nayak
- **Twitter**: [@psachinnayak](https://twitter.com/psachinnayak)
- **Blog**: https://blog.sachinnayak.info
