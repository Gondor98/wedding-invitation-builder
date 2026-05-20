# Wedding Invitation Builder - Full Project Context

## Project Location
- **Builder Local:** `~/wedding-invitation-builder/`
- **Builder GitHub:** https://github.com/Gondor98/wedding-invitation-builder
- **Builder Live URL:** https://gondor98.github.io/wedding-invitation-builder/
- **GitHub Account:** Gondor98

## Published Wedding Invitation Sites
| Site | GitHub Repo | Live URL | Local Folder |
|------|-------------|----------|--------------|
| Wedding 1 | https://github.com/Gondor98/wedding | https://gondor98.github.io/wedding/ | `~/wedding/` |
| Wedding 2 | https://github.com/Gondor98/wedding-2 | https://gondor98.github.io/wedding-2/ | `~/wedding-2/` |

### Publishing Workflow
1. In the builder, select target site from dropdown (Site 1 or Site 2)
2. Click **Publish** → downloads `index.html`
3. Run in terminal: `~/wedding/publish.sh ~/Downloads/index.html` (or `~/wedding-2/publish.sh`)
4. Live in ~30 seconds

## Tech Stack
- Pure HTML/CSS/JS (no frameworks)
- GitHub Pages hosting via Actions workflow (`.github/workflows/deploy.yml`)
- Google Fonts: Playfair Display, Cormorant Garamond, Montserrat, Dancing Script
- Google Sheets integration via Apps Script for RSVP
- Canvas-based image compression on upload

## File Structure
- `index.html` — Main app shell with modals (add section, edit section, music, save/load, full preview, guest links)
- `styles.css` — All styling including theme variables, preview styles, editor UI, decorations
- `app.js` — Full application logic: data model, rendering, editing, export, drag-drop, music, themes, save/load, image compression, publish, guest links
- `google-apps-script.js` — Google Apps Script code for RSVP → Google Sheets integration
- `.github/workflows/deploy.yml` — Auto-deploy to GitHub Pages on push to main

## Features Implemented
1. **Section types:** Hero, Formal Invite, Love Story (timeline), Invitation Card (with Google Maps embed), RSVP (with QR code), Thank You, Gallery, Custom
2. **Section management:** Add, remove, reorder (drag-and-drop), edit via modals
3. **Image uploads:** Cover photo, timeline photos, gallery photos, QR code (all as base64 data URLs, auto-compressed)
4. **Image compression:** Automatic on upload — max 1200×1200px, JPEG quality 0.75, target max 5 MB per image. Progressive quality reduction if needed.
5. **Background music:** Upload audio file or external URL, loop/autoplay options, floating toggle button in export. Mobile-compatible (touchend events, debounce, IIFE-wrapped).
6. **Four themes:** "Luxurious Blue", "Spanish Garden", "Eucalyptus", "Cherry Blossom"
7. **Named draft save/load:** Multiple drafts stored in localStorage with name, date, theme info. Music files >100KB excluded from drafts. Error handling for quota exceeded.
8. **Export:** Downloads standalone HTML file with all styles, images, music, and functional RSVP form embedded
9. **Publish:** Dedicated button + site selector to publish to GitHub Pages (wedding or wedding-2)
10. **Personalized guest names:** URL parameter `?guest=Name` replaces guest name in Formal Invite section and pre-fills RSVP name field
11. **Guest Link Generator:** Modal tool to batch-generate personalized invitation links for all guests
12. **Google Sheets RSVP:** Form submits to GuestConfirm tab via Apps Script webhook
13. **Vietnamese text:** RSVP form labels are in Vietnamese (all editable)
14. **Decorations:** Floral SVG corner ornaments, vine side borders, colored gradients, ornamental star dividers, gold accent borders
15. **Formal Invite section:** Guest name (personalizable via URL), groom/bride parents' names, family addresses, couple names with roles
16. **Google Maps embed:** Each invitation card has iframe embed code + clickable fallback link for mobile

## Personalized Guest Names (URL Parameters)
- **How it works:** Exported HTML reads `?guest=` from the URL and replaces the guest name
- **Example:** `https://gondor98.github.io/wedding/?guest=Gia+đình+bạn+Ngọc+Quyên`
- **Features:**
  - Replaces `.inv-formal-guest-name` text content
  - Pre-fills `#rsvp-name` input field
  - Uses `decodeURIComponent` for Vietnamese characters
