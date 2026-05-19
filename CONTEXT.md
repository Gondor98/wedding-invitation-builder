# Wedding Invitation Builder - Full Project Context

## Project Location
- **Local:** `~/wedding-invitation-builder/`
- **GitHub:** https://github.com/Gondor98/wedding-invitation-builder
- **Live URL:** https://gondor98.github.io/wedding-invitation-builder/
- **GitHub Account:** Gondor98

## Tech Stack
- Pure HTML/CSS/JS (no frameworks)
- GitHub Pages hosting via Actions workflow (`.github/workflows/deploy.yml`)
- Google Fonts: Playfair Display, Cormorant Garamond, Montserrat, Dancing Script
- Google Sheets integration via Apps Script for RSVP

## File Structure
- `index.html` — Main app shell with modals (add section, edit section, music, save/load, full preview)
- `styles.css` — All styling including theme variables, preview styles, editor UI, decorations (~38KB)
- `app.js` — Full application logic (~78KB): data model, rendering, editing, export, drag-drop, music, themes, save/load
- `google-apps-script.js` — Google Apps Script code for RSVP → Google Sheets integration
- `.github/workflows/deploy.yml` — Auto-deploy to GitHub Pages on push to main

## Features Implemented
1. **Section types:** Hero, Formal Invite, Love Story (timeline), Invitation Card (with Google Maps embed), RSVP (with QR code), Thank You, Gallery, Custom
2. **Section management:** Add, remove, reorder (drag-and-drop), edit via modals
3. **Image uploads:** Cover photo, timeline photos, gallery photos, QR code (all as base64 data URLs)
4. **Background music:** Upload audio file or external URL, loop/autoplay options, floating toggle button in export
5. **Two themes:** "Luxurious Blue" (deep navy + champagne gold) and "Spanish Garden" (bright garden greens + warm gold)
6. **Named draft save/load:** Multiple drafts stored in localStorage with name, date, theme info
7. **Export:** Downloads standalone HTML file with all styles, images, music, and functional RSVP form embedded
8. **Google Sheets RSVP:** Form submits to GuestConfirm tab via Apps Script webhook
9. **Vietnamese text:** RSVP form labels are in Vietnamese (all editable)
10. **Decorations:** Floral SVG corner ornaments, vine side borders, colored gradients, ornamental star dividers, gold accent borders
11. **Formal Invite section:** Guest name, groom/bride parents' names, family addresses, couple names with roles (from Vietnamese wedding format)
12. **Google Maps embed:** Each invitation card has a field for Google Maps iframe embed code

## Google Sheets Integration
- **Sheet:** https://docs.google.com/spreadsheets/d/1KFPGKPi2ebYJ58RWXNZchtrWyWPmlxbs1OepzGACsUo/edit
- **Webhook URL (hardcoded in app.js):** https://script.google.com/macros/s/AKfycbysXsUi5mQUAFRXlIf4IxLZsoE1hjmLrgG8GJ38hen803ClxSNYDmVrFaLij8KG9RKAcA/exec
- **Tab:** GuestConfirm
- **Columns:** Timestamp, Họ tên, Tham dự, Số người, Lời chúc
- **Setup:** Extensions > Apps Script > paste google-apps-script.js > Deploy as Web App (Anyone access)

## Theme Color Palettes

### Luxurious Blue
- Primary: `#1a3a6b`, Dark: `#0d1f3d`, Light: `#2d5a9e`
- Gold: `#b8965a`, Gold-light: `#dfc692`
- Bg-cream: `#f5f7fa`
- Hero gradient: midnight navy gradient
- Cards: Blue-tinted white `#f8fafd → #eef3f9`

### Spanish Garden
- Primary: `#4a7a52`, Dark: `#2e5a3a`, Light: `#6a9a6a`
- Gold: `#c49a4c`, Gold-light: `#e8cb82`
- Bg-cream: `#f8f9f4`
- Hero gradient: bright sage-to-green `#3a6b4a → #5a8a5a → #7aa868 → #5a8a4a` (NO brown)
- Cards: Fresh mint-white `#f8fbf6 → #eef5ea`
- RSVP dark: forest green `#2e5a3a`

## Key Design Decisions
- Reference format: https://prowedding.vn/thiepdientu/thiep-cuoi-dien-tu/mau-thiep-xanh-luxury/
- Preview is mobile-width (480px max) in right panel
- Editor panel is 360px left sidebar with draggable section cards
- All data stored as JSON array of section objects with `{id, type, data}` structure
- Images embedded as base64 in export (fully self-contained HTML)
- Music auto-plays on first user interaction (modern browser requirement)
- RSVP uses `mode: 'no-cors'` fetch to Google Apps Script
- Theme selection stored in localStorage and embedded in exported HTML via `data-theme` attribute

## Section Data Models

### Hero
```json
{ "subtitle": "", "name1": "", "name2": "", "date": "", "heroImage": "" }
```

### Formal Invite
```json
{
  "heading": "", "guestName": "", "message": "",
  "groomFamily": { "sideLabel": "", "fatherName": "", "motherName": "", "address": "" },
  "brideFamily": { "sideLabel": "", "fatherName": "", "motherName": "", "address": "" },
  "announcement": "", "groomFullName": "", "groomRole": "", "brideFullName": "", "brideRole": ""
}
```

### Love Story
```json
{ "label": "", "title": "", "entries": [{ "date": "", "title": "", "description": "", "image": "" }] }
```

### Invitation Card
```json
{
  "intro": "", "subtitle": "",
  "cards": [{ "label": "", "time": "", "date": "", "venueLabel": "", "venueName": "", "address": "", "note": "", "mapEmbed": "" }]
}
```

### RSVP
```json
{
  "title": "", "placeholderName": "", "placeholderAttend": "", "optionYes": "", "optionNo": "",
  "placeholderGuests": "", "placeholderMessage": "", "buttonText": "", "thankYouMessage": "",
  "qrImage": "", "qrLabel": "", "webhookUrl": ""
}
```

### Thank You
```json
{ "title": "", "message": "" }
```

### Gallery
```json
{ "title": "", "images": ["", "", "", ""] }
```

### Custom
```json
{ "title": "", "content": "" }
```

## Deployment
- Any push to `main` auto-deploys via GitHub Actions
- Workflow: checkout → configure-pages → upload-pages-artifact → deploy-pages
- Takes ~30-35 seconds to deploy

## Commit History Summary
1. Initial commit: base builder with all sections
2. GitHub Pages deployment workflow
3. Formal invite section + Google Maps embed
4. Theme selector (Luxurious Blue + Spanish Garden)
5. Section decorations + named draft save/load
6. Vietnamese RSVP + Google Sheets integration
7. Hardcoded webhook URL
8. Bold decorations (floral corners, vine borders, gradients, dividers)
9. Spanish Garden brightened (no brown, lush green)
