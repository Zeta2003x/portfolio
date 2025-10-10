# GitHub Copilot Instructions

## Project snapshot
- **Stack**: Static site built with hand-authored HTML, a single shared CSS stylesheet (`static/css/home.css`), and vanilla JavaScript (`static/js/app.js`). No build step or package manager is involved.
- **Entry points**: `index.html` (Spanish) and `index-en.html` (English) share the same structure and styling. Any structural change in one should usually be mirrored in the other unless the difference is language-specific.
- **Assets**: Images and documents live under `static/img` and `static/docs`. Reuse existing assets when possible and keep paths relative to project root.

## Working guidelines
- **Language parity**
  - Keep both HTML files in sync: navigation labels, section layouts, and component classes should remain consistent between languages.
  - When adding or renaming classes/IDs, update both pages and the CSS/JS selectors that reference them.

- **Styling conventions**
  - Use the variables defined in `:root` within `home.css` for colors, spacing, and typography. Preserve dark-mode compatibility by referencing CSS variables instead of hard-coded values.
  - Follow the card/grid patterns already in place (e.g., `.skill-card`, `.experience-card`, `.content-section`). Extend existing utility classes before introducing new ones.
  - Keep hover and focus states accessible. Maintain the color contrast already enforced in the stylesheet.

- **JavaScript practices**
  - Interactivity relies on vanilla JS without frameworks. Query DOM elements with class-based selectors already used in the markup (`.site-nav__list`, `#burger-menu`, etc.).
  - Ensure new interactions remain functional on both language pages (they share the same script file).
  - Maintain the theme persistence logic when changing language-switch behaviour or navigation icons.

- **Accessibility & responsiveness**
  - Preserve semantic HTML headings and section structure.
  - Ensure new content scales well across breakpoints (main responsive adjustments are defined via media queries in `home.css`).
  - Provide descriptive `alt` text for images and verify that focus states are visible.

## Testing & validation
- There are no automated tests or build tooling. Validate changes by opening the HTML files in a browser.
- When feasible, test both dark and light themes and check narrow viewports (<800px) to confirm responsive behaviour.

## Contribution tips
- Keep edits scoped and avoid unrelated formatting changes to minimize manual review effort.
- When adding assets, place them in the existing `static` subfolders and reference them with forward-slash paths.
- Document significant UI or behaviour changes directly in commit messages or by updating inline comments if helpful.