- **Guest Link Generator (🔗 Links button):**
  - Enter names one per line
  - Select base URL (wedding or wedding-2)
  - Generates all personalized links
  - Copy all to clipboard

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

### Eucalyptus
- Primary: `#5a7a5e`, Dark: `#3a5a3e`, Light: `#7a9a7e`
- Gold (sage): `#6b8b6e`, Gold-light: `#8aaa8e`
- Bg-cream: `#f6f8f4`
- Hero: light cream background (NO gradient), botanical SVG leaves on sides
- Cards: semi-transparent white `rgba(255,255,255,0.7)`
- All sections: floating leaf pattern + eucalyptus branch side decorations
- RSVP dark: forest green `#3a5a3e`
- Names use Dancing Script (calligraphy style)

### Cherry Blossom
- Primary: `#c4748e`, Dark: `#8b4060`, Light: `#e8a0b8`
- Gold (pink): `#d4839b`, Gold-light: `#f0c0d4`
- Bg-cream: `#faf8fa`
- Hero: light lavender-white background (NO gradient), sakura flower SVGs in corners
- Cards: semi-transparent white `rgba(255,255,255,0.75)`
- All sections: scattered pink petal pattern + corner cherry blossom decorations
- RSVP dark: deep rose `#8b4060`
- Names use Dancing Script, large pink "and" watermark
- Romantic, soft sakura aesthetic

## Image Compression
- **Trigger:** Automatic on every image upload
- **Max dimensions:** 1200 × 1200 px (maintains aspect ratio)
- **Format:** Converted to JPEG
- **Quality:** 0.75 initial, progressively reduced to 0.3 if still over limit
- **Target max size:** 5 MB per image
- **Last resort:** Dimensions reduced to 60% if quality reduction insufficient
- **Loading state:** Shows "⏳ Compressing..." during processing
- **Console logging:** Reports original vs compressed size

## Music Player (Exported HTML)
- IIFE-wrapped, no global scope pollution
- `playsinline` attribute for iOS
- `audio.load()` before `play()` for mobile
- `touchend` events (not `touchstart`) for iOS compatibility
- 300ms debounce prevents double-fire on mobile
- Auto-play on first user interaction (click/touchend/scroll)
- Toggle button skipped by autoplay handler (prevents start-then-stop race)
- Proper Promise handling with `.catch()` for play failures
- Audio event listeners (ended, pause, play) keep UI in sync

## Key Design Decisions
- Reference format: https://prowedding.vn/thiepdientu/thiep-cuoi-dien-tu/mau-thiep-xanh-luxury/
- Preview is mobile-width (480px max) in right panel
- Editor panel is 360px left sidebar with draggable section cards
- All data stored as JSON array of section objects with `{id, type, data}` structure
- Images embedded as base64 in export (fully self-contained HTML, auto-compressed)
- Music auto-plays on first user interaction (modern browser requirement)
- RSVP uses `mode: 'no-cors'` fetch to Google Apps Script
- Theme selection stored in localStorage and embedded in exported HTML via `data-theme` attribute
- Guest names personalized via URL parameters (no need for multiple deployments)
- Google Maps fallback link provided for mobile/file:// protocol compatibility
- localStorage save: music files stripped if >100KB, try/catch for quota errors

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
- **GitHub file size limit: 100 MB** (image compression prevents exceeding this)

## Known Limitations & Workarounds
- **localStorage limit (~5-10 MB):** Music files stripped from drafts; error shown if images exceed quota
- **GitHub 100 MB file limit:** Image compressor keeps total manageable; avoid embedding raw high-res photos
- **Mobile autoplay policy:** Music requires user gesture; handled via first-interaction listeners
- **Google Maps in local files:** `file://` protocol blocks iframes; fallback link opens Maps directly
- **Base64 overhead:** ~37% larger than binary; compression compensates

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
10. Eucalyptus theme (botanical watercolor leaves)
11. Cherry Blossom theme (pink sakura flowers)
12. Fix RSVP Save button (missing DOM elements)
13. Fix music player for mobile (IIFE, touchend, debounce)
14. Google Maps fallback link for mobile
15. Publish button + site selector (wedding / wedding-2)
16. Fix Save Draft (localStorage quota handling)
17. Personalized guest names via URL parameters
18. Guest Link Generator tool
19. Automatic image compression on upload (max 5 MB/image)
