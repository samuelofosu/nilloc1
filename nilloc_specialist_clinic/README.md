# Healthca landing page

A responsive HTML/CSS/JavaScript clinic landing page based on the supplied reference image.

## Files
- `index.html` — homepage content and section structure
- `about.html` — matching About page with mission, values, team and clickable partner logos
- `services.html` — responsive services page with head-doctor appointment prompt and laboratory service cards
- `styles.css` — theme, responsive layouts, animations and hover states
- `script.js` — mobile menu, current year, demo appointment form and reveal animations

## Preview
Open `index.html` in a browser. For local development, use VS Code with the Live Server extension.

## Easy edits
- Change brand text, headings, phone, email, opening hours and service names in `index.html` and `about.html`.
- In `services.html`, replace the head-doctor placeholder, contact details and service offerings with approved clinic information.
- In `about.html`, replace sample team names, staff photos, partner names, partner links and logo placeholders with approved real information.
- Change colors near the top of `styles.css` in the `:root` variables.
- Replace the Unsplash image URLs in `index.html` and `styles.css` with your own image paths.
- Adjust breakpoints in `styles.css` for your design requirements.

## Important before launch
- The appointment form is demo-only; it does not submit or store patient information. Connect it to a secure backend or booking provider before use.
- Replace all sample clinic details, metrics, contact information and image placeholders with verified clinic information.
- Use licensed images and configure hosting, HTTPS, accessibility checks and privacy notices for production.
- Google Fonts and the placeholder images require an internet connection.

Navigation consistency: Home, About Us, and Services now share the same header markup and homepage navbar styling. The active page indicator changes by page; all other navigation structure and styling remain consistent.

- `gallery.html` — responsive photo gallery, working pagination, wellness-center CTA, and shared site navigation/footer.

## Before publishing
- In `gallery.html`, replace `https://example.com/wellness-center` with the real Wellness Center destination URL.
- Replace demo image URLs and placeholder contact details with approved clinic assets and information.
- Gallery pagination is currently wired to the included nine demo gallery photos; add more gallery cards to create additional pages.

- Gallery arrows now change between three gallery pages; selecting any gallery photo opens a full-screen image viewer with previous/next controls, keyboard arrow navigation, Escape-to-close, and mobile-friendly controls.
