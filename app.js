// ===== DATA MODEL =====
const defaultSections = [
    {
        id: generateId(),
        type: 'hero',
        data: {
            subtitle: 'The Wedding Of',
            name1: 'Minh Anh',
            name2: 'Quoc Thai',
            date: '25.12.2025',
            heroImage: ''
        }
    },
    {
        id: generateId(),
        type: 'formal-invite',
        data: {
            heading: 'TRAN TRONG KINH MOI',
            guestName: 'Guest Name',
            message: 'Your presence will make our wedding day even more meaningful',
            groomFamily: {
                sideLabel: 'Groom\'s Family',
                fatherName: 'Mr. NGUYEN DUC HOAN',
                motherName: 'Mrs. PHAN THI BICH THUY',
                address: 'My Phuoc Apartment\nGia Dinh Ward, HCMC'
            },
            brideFamily: {
                sideLabel: 'Bride\'s Family',
                fatherName: 'Mr. NGUYEN MANH TUYEN',
                motherName: 'Mrs. TRINH PHUONG NGOC',
                address: 'An Binh Residential Area\nTran Bien Ward, Dong Nai'
            },
            announcement: 'We are honored to announce the wedding of our children',
            groomFullName: 'Nguyen Duc Thanh',
            groomRole: 'Eldest Son',
            brideFullName: 'Nguyen Trinh Phuong Mai',
            brideRole: 'Eldest Daughter'
        }
    },
    {
        id: generateId(),
        type: 'love-story',
        data: {
            label: 'Love Story',
            title: 'Our Story',
            entries: [
                { date: 'March 2018', title: 'First Meeting', description: 'A sunny afternoon, we met through a mutual friend. Among the noise, our eyes met briefly, but it was enough to make time stand still.', image: '' },
                { date: 'June 2018', title: 'First Messages', description: 'After that day, we started texting - just small talk at first, but enough to make our hearts flutter.', image: '' },
                { date: 'November 2019', title: 'The Confession', description: 'A sudden rain in late autumn, we took shelter under a small awning. No flowers, no gifts, just the sound of rain and our racing hearts.', image: '' }
            ]
        }
    },
    {
        id: generateId(),
        type: 'invitation',
        data: {
            intro: 'We cordially invite you',
            subtitle: 'Please join us in celebrating our union',
            cards: [
                { label: "GROOM'S FAMILY INVITATION", time: 'Ceremony at 10:30 AM', date: 'December 25, 2025', venueLabel: 'FAMILY RESIDENCE', venueName: 'Groom Family Home', address: '123 Main Street, District 1, Ho Chi Minh City', note: 'Your presence is our greatest honor', mapEmbed: '' },
                { label: "BRIDE'S FAMILY INVITATION", time: 'Reception at 7:30 PM', date: 'December 25, 2025', venueLabel: 'WEDDING RESTAURANT', venueName: 'White Place', address: '456 Wedding Avenue, District 7, Ho Chi Minh City', note: 'Your presence is our greatest honor', mapEmbed: '' }
            ]
        }
    },
    {
        id: generateId(),
        type: 'rsvp',
        data: {
            title: 'Xin vui lòng xác nhận sự tham gia để chúng tôi chuẩn bị chu đáo nhất cho bạn',
            placeholderName: 'Tên của bạn',
            placeholderAttend: 'Bạn có tham dự?',
            optionYes: 'Có, tôi sẽ tham dự',
            optionNo: 'Xin lỗi, tôi không thể tham dự',
            placeholderGuests: 'Số người tham dự',
            placeholderMessage: 'Gửi lời chúc...',
            buttonText: 'Gửi xác nhận',
            thankYouMessage: 'Cảm ơn bạn đã xác nhận!',
            qrImage: '',
            qrLabel: 'Quét mã để xác nhận tham dự',
            webhookUrl: 'https://script.google.com/macros/s/AKfycbysXsUi5mQUAFRXlIf4IxLZsoE1hjmLrgG8GJ38hen803ClxSNYDmVrFaLij8KG9RKAcA/exec'
        }
    },
    {
        id: generateId(),
        type: 'thank-you',
        data: {
            title: 'Thank You',
            message: 'We sincerely thank all family, friends and loved ones who have always supported, accompanied and blessed us on this special journey.\n\nYour love and presence mean the world to us.'
        }
    }
];

let sections = JSON.parse(JSON.stringify(defaultSections));
let editingSection = null;
let draggedItem = null;

// Music settings
let musicSettings = {
    enabled: false,
    source: '',
    sourceType: 'file',
    loop: true,
    autoplay: true,
    fileName: ''
};

// Theme settings
let currentTheme = 'luxurious-blue';

// ===== THEME FUNCTIONS =====
function changeTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    document.getElementById('preview-frame').setAttribute('data-theme', theme);
    // Save preference
    localStorage.setItem('wedding-invitation-theme', theme);
}

function loadTheme() {
    const saved = localStorage.getItem('wedding-invitation-theme');
    if (saved) {
        currentTheme = saved;
    }
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.getElementById('preview-frame').setAttribute('data-theme', currentTheme);
    document.getElementById('theme-select').value = currentTheme;
}

// ===== UTILITY FUNCTIONS =====
function generateId() {
    return 'sec_' + Math.random().toString(36).substr(2, 9);
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function getSectionTypeName(type) {
    const names = { 'hero': 'Hero / Cover', 'formal-invite': 'Formal Invite', 'love-story': 'Love Story', 'invitation': 'Invitation Card', 'rsvp': 'RSVP', 'thank-you': 'Thank You', 'gallery': 'Photo Gallery', 'custom': 'Custom Section' };
    return names[type] || type;
}

function getSectionIcon(type) {
    const icons = { 'hero': '\u{1F48D}', 'formal-invite': '\u{1F4DC}', 'love-story': '\u{1F495}', 'invitation': '\u{1F48C}', 'rsvp': '\u2705', 'thank-you': '\u{1F64F}', 'gallery': '\u{1F5BC}', 'custom': '\u270F' };
    return icons[type] || '\u25A2';
}

// ===== RENDER EDITOR PANEL =====
function renderEditorPanel() {
    const list = document.getElementById('sections-list');
    list.innerHTML = sections.map((section, index) => `
        <div class="section-card" data-id="${section.id}" draggable="true">
            <div class="section-card-header">
                <div class="section-card-title">
                    <span class="drag-handle">\u22EE\u22EE</span>
                    <span>${getSectionIcon(section.type)} ${getPreviewTitle(section)}</span>
                </div>
                <div class="section-card-actions">
                    <button class="btn-edit" onclick="editSection('${section.id}')" title="Edit">\u270E</button>
                    <button class="btn-delete" onclick="deleteSection('${section.id}')" title="Delete">\u{1F5D1}</button>
                </div>
            </div>
            <div class="section-card-type">${getSectionTypeName(section.type)}</div>
        </div>
    `).join('');
    setupDragAndDrop();
}

function getPreviewTitle(section) {
    switch(section.type) {
        case 'hero': return section.data.name1 + ' & ' + section.data.name2;
        case 'formal-invite': return section.data.guestName || 'Formal Invite';
        case 'love-story': return section.data.title || 'Love Story';
        case 'invitation': return 'Invitation Cards';
        case 'rsvp': return 'RSVP Form';
        case 'thank-you': return section.data.title || 'Thank You';
        case 'gallery': return 'Photo Gallery';
        case 'custom': return section.data.title || 'Custom Section';
        default: return 'Section';
    }
}

// ===== RENDER PREVIEW =====
function renderPreview(container) {
    const target = container || document.getElementById('preview-frame');
    target.innerHTML = sections.map(section => renderSectionPreview(section)).join('');
}

function renderSectionPreview(section) {
    switch(section.type) {
        case 'hero': return renderHeroPreview(section.data);
        case 'formal-invite': return renderFormalInvitePreview(section.data);
        case 'love-story': return renderLoveStoryPreview(section.data);
        case 'invitation': return renderInvitationPreview(section.data);
        case 'rsvp': return renderRSVPPreview(section.data);
        case 'thank-you': return renderThankYouPreview(section.data);
        case 'gallery': return renderGalleryPreview(section.data);
        case 'custom': return renderCustomPreview(section.data);
        default: return '';
    }
}

function renderHeroPreview(data) {
    const heroImg = data.heroImage ? `<img class="inv-hero-image" src="${data.heroImage}" alt="Couple">` : '';
    return `
        <section class="inv-section inv-hero">
            <div class="inv-hero-subtitle">${data.subtitle}</div>
            <div class="inv-hero-names">${data.name1}<span class="inv-hero-ampersand">&amp;</span>${data.name2}</div>
            <div class="inv-hero-date">${data.date}</div>
            ${heroImg}
        </section>`;
}

function renderFormalInvitePreview(data) {
    const groomAddr = (data.groomFamily.address || '').replace(/\n/g, '<br>');
    const brideAddr = (data.brideFamily.address || '').replace(/\n/g, '<br>');
    return `
        <section class="inv-section inv-formal-invite">
            <div class="inv-formal-heading">${data.heading}</div>
            <div class="inv-formal-guest-name">${data.guestName}</div>
            <div class="inv-formal-message">${data.message}</div>
            <div class="inv-formal-families">
                <div class="inv-formal-family-side">
                    <h4>${data.groomFamily.sideLabel}</h4>
                    <div class="parent-name">${data.groomFamily.fatherName}</div>
                    <div class="parent-name">${data.groomFamily.motherName}</div>
                    <div class="family-address">${groomAddr}</div>
                </div>
                <div class="inv-formal-family-side">
                    <h4>${data.brideFamily.sideLabel}</h4>
                    <div class="parent-name">${data.brideFamily.fatherName}</div>
                    <div class="parent-name">${data.brideFamily.motherName}</div>
                    <div class="family-address">${brideAddr}</div>
                </div>
            </div>
            <div class="inv-formal-divider"><span>\u2729 \u2729</span></div>
            <div class="inv-formal-announce">${data.announcement}</div>
            <div class="inv-formal-couple-name">${data.groomFullName}</div>
            <div class="inv-formal-role">${data.groomRole}</div>
            <div class="inv-formal-heart">\u2764</div>
            <div class="inv-formal-role">${data.brideRole}</div>
            <div class="inv-formal-couple-name">${data.brideFullName}</div>
        </section>`;
}

function renderLoveStoryPreview(data) {
    const entries = (data.entries || []).map(entry => {
        const img = entry.image ? `<img class="inv-timeline-image" src="${entry.image}" alt="${entry.title}">` : '';
        return `<div class="inv-timeline-item"><div class="inv-timeline-date">${entry.date}</div><div class="inv-timeline-title">${entry.title}</div><div class="inv-timeline-desc">${entry.description}</div>${img}</div>`;
    }).join('');
    return `<section class="inv-section inv-love-story"><div class="inv-section-label">${data.label}</div><div class="inv-section-title">${data.title}</div><div class="inv-timeline">${entries}</div></section>`;
}

function renderInvitationPreview(data) {
    const cards = (data.cards || []).map(card => {
        let mapHtml = '';
        if (card.mapEmbed && card.mapEmbed.trim()) {
            // Extract the src URL from iframe for fallback link
            let mapSrc = '';
            const srcMatch = card.mapEmbed.match(/src=["']([^"']+)["']/);
            if (srcMatch) mapSrc = srcMatch[1];
            const fallbackLink = mapSrc ? `<a href="${mapSrc}" target="_blank" rel="noopener" class="inv-card-map-link">\u{1F4CD} Open in Google Maps</a>` : '';
            mapHtml = `<div class="inv-card-map">${card.mapEmbed}${fallbackLink}</div>`;
        } else {
            mapHtml = `<div class="inv-card-map"><div class="inv-card-map-placeholder">\u{1F4CD} Google Map will appear here</div></div>`;
        }
        return `
        <div class="inv-card">
            <div class="inv-card-label">${card.label}</div>
            <div class="inv-card-time">${card.time}</div>
            <div class="inv-card-date">${card.date}</div>
            <div class="inv-card-venue">${card.venueLabel}</div>
            <div class="inv-card-venue-name">${card.venueName}</div>
            <div class="inv-card-address">${card.address}</div>
            <div class="inv-card-note"><em>${card.note}</em></div>
            ${mapHtml}
        </div>`;
    }).join('');
    return `<section class="inv-section inv-invitation"><div class="inv-invitation-intro">${data.intro}</div><div class="inv-invitation-subtitle">${data.subtitle}</div>${cards}</section>`;
}

function renderRSVPPreview(data) {
    const qrContent = data.qrImage
        ? `<img src="${data.qrImage}" alt="QR Code">`
        : `<div class="inv-rsvp-qr-placeholder">QR Code<br>will appear here</div>`;
    const pName = data.placeholderName || 'Tên của bạn';
    const pAttend = data.placeholderAttend || 'Bạn có tham dự?';
    const oYes = data.optionYes || 'Có, tôi sẽ tham dự';
    const oNo = data.optionNo || 'Xin lỗi, tôi không thể tham dự';
    const pGuests = data.placeholderGuests || 'Số người tham dự';
    const pMsg = data.placeholderMessage || 'Gửi lời chúc...';
    return `
        <section class="inv-section inv-rsvp">
            <div class="inv-section-title">${data.title}</div>
            <div class="inv-rsvp-form">
                <div class="inv-rsvp-field"><input type="text" placeholder="${pName}" disabled></div>
                <div class="inv-rsvp-field"><select disabled><option>${pAttend}</option><option>${oYes}</option><option>${oNo}</option></select></div>
                <div class="inv-rsvp-field"><input type="number" placeholder="${pGuests}" disabled></div>
                <div class="inv-rsvp-field"><textarea placeholder="${pMsg}" rows="3" disabled></textarea></div>
                <button class="inv-rsvp-btn" disabled>${data.buttonText}</button>
            </div>
            <div class="inv-rsvp-qr">
                <div class="inv-rsvp-qr-label">${data.qrLabel}</div>
                <div class="inv-rsvp-qr-image">${qrContent}</div>
            </div>
        </section>`;
}

function renderThankYouPreview(data) {
    const message = data.message.replace(/\n/g, '<br>');
    return `<section class="inv-section inv-thank-you"><div class="inv-section-label">\u2764</div><div class="inv-section-title">${data.title}</div><div class="inv-thank-you-message">${message}</div></section>`;
}

function renderGalleryPreview(data) {
    const images = (data.images || []).map(img => {
        if (img) return `<div class="inv-gallery-item"><img src="${img}" alt="Gallery"></div>`;
        return `<div class="inv-gallery-item"><div class="inv-gallery-placeholder">+ Photo</div></div>`;
    });
    while (images.length < 4) images.push(`<div class="inv-gallery-item"><div class="inv-gallery-placeholder">+ Photo</div></div>`);
    return `<section class="inv-section inv-gallery"><div class="inv-section-label">Gallery</div><div class="inv-section-title">${data.title || 'Our Moments'}</div><div class="inv-gallery-grid">${images.join('')}</div></section>`;
}

function renderCustomPreview(data) {
    const content = (data.content || '').replace(/\n/g, '<br>');
    return `<section class="inv-section inv-custom">${data.title ? `<div class="inv-section-title">${data.title}</div>` : ''}<div class="inv-custom-content">${content}</div></section>`;
}


// ===== SECTION EDITING =====
function editSection(sectionId) {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    editingSection = section;
    document.getElementById('edit-modal-title').textContent = 'Edit: ' + getSectionTypeName(section.type);
    document.getElementById('edit-modal-body').innerHTML = getEditForm(section);
    openModal('modal-edit-section');
}

function getEditForm(section) {
    switch(section.type) {
        case 'hero': return getHeroEditForm(section.data);
        case 'formal-invite': return getFormalInviteEditForm(section.data);
        case 'love-story': return getLoveStoryEditForm(section.data);
        case 'invitation': return getInvitationEditForm(section.data);
        case 'rsvp': return getRSVPEditForm(section.data);
        case 'thank-you': return getThankYouEditForm(section.data);
        case 'gallery': return getGalleryEditForm(section.data);
        case 'custom': return getCustomEditForm(section.data);
        default: return '<p>Unknown section type</p>';
    }
}

function getHeroEditForm(data) {
    return `
        <div class="form-group"><label>Subtitle</label><input type="text" id="edit-hero-subtitle" value="${escapeAttr(data.subtitle)}"></div>
        <div class="form-row">
            <div class="form-group"><label>Name 1 (Bride)</label><input type="text" id="edit-hero-name1" value="${escapeAttr(data.name1)}"></div>
            <div class="form-group"><label>Name 2 (Groom)</label><input type="text" id="edit-hero-name2" value="${escapeAttr(data.name2)}"></div>
        </div>
        <div class="form-group"><label>Wedding Date</label><input type="text" id="edit-hero-date" value="${escapeAttr(data.date)}" placeholder="e.g., 25.12.2025"></div>
        <div class="form-group"><label>Cover Photo (Optional)</label>
            <div class="image-upload-area" id="hero-image-upload">
                ${data.heroImage ? `<img src="${data.heroImage}" alt="Cover">` : `<div class="upload-icon">\u{1F4F7}</div><div class="upload-text">Click or drag to upload cover photo</div>`}
                <input type="file" accept="image/*" onchange="handleImageUpload(event, 'hero-image-upload', 'edit-hero-image')">
            </div>
            <input type="hidden" id="edit-hero-image" value="${escapeAttr(data.heroImage || '')}">
        </div>`;
}

function getFormalInviteEditForm(data) {
    return `
        <div class="form-group"><label>Heading</label><input type="text" id="edit-fi-heading" value="${escapeAttr(data.heading)}"></div>
        <div class="form-group"><label>Guest Name</label><input type="text" id="edit-fi-guest" value="${escapeAttr(data.guestName)}" placeholder="e.g., Gia dinh ban Ngoc Quyen"></div>
        <div class="form-group"><label>Message</label><textarea id="edit-fi-message" rows="2">${escapeHtml(data.message)}</textarea></div>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid var(--border);">
        <h4 style="font-size:0.85rem; color:var(--primary); margin-bottom:12px;">GROOM'S FAMILY</h4>
        <div class="form-group"><label>Side Label</label><input type="text" id="edit-fi-groom-label" value="${escapeAttr(data.groomFamily.sideLabel)}"></div>
        <div class="form-group"><label>Father's Name</label><input type="text" id="edit-fi-groom-father" value="${escapeAttr(data.groomFamily.fatherName)}"></div>
        <div class="form-group"><label>Mother's Name</label><input type="text" id="edit-fi-groom-mother" value="${escapeAttr(data.groomFamily.motherName)}"></div>
        <div class="form-group"><label>Address</label><textarea id="edit-fi-groom-addr" rows="2">${escapeHtml(data.groomFamily.address)}</textarea></div>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid var(--border);">
        <h4 style="font-size:0.85rem; color:var(--primary); margin-bottom:12px;">BRIDE'S FAMILY</h4>
        <div class="form-group"><label>Side Label</label><input type="text" id="edit-fi-bride-label" value="${escapeAttr(data.brideFamily.sideLabel)}"></div>
        <div class="form-group"><label>Father's Name</label><input type="text" id="edit-fi-bride-father" value="${escapeAttr(data.brideFamily.fatherName)}"></div>
        <div class="form-group"><label>Mother's Name</label><input type="text" id="edit-fi-bride-mother" value="${escapeAttr(data.brideFamily.motherName)}"></div>
        <div class="form-group"><label>Address</label><textarea id="edit-fi-bride-addr" rows="2">${escapeHtml(data.brideFamily.address)}</textarea></div>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid var(--border);">
        <h4 style="font-size:0.85rem; color:var(--primary); margin-bottom:12px;">COUPLE</h4>
        <div class="form-group"><label>Announcement Text</label><input type="text" id="edit-fi-announce" value="${escapeAttr(data.announcement)}"></div>
        <div class="form-row">
            <div class="form-group"><label>Groom Full Name</label><input type="text" id="edit-fi-groom-name" value="${escapeAttr(data.groomFullName)}"></div>
            <div class="form-group"><label>Groom Role</label><input type="text" id="edit-fi-groom-role" value="${escapeAttr(data.groomRole)}" placeholder="e.g., Eldest Son"></div>
        </div>
        <div class="form-row">
            <div class="form-group"><label>Bride Full Name</label><input type="text" id="edit-fi-bride-name" value="${escapeAttr(data.brideFullName)}"></div>
            <div class="form-group"><label>Bride Role</label><input type="text" id="edit-fi-bride-role" value="${escapeAttr(data.brideRole)}" placeholder="e.g., Eldest Daughter"></div>
        </div>`;
}

function getLoveStoryEditForm(data) {
    const entriesHtml = (data.entries || []).map((entry, i) => `
        <div class="timeline-entry" data-index="${i}">
            <div class="timeline-entry-header"><strong>Entry ${i + 1}</strong><button class="btn-remove-entry" onclick="removeTimelineEntry(${i})">&#10005; Remove</button></div>
            <div class="form-group"><label>Date</label><input type="text" class="entry-date" value="${escapeAttr(entry.date)}" placeholder="e.g., March 2018"></div>
            <div class="form-group"><label>Title</label><input type="text" class="entry-title" value="${escapeAttr(entry.title)}"></div>
            <div class="form-group"><label>Description</label><textarea class="entry-desc" rows="3">${escapeHtml(entry.description)}</textarea></div>
            <div class="form-group"><label>Photo</label>
                <div class="image-upload-area" id="entry-image-upload-${i}">
                    ${entry.image ? `<img src="${entry.image}" alt="Photo">` : `<div class="upload-icon">\u{1F4F7}</div><div class="upload-text">Upload photo</div>`}
                    <input type="file" accept="image/*" onchange="handleImageUpload(event, 'entry-image-upload-${i}', 'entry-image-${i}')">
                </div>
                <input type="hidden" class="entry-image" id="entry-image-${i}" value="${escapeAttr(entry.image || '')}">
            </div>
        </div>`).join('');
    return `
        <div class="form-group"><label>Section Label</label><input type="text" id="edit-story-label" value="${escapeAttr(data.label)}"></div>
        <div class="form-group"><label>Section Title</label><input type="text" id="edit-story-title" value="${escapeAttr(data.title)}"></div>
        <div class="form-group"><label>Timeline Entries</label><div class="timeline-entries" id="timeline-entries">${entriesHtml}</div><button class="btn-add-entry" onclick="addTimelineEntry()">+ Add Timeline Entry</button></div>`;
}

function getInvitationEditForm(data) {
    const cardsHtml = (data.cards || []).map((card, i) => `
        <div class="timeline-entry" data-index="${i}">
            <div class="timeline-entry-header"><strong>Card ${i + 1}</strong><button class="btn-remove-entry" onclick="removeInvitationCard(${i})">&#10005; Remove</button></div>
            <div class="form-group"><label>Card Label</label><input type="text" class="card-label" value="${escapeAttr(card.label)}"></div>
            <div class="form-row">
                <div class="form-group"><label>Time</label><input type="text" class="card-time" value="${escapeAttr(card.time)}"></div>
                <div class="form-group"><label>Date</label><input type="text" class="card-date" value="${escapeAttr(card.date)}"></div>
            </div>
            <div class="form-group"><label>Venue Label</label><input type="text" class="card-venue-label" value="${escapeAttr(card.venueLabel)}"></div>
            <div class="form-group"><label>Venue Name</label><input type="text" class="card-venue-name" value="${escapeAttr(card.venueName)}"></div>
            <div class="form-group"><label>Address</label><input type="text" class="card-address" value="${escapeAttr(card.address)}"></div>
            <div class="form-group"><label>Note</label><input type="text" class="card-note" value="${escapeAttr(card.note)}"></div>
            <div class="form-group"><label>Google Maps Embed Code</label>
                <textarea class="card-map-embed" rows="3" placeholder="Paste Google Maps embed iframe code here...">${escapeHtml(card.mapEmbed || '')}</textarea>
                <small style="color:var(--text-muted); display:block; margin-top:4px;">Go to Google Maps &rarr; Share &rarr; Embed a map &rarr; Copy the &lt;iframe&gt; code</small>
            </div>
        </div>`).join('');
    return `
        <div class="form-group"><label>Intro Text</label><input type="text" id="edit-inv-intro" value="${escapeAttr(data.intro)}"></div>
        <div class="form-group"><label>Subtitle</label><input type="text" id="edit-inv-subtitle" value="${escapeAttr(data.subtitle)}"></div>
        <div class="form-group"><label>Invitation Cards</label><div class="timeline-entries" id="invitation-cards">${cardsHtml}</div><button class="btn-add-entry" onclick="addInvitationCard()">+ Add Invitation Card</button></div>`;
}

function getRSVPEditForm(data) {
    return `
        <div class="form-group"><label>Section Title</label><textarea id="edit-rsvp-title" rows="2">${escapeHtml(data.title)}</textarea></div>
        <div class="form-group"><label>Button Text</label><input type="text" id="edit-rsvp-btn" value="${escapeAttr(data.buttonText)}"></div>
        <div class="form-group"><label>QR Code Label</label><input type="text" id="edit-rsvp-qr-label" value="${escapeAttr(data.qrLabel)}"></div>
        <div class="form-group"><label>QR Code Image</label>
            <div class="image-upload-area" id="rsvp-qr-upload">
                ${data.qrImage ? `<img src="${data.qrImage}" alt="QR Code">` : `<div class="upload-icon">\u25A2</div><div class="upload-text">Upload QR Code image</div>`}
                <input type="file" accept="image/*" onchange="handleImageUpload(event, 'rsvp-qr-upload', 'edit-rsvp-qr-image')">
            </div>
            <input type="hidden" id="edit-rsvp-qr-image" value="${escapeAttr(data.qrImage || '')}">
            <small style="color: var(--text-muted); margin-top: 4px; display: block;">Upload your QR code for guests to scan and confirm attendance or send gifts.</small>
        </div>`;
}

function getThankYouEditForm(data) {
    return `
        <div class="form-group"><label>Title</label><input type="text" id="edit-thanks-title" value="${escapeAttr(data.title)}"></div>
        <div class="form-group"><label>Message</label><textarea id="edit-thanks-message" rows="6">${escapeHtml(data.message)}</textarea></div>`;
}

function getGalleryEditForm(data) {
    const images = data.images || ['', '', '', ''];
    const imagesHtml = images.map((img, i) => `
        <div class="form-group"><label>Photo ${i + 1}</label>
            <div class="image-upload-area" id="gallery-image-upload-${i}">
                ${img ? `<img src="${img}" alt="Gallery ${i + 1}">` : `<div class="upload-icon">\u{1F4F7}</div><div class="upload-text">Upload photo</div>`}
                <input type="file" accept="image/*" onchange="handleImageUpload(event, 'gallery-image-upload-${i}', 'gallery-image-${i}')">
            </div>
            <input type="hidden" class="gallery-image" id="gallery-image-${i}" value="${escapeAttr(img || '')}">
        </div>`).join('');
    return `<div class="form-group"><label>Gallery Title</label><input type="text" id="edit-gallery-title" value="${escapeAttr(data.title || 'Our Moments')}"></div>${imagesHtml}<button class="btn-add-entry" onclick="addGallerySlot()">+ Add Photo Slot</button>`;
}

function getCustomEditForm(data) {
    return `
        <div class="form-group"><label>Title (Optional)</label><input type="text" id="edit-custom-title" value="${escapeAttr(data.title || '')}"></div>
        <div class="form-group"><label>Content</label><textarea id="edit-custom-content" rows="8">${escapeHtml(data.content || '')}</textarea></div>`;
}


// ===== SAVE SECTION EDITS =====
function saveCurrentSection() {
    if (!editingSection) return;
    switch(editingSection.type) {
        case 'hero':
            editingSection.data.subtitle = document.getElementById('edit-hero-subtitle').value;
            editingSection.data.name1 = document.getElementById('edit-hero-name1').value;
            editingSection.data.name2 = document.getElementById('edit-hero-name2').value;
            editingSection.data.date = document.getElementById('edit-hero-date').value;
            editingSection.data.heroImage = document.getElementById('edit-hero-image').value;
            break;
        case 'formal-invite':
            editingSection.data.heading = document.getElementById('edit-fi-heading').value;
            editingSection.data.guestName = document.getElementById('edit-fi-guest').value;
            editingSection.data.message = document.getElementById('edit-fi-message').value;
            editingSection.data.groomFamily.sideLabel = document.getElementById('edit-fi-groom-label').value;
            editingSection.data.groomFamily.fatherName = document.getElementById('edit-fi-groom-father').value;
            editingSection.data.groomFamily.motherName = document.getElementById('edit-fi-groom-mother').value;
            editingSection.data.groomFamily.address = document.getElementById('edit-fi-groom-addr').value;
            editingSection.data.brideFamily.sideLabel = document.getElementById('edit-fi-bride-label').value;
            editingSection.data.brideFamily.fatherName = document.getElementById('edit-fi-bride-father').value;
            editingSection.data.brideFamily.motherName = document.getElementById('edit-fi-bride-mother').value;
            editingSection.data.brideFamily.address = document.getElementById('edit-fi-bride-addr').value;
            editingSection.data.announcement = document.getElementById('edit-fi-announce').value;
            editingSection.data.groomFullName = document.getElementById('edit-fi-groom-name').value;
            editingSection.data.groomRole = document.getElementById('edit-fi-groom-role').value;
            editingSection.data.brideFullName = document.getElementById('edit-fi-bride-name').value;
            editingSection.data.brideRole = document.getElementById('edit-fi-bride-role').value;
            break;
        case 'love-story':
            editingSection.data.label = document.getElementById('edit-story-label').value;
            editingSection.data.title = document.getElementById('edit-story-title').value;
            editingSection.data.entries = collectTimelineEntries();
            break;
        case 'invitation':
            editingSection.data.intro = document.getElementById('edit-inv-intro').value;
            editingSection.data.subtitle = document.getElementById('edit-inv-subtitle').value;
            editingSection.data.cards = collectInvitationCards();
            break;
        case 'rsvp':
            editingSection.data.title = document.getElementById('edit-rsvp-title').value;
            editingSection.data.buttonText = document.getElementById('edit-rsvp-btn').value;
            editingSection.data.qrLabel = document.getElementById('edit-rsvp-qr-label').value;
            editingSection.data.qrImage = document.getElementById('edit-rsvp-qr-image').value;
            // Only update optional fields if their elements exist in the form
            var el;
            if ((el = document.getElementById('edit-rsvp-pname'))) editingSection.data.placeholderName = el.value;
            if ((el = document.getElementById('edit-rsvp-pattend'))) editingSection.data.placeholderAttend = el.value;
            if ((el = document.getElementById('edit-rsvp-oyes'))) editingSection.data.optionYes = el.value;
            if ((el = document.getElementById('edit-rsvp-ono'))) editingSection.data.optionNo = el.value;
            if ((el = document.getElementById('edit-rsvp-pguests'))) editingSection.data.placeholderGuests = el.value;
            if ((el = document.getElementById('edit-rsvp-pmsg'))) editingSection.data.placeholderMessage = el.value;
            if ((el = document.getElementById('edit-rsvp-thanks'))) editingSection.data.thankYouMessage = el.value;
            if ((el = document.getElementById('edit-rsvp-webhook'))) editingSection.data.webhookUrl = el.value;
            break;
        case 'thank-you':
            editingSection.data.title = document.getElementById('edit-thanks-title').value;
            editingSection.data.message = document.getElementById('edit-thanks-message').value;
            break;
        case 'gallery':
            editingSection.data.title = document.getElementById('edit-gallery-title').value;
            editingSection.data.images = collectGalleryImages();
            break;
        case 'custom':
            editingSection.data.title = document.getElementById('edit-custom-title').value;
            editingSection.data.content = document.getElementById('edit-custom-content').value;
            break;
    }
    closeModal('modal-edit-section');
    renderAll();
}

function collectTimelineEntries() {
    const entries = [];
    document.querySelectorAll('#timeline-entries .timeline-entry').forEach((el) => {
        entries.push({ date: el.querySelector('.entry-date').value, title: el.querySelector('.entry-title').value, description: el.querySelector('.entry-desc').value, image: el.querySelector('.entry-image').value });
    });
    return entries;
}

function collectInvitationCards() {
    const cards = [];
    document.querySelectorAll('#invitation-cards .timeline-entry').forEach(el => {
        cards.push({ label: el.querySelector('.card-label').value, time: el.querySelector('.card-time').value, date: el.querySelector('.card-date').value, venueLabel: el.querySelector('.card-venue-label').value, venueName: el.querySelector('.card-venue-name').value, address: el.querySelector('.card-address').value, note: el.querySelector('.card-note').value, mapEmbed: el.querySelector('.card-map-embed').value });
    });
    return cards;
}

function collectGalleryImages() {
    const images = [];
    document.querySelectorAll('.gallery-image').forEach(el => images.push(el.value));
    return images;
}

// ===== ADD/REMOVE HELPERS =====
function addTimelineEntry() {
    const container = document.getElementById('timeline-entries');
    const i = container.querySelectorAll('.timeline-entry').length;
    container.insertAdjacentHTML('beforeend', `
        <div class="timeline-entry" data-index="${i}">
            <div class="timeline-entry-header"><strong>Entry ${i + 1}</strong><button class="btn-remove-entry" onclick="removeTimelineEntry(${i})">&#10005; Remove</button></div>
            <div class="form-group"><label>Date</label><input type="text" class="entry-date" value="" placeholder="e.g., March 2018"></div>
            <div class="form-group"><label>Title</label><input type="text" class="entry-title" value=""></div>
            <div class="form-group"><label>Description</label><textarea class="entry-desc" rows="3"></textarea></div>
            <div class="form-group"><label>Photo</label>
                <div class="image-upload-area" id="entry-image-upload-${i}"><div class="upload-icon">\u{1F4F7}</div><div class="upload-text">Upload photo</div><input type="file" accept="image/*" onchange="handleImageUpload(event, 'entry-image-upload-${i}', 'entry-image-${i}')"></div>
                <input type="hidden" class="entry-image" id="entry-image-${i}" value="">
            </div>
        </div>`);
}

function removeTimelineEntry(index) {
    const entries = document.querySelectorAll('#timeline-entries .timeline-entry');
    if (entries[index]) entries[index].remove();
}

function addInvitationCard() {
    const container = document.getElementById('invitation-cards');
    const i = container.querySelectorAll('.timeline-entry').length;
    container.insertAdjacentHTML('beforeend', `
        <div class="timeline-entry" data-index="${i}">
            <div class="timeline-entry-header"><strong>Card ${i + 1}</strong><button class="btn-remove-entry" onclick="removeInvitationCard(${i})">&#10005; Remove</button></div>
            <div class="form-group"><label>Card Label</label><input type="text" class="card-label" value=""></div>
            <div class="form-row"><div class="form-group"><label>Time</label><input type="text" class="card-time" value=""></div><div class="form-group"><label>Date</label><input type="text" class="card-date" value=""></div></div>
            <div class="form-group"><label>Venue Label</label><input type="text" class="card-venue-label" value=""></div>
            <div class="form-group"><label>Venue Name</label><input type="text" class="card-venue-name" value=""></div>
            <div class="form-group"><label>Address</label><input type="text" class="card-address" value=""></div>
            <div class="form-group"><label>Note</label><input type="text" class="card-note" value=""></div>
            <div class="form-group"><label>Google Maps Embed Code</label>
                <textarea class="card-map-embed" rows="3" placeholder="Paste Google Maps embed iframe code here..."></textarea>
                <small style="color:var(--text-muted); display:block; margin-top:4px;">Go to Google Maps &rarr; Share &rarr; Embed a map &rarr; Copy the &lt;iframe&gt; code</small>
            </div>
        </div>`);
}

function removeInvitationCard(index) {
    const entries = document.querySelectorAll('#invitation-cards .timeline-entry');
    if (entries[index]) entries[index].remove();
}

function addGallerySlot() {
    const body = document.getElementById('edit-modal-body');
    const i = body.querySelectorAll('.gallery-image').length;
    const addBtn = body.querySelector('.btn-add-entry');
    addBtn.insertAdjacentHTML('beforebegin', `
        <div class="form-group"><label>Photo ${i + 1}</label>
            <div class="image-upload-area" id="gallery-image-upload-${i}"><div class="upload-icon">\u{1F4F7}</div><div class="upload-text">Upload photo</div><input type="file" accept="image/*" onchange="handleImageUpload(event, 'gallery-image-upload-${i}', 'gallery-image-${i}')"></div>
            <input type="hidden" class="gallery-image" id="gallery-image-${i}" value="">
        </div>`);
}

// ===== IMAGE HANDLING =====
// Image compression settings
const IMAGE_MAX_WIDTH = 1200;   // Max width in pixels
const IMAGE_MAX_HEIGHT = 1200;  // Max height in pixels
const IMAGE_QUALITY = 0.75;     // JPEG quality (0.0 - 1.0)
const IMAGE_MAX_SIZE_KB = 5120;  // Target max size per image in KB (5 MB)

function compressImage(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // Calculate new dimensions (maintain aspect ratio)
            let width = img.width;
            let height = img.height;
            
            if (width > IMAGE_MAX_WIDTH || height > IMAGE_MAX_HEIGHT) {
                const ratio = Math.min(IMAGE_MAX_WIDTH / width, IMAGE_MAX_HEIGHT / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }
            
            // Draw to canvas with new dimensions
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Try progressively lower quality until under size limit
            let quality = IMAGE_QUALITY;
            let dataUrl = canvas.toDataURL('image/jpeg', quality);
            
            // If still too large, reduce quality further
            while (dataUrl.length > IMAGE_MAX_SIZE_KB * 1024 * 1.37 && quality > 0.3) {
                quality -= 0.1;
                dataUrl = canvas.toDataURL('image/jpeg', quality);
            }
            
            // If STILL too large, reduce dimensions further
            if (dataUrl.length > IMAGE_MAX_SIZE_KB * 1024 * 1.37) {
                const scale = 0.6;
                canvas.width = Math.round(width * scale);
                canvas.height = Math.round(height * scale);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                dataUrl = canvas.toDataURL('image/jpeg', 0.6);
            }
            
            const originalKB = Math.round(file.size / 1024);
            const compressedKB = Math.round(dataUrl.length * 0.73 / 1024); // base64 overhead ~37%
            console.log(`Image compressed: ${originalKB}KB → ${compressedKB}KB (${width}x${height}, q=${quality.toFixed(1)})`);
            
            callback(dataUrl);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function handleImageUpload(event, uploadAreaId, hiddenInputId) {
    const file = event.target.files[0];
    if (!file) return;
    
    const uploadArea = document.getElementById(uploadAreaId);
    const fileInput = uploadArea.querySelector('input[type="file"]');
    
    // Show loading state
    uploadArea.innerHTML = '<div class="upload-icon">⏳</div><div class="upload-text">Compressing...</div>';
    uploadArea.appendChild(fileInput);
    
    compressImage(file, function(dataUrl) {
        document.getElementById(hiddenInputId).value = dataUrl;
        uploadArea.innerHTML = '';
        const img = document.createElement('img');
        img.src = dataUrl;
        img.alt = 'Uploaded';
        uploadArea.appendChild(img);
        uploadArea.appendChild(fileInput);
    });
}

// ===== MUSIC FUNCTIONS =====
function toggleMusicSource() {
    const sourceType = document.getElementById('music-source-type').value;
    document.getElementById('music-file-group').style.display = sourceType === 'file' ? 'block' : 'none';
    document.getElementById('music-url-group').style.display = sourceType === 'url' ? 'block' : 'none';
}

function handleMusicUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        musicSettings.source = e.target.result;
        musicSettings.fileName = file.name;
        document.getElementById('music-upload-text').textContent = file.name;
        document.getElementById('music-preview-group').style.display = 'block';
        document.getElementById('music-preview').src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function openMusicModal() {
    openModal('modal-music');
    document.getElementById('music-source-type').value = musicSettings.sourceType;
    document.getElementById('music-loop').checked = musicSettings.loop;
    document.getElementById('music-autoplay').checked = musicSettings.autoplay;
    if (musicSettings.sourceType === 'url' && musicSettings.source) {
        document.getElementById('music-url-input').value = musicSettings.source;
    }
    if (musicSettings.fileName) {
        document.getElementById('music-upload-text').textContent = musicSettings.fileName;
    }
    if (musicSettings.source) {
        document.getElementById('music-preview-group').style.display = 'block';
        document.getElementById('music-preview').src = musicSettings.source;
    }
    toggleMusicSource();
}

function saveMusicSetting() {
    const sourceType = document.getElementById('music-source-type').value;
    musicSettings.sourceType = sourceType;
    musicSettings.loop = document.getElementById('music-loop').checked;
    musicSettings.autoplay = document.getElementById('music-autoplay').checked;
    if (sourceType === 'url') {
        musicSettings.source = document.getElementById('music-url-input').value;
        musicSettings.fileName = '';
    }
    musicSettings.enabled = !!musicSettings.source;
    closeModal('modal-music');
    updateMusicButton();
}

function removeMusicSetting() {
    musicSettings = { enabled: false, source: '', sourceType: 'file', loop: true, autoplay: true, fileName: '' };
    document.getElementById('music-preview-group').style.display = 'none';
    document.getElementById('music-upload-text').textContent = 'Click to upload audio file';
    document.getElementById('music-url-input').value = '';
    closeModal('modal-music');
    updateMusicButton();
}

function updateMusicButton() {
    const btn = document.getElementById('btn-music');
    if (musicSettings.enabled) {
        btn.style.background = '#e8f5e9';
        btn.style.borderColor = 'var(--primary)';
        btn.innerHTML = '\u{1F3B5} Music \u2713';
    } else {
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.innerHTML = '\u{1F3B5} Music';
    }
}


// ===== SECTION MANAGEMENT =====
function deleteSection(sectionId) {
    if (!confirm('Are you sure you want to remove this section?')) return;
    sections = sections.filter(s => s.id !== sectionId);
    renderAll();
}

function addSection(type) {
    let newSection = { id: generateId(), type: type, data: getDefaultData(type) };
    sections.push(newSection);
    closeModal('modal-add-section');
    renderAll();
    editSection(newSection.id);
}

function getDefaultData(type) {
    switch(type) {
        case 'hero': return { subtitle: 'The Wedding Of', name1: 'Bride Name', name2: 'Groom Name', date: 'DD.MM.YYYY', heroImage: '' };
        case 'formal-invite': return {
            heading: 'WE CORDIALLY INVITE',
            guestName: 'Guest Name',
            message: 'Your presence will make our wedding day even more meaningful',
            groomFamily: { sideLabel: "Groom's Family", fatherName: 'Mr. Father Name', motherName: 'Mrs. Mother Name', address: 'Address line 1\nAddress line 2' },
            brideFamily: { sideLabel: "Bride's Family", fatherName: 'Mr. Father Name', motherName: 'Mrs. Mother Name', address: 'Address line 1\nAddress line 2' },
            announcement: 'We are honored to announce the wedding of our children',
            groomFullName: 'Groom Full Name',
            groomRole: 'Son',
            brideFullName: 'Bride Full Name',
            brideRole: 'Daughter'
        };
        case 'love-story': return { label: 'Love Story', title: 'Our Story', entries: [{ date: 'Month Year', title: 'Chapter Title', description: 'Your story here...', image: '' }] };
        case 'invitation': return { intro: 'We cordially invite you', subtitle: 'Please join our celebration', cards: [{ label: 'INVITATION', time: 'Time', date: 'Date', venueLabel: 'VENUE', venueName: 'Venue Name', address: 'Address', note: 'Your presence is our honor', mapEmbed: '' }] };
        case 'rsvp': return { title: 'Xin vui lòng xác nhận sự tham gia', placeholderName: 'Tên của bạn', placeholderAttend: 'Bạn có tham dự?', optionYes: 'Có, tôi sẽ tham dự', optionNo: 'Xin lỗi, tôi không thể tham dự', placeholderGuests: 'Số người tham dự', placeholderMessage: 'Gửi lời chúc...', buttonText: 'Gửi xác nhận', thankYouMessage: 'Cảm ơn bạn đã xác nhận!', qrImage: '', qrLabel: 'Quét mã để xác nhận', webhookUrl: 'https://script.google.com/macros/s/AKfycbysXsUi5mQUAFRXlIf4IxLZsoE1hjmLrgG8GJ38hen803ClxSNYDmVrFaLij8KG9RKAcA/exec' };
        case 'thank-you': return { title: 'Thank You', message: 'Thank you for your love and support.' };
        case 'gallery': return { title: 'Our Moments', images: ['', '', '', ''] };
        case 'custom': return { title: '', content: 'Your content here...' };
        default: return {};
    }
}

// ===== DRAG & DROP =====
function setupDragAndDrop() {
    const cards = document.querySelectorAll('.section-card');
    cards.forEach(card => {
        card.addEventListener('dragstart', function(e) { draggedItem = this; this.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
        card.addEventListener('dragend', function() { this.classList.remove('dragging'); draggedItem = null; updateSectionsOrder(); });
        card.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            const list = document.getElementById('sections-list');
            const afterElement = getDragAfterElement(list, e.clientY);
            if (draggedItem && afterElement) list.insertBefore(draggedItem, afterElement);
            else if (draggedItem) list.appendChild(draggedItem);
        });
    });
}

function getDragAfterElement(container, y) {
    const elements = [...container.querySelectorAll('.section-card:not(.dragging)')];
    return elements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) return { offset, element: child };
        return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateSectionsOrder() {
    const cards = document.querySelectorAll('.section-card');
    const newOrder = [];
    cards.forEach(card => { const s = sections.find(sec => sec.id === card.dataset.id); if (s) newOrder.push(s); });
    sections = newOrder;
    renderPreview();
}


// Generate RSVP section specifically for export (functional form)
function renderRSVPForExport(data) {
    const qrContent = data.qrImage
        ? `<img src="${data.qrImage}" alt="QR Code">`
        : '';
    const pName = data.placeholderName || 'T\u00ean c\u1ee7a b\u1ea1n';
    const pAttend = data.placeholderAttend || 'B\u1ea1n c\u00f3 tham d\u1ef1?';
    const oYes = data.optionYes || 'C\u00f3, t\u00f4i s\u1ebd tham d\u1ef1';
    const oNo = data.optionNo || 'Xin l\u1ed7i, t\u00f4i kh\u00f4ng th\u1ec3 tham d\u1ef1';
    const pGuests = data.placeholderGuests || 'S\u1ed1 ng\u01b0\u1eddi tham d\u1ef1';
    const pMsg = data.placeholderMessage || 'G\u1eedi l\u1eddi ch\u00fac...';
    const thankMsg = data.thankYouMessage || 'C\u1ea3m \u01a1n b\u1ea1n \u0111\u00e3 x\u00e1c nh\u1eadn!';
    const webhookUrl = data.webhookUrl || '';

    let qrSection = '';
    if (data.qrImage || data.qrLabel) {
        qrSection = `
            <div class="inv-rsvp-qr">
                ${data.qrLabel ? `<div class="inv-rsvp-qr-label">${data.qrLabel}</div>` : ''}
                ${qrContent ? `<div class="inv-rsvp-qr-image">${qrContent}</div>` : ''}
            </div>`;
    }

    return `
        <section class="inv-section inv-rsvp">
            <div class="inv-section-title">${data.title}</div>
            <form class="inv-rsvp-form" id="rsvp-form" onsubmit="return submitRSVP(event)">
                <div class="inv-rsvp-field"><input type="text" id="rsvp-name" placeholder="${pName}" required></div>
                <div class="inv-rsvp-field"><select id="rsvp-attend" required><option value="">${pAttend}</option><option value="${oYes}">${oYes}</option><option value="${oNo}">${oNo}</option></select></div>
                <div class="inv-rsvp-field"><input type="number" id="rsvp-guests" placeholder="${pGuests}" min="0" max="20"></div>
                <div class="inv-rsvp-field"><textarea id="rsvp-message" placeholder="${pMsg}" rows="3"></textarea></div>
                <button type="submit" class="inv-rsvp-btn">${data.buttonText}</button>
                <div id="rsvp-status" style="margin-top:12px; font-size:0.85rem; display:none;"></div>
            </form>
            ${qrSection}
            <input type="hidden" id="rsvp-webhook-url" value="${webhookUrl}">
            <input type="hidden" id="rsvp-thank-msg" value="${thankMsg}">
        </section>`;
}

// ===== SPLASH SCREEN + MUSIC GENERATION =====
function getSplashHtml() {
    const heroSection = sections.find(s => s.type === 'hero');
    const name1 = heroSection ? heroSection.data.name1 : 'Bride';
    const name2 = heroSection ? heroSection.data.name2 : 'Groom';
    const date = heroSection ? heroSection.data.date : '';
    const heroImage = heroSection ? heroSection.data.heroImage : '';
    const hasMusic = musicSettings.enabled && musicSettings.source;
    const hasAutoplay = hasMusic && musicSettings.autoplay;
    const heroImgHtml = heroImage ? `<img class="splash-photo" src="${heroImage}" alt="Couple">` : '';
    return `
    <div id="splash-screen" class="splash-screen">
        <div class="splash-content">
            <div class="splash-ornament-top"></div>
            ${heroImgHtml}
            <div class="splash-subtitle">Wedding Invitation</div>
            <div class="splash-names">${name1}<span class="splash-amp">&amp;</span>${name2}</div>
            <div class="splash-date">${date}</div>
            <button id="splash-open-btn" class="splash-open-btn">
                <span class="splash-btn-icon">\ud83d\udc8c</span>
                <span class="splash-btn-text">M\u1edf Thi\u1ec7p</span>
            </button>
            ${hasMusic ? '<div class="splash-music-hint">\ud83c\udfb5 Thi\u1ec7p c\u00f3 nh\u1ea1c n\u1ec1n</div>' : ''}
            <div class="splash-ornament-bottom"></div>
        </div>
    </div>
    <script>
        (function() {
            var openBtn = document.getElementById('splash-open-btn');
            if (!openBtn) return;
            var opened = false;
            function openInvitation(e) {
                if (opened) return;
                opened = true;
                if (e) { e.preventDefault(); e.stopPropagation(); }
                var splash = document.getElementById('splash-screen');
                if (splash) splash.classList.add('hidden');
                document.body.classList.add('splash-opened');
                ${hasAutoplay ? `
                var audio = document.getElementById('bg-music');
                if (audio) {
                    audio.load();
                    var p = audio.play();
                    if (p && p.then) {
                        p.then(function() {
                            window.__musicPlaying = true;
                            var iconOn = document.getElementById('music-icon-on');
                            var iconOff = document.getElementById('music-icon-off');
                            var toggleBtn = document.getElementById('music-toggle');
                            if (iconOn) iconOn.style.display = 'block';
                            if (iconOff) iconOff.style.display = 'none';
                            if (toggleBtn) toggleBtn.classList.add('playing');
                        }).catch(function(err) { console.log('Play blocked:', err); });
                    }
                }` : ''}
                setTimeout(function() { if (splash) splash.remove(); }, 1000);
            }
            openBtn.addEventListener('click', openInvitation);
            openBtn.addEventListener('touchend', function(e) { e.preventDefault(); openInvitation(e); });
        })();
    <\/script>`;
}

function getSplashStyles() {
    return `
        .splash-screen { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 99999; display: flex; align-items: center; justify-content: center; background: var(--bg-cream, #f5f7fa); transition: opacity 0.8s ease, transform 0.8s ease; }
        .splash-screen.hidden { opacity: 0; transform: scale(1.05); pointer-events: none; }
        .splash-content { text-align: center; padding: 40px 30px; max-width: 380px; width: 90%; }
        .splash-ornament-top, .splash-ornament-bottom { width: 80px; height: 2px; background: linear-gradient(to right, transparent, var(--gold, #b8965a), transparent); margin: 0 auto 24px; }
        .splash-ornament-bottom { margin: 24px auto 0; }
        .splash-photo { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid var(--gold, #b8965a); margin-bottom: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .splash-subtitle { font-family: var(--font-body, 'Montserrat', sans-serif); font-size: 0.7rem; letter-spacing: 4px; text-transform: uppercase; color: var(--gold, #b8965a); margin-bottom: 12px; }
        .splash-names { font-family: var(--font-script, 'Dancing Script', cursive); font-size: 2.4rem; color: var(--primary-dark, #0d1f3d); line-height: 1.3; margin-bottom: 8px; }
        .splash-amp { display: block; font-family: var(--font-elegant, 'Cormorant Garamond', serif); font-size: 1.6rem; color: var(--gold, #b8965a); margin: 4px 0; }
        .splash-date { font-family: var(--font-elegant, 'Cormorant Garamond', serif); font-size: 1rem; color: var(--text-muted, #6b6b6b); letter-spacing: 1px; margin-bottom: 32px; }
        .splash-open-btn { display: inline-flex; align-items: center; gap: 10px; padding: 14px 36px; background: var(--primary, #1a3a6b); color: white; border: none; border-radius: 50px; font-family: var(--font-body, 'Montserrat', sans-serif); font-size: 0.9rem; font-weight: 600; letter-spacing: 1px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 20px rgba(0,0,0,0.15); animation: splash-pulse 2s infinite; }
        .splash-open-btn:hover { transform: scale(1.05); box-shadow: 0 6px 28px rgba(0,0,0,0.2); }
        .splash-open-btn:active { transform: scale(0.97); }
        .splash-btn-icon { font-size: 1.2rem; }
        .splash-btn-text { text-transform: uppercase; }
        .splash-music-hint { font-family: var(--font-body, 'Montserrat', sans-serif); font-size: 0.7rem; color: var(--text-muted, #6b6b6b); margin-top: 16px; opacity: 0.7; }
        @keyframes splash-pulse { 0%, 100% { box-shadow: 0 4px 20px rgba(0,0,0,0.15); } 50% { box-shadow: 0 4px 30px rgba(0,0,0,0.25); } }
        .invitation-wrapper { opacity: 0; transform: translateY(20px); transition: opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s; }
        body.splash-opened .invitation-wrapper { opacity: 1; transform: translateY(0); }
    `;
}


function getMusicHtml() {
    if (!musicSettings.enabled || !musicSettings.source) return '';
    return `
    <audio id="bg-music" ${musicSettings.loop ? 'loop' : ''} preload="auto" playsinline>
        <source src="${musicSettings.source}">
    </audio>
    <button id="music-toggle" class="music-toggle" aria-label="Toggle Music">
        <svg id="music-icon-on" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        <svg id="music-icon-off" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/><line x1="1" y1="1" x2="23" y2="23" stroke="red" stroke-width="2"/></svg>
    </button>`;
}

function getMusicScript() {
    if (!musicSettings.enabled || !musicSettings.source) return '';
    return `
    <script>
        (function() {
            var audio = document.getElementById('bg-music');
            var toggleBtn = document.getElementById('music-toggle');
            var iconOn = document.getElementById('music-icon-on');
            var iconOff = document.getElementById('music-icon-off');
            if (!audio || !toggleBtn) return;
            function updateUI(playing) {
                window.__musicPlaying = playing;
                if (playing) { iconOn.style.display = 'block'; iconOff.style.display = 'none'; toggleBtn.classList.add('playing'); }
                else { iconOn.style.display = 'none'; iconOff.style.display = 'block'; toggleBtn.classList.remove('playing'); }
            }
            function playMusic() { audio.load(); var p = audio.play(); if (p && p.then) { p.then(function() { updateUI(true); }).catch(function(err) { console.log('Play blocked:', err); updateUI(false); }); } }
            function stopMusic() { audio.pause(); updateUI(false); }
            function toggleMusic() { if (window.__musicPlaying) stopMusic(); else playMusic(); }
            audio.addEventListener('ended', function() { updateUI(false); });
            audio.addEventListener('pause', function() { if (!audio.ended) updateUI(false); });
            audio.addEventListener('play', function() { updateUI(true); });
            var lastToggle = 0;
            function handleToggle(e) { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); var now = Date.now(); if (now - lastToggle < 300) return; lastToggle = now; toggleMusic(); }
            toggleBtn.addEventListener('click', handleToggle);
            toggleBtn.addEventListener('touchend', handleToggle);
            if (window.__musicPlaying) updateUI(true);
            audio.addEventListener('playing', function() { updateUI(true); });
        })();
    <\/script>`;
}

// ===== EXPORT HTML =====
function exportHTML() {
    const previewHtml = sections.map(section => {
        if (section.type === 'rsvp') return renderRSVPForExport(section.data);
        return renderSectionPreview(section);
    }).join('');

    const musicHtml = getMusicHtml();
    const musicScript = getMusicScript();
    const splashHtml = getSplashHtml();
    const splashStyles = getSplashStyles();

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wedding Invitation</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&family=Dancing+Script:wght@400;600;700&display=swap" rel="stylesheet">
    <style>${getExportStyles()}${splashStyles}</style>
</head>
<body>
    ${splashHtml}
    ${musicHtml}
    <div class="invitation-wrapper" data-theme="${currentTheme}">
        ${previewHtml}
    </div>
    ${musicScript}
    <script>
        function submitRSVP(event) {
            event.preventDefault();
            var form = document.getElementById('rsvp-form');
            var btn = form.querySelector('.inv-rsvp-btn');
            var status = document.getElementById('rsvp-status');
            var webhookUrl = document.getElementById('rsvp-webhook-url').value;
            var thankMsg = document.getElementById('rsvp-thank-msg').value;

            var payload = {
                name: document.getElementById('rsvp-name').value,
                attendance: document.getElementById('rsvp-attend').value,
                guests: document.getElementById('rsvp-guests').value,
                message: document.getElementById('rsvp-message').value
            };

            btn.disabled = true;
            btn.textContent = '\u0110ang g\u1eedi...';
            status.style.display = 'none';

            if (!webhookUrl) {
                status.style.display = 'block';
                status.style.color = '#e8c48a';
                status.textContent = thankMsg;
                btn.textContent = '\u0110\u00e3 g\u1eedi \u2713';
                form.reset();
                return false;
            }

            fetch(webhookUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(function() {
                status.style.display = 'block';
                status.style.color = '#e8c48a';
                status.textContent = thankMsg;
                btn.textContent = '\u0110\u00e3 g\u1eedi \u2713';
                btn.style.background = '#2d8f5e';
                btn.style.color = 'white';
                form.reset();
            }).catch(function(err) {
                status.style.display = 'block';
                status.style.color = '#e8c48a';
                status.textContent = thankMsg;
                btn.textContent = '\u0110\u00e3 g\u1eedi \u2713';
                form.reset();
            });

            return false;
        }
    <\/script>
    <script>
        // Personalize guest name from URL parameter
        (function() {
            var params = new URLSearchParams(window.location.search);
            var guestName = params.get('guest');
            if (guestName) {
                var el = document.querySelector('.inv-formal-guest-name');
                if (el) el.textContent = decodeURIComponent(guestName);
                var rsvpName = document.getElementById('rsvp-name');
                if (rsvpName) rsvpName.value = decodeURIComponent(guestName);
            }
        })();
    <\/script>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-invitation.html';
    a.click();
    URL.revokeObjectURL(url);
}

// ===== PUBLISH TO GITHUB PAGES =====
function publishInvitation() {
    const previewHtml = sections.map(section => {
        if (section.type === 'rsvp') return renderRSVPForExport(section.data);
        return renderSectionPreview(section);
    }).join('');

    const musicHtml = getMusicHtml();
    const musicScript = getMusicScript();
    const splashHtml = getSplashHtml();
    const splashStyles = getSplashStyles();

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wedding Invitation</title>
    <meta property="og:title" content="Wedding Invitation - ${sections[0]?.data?.name1 || ''} & ${sections[0]?.data?.name2 || ''}">
    <meta property="og:description" content="You are invited to our wedding celebration!">
    <meta property="og:type" content="website">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&family=Dancing+Script:wght@400;600;700&display=swap" rel="stylesheet">
    <style>${getExportStyles()}${splashStyles}</style>
</head>
<body>
    ${splashHtml}
    ${musicHtml}
    <div class="invitation-wrapper" data-theme="${currentTheme}">
        ${previewHtml}
    </div>
    ${musicScript}
    <script>
        function submitRSVP(event) {
            event.preventDefault();
            var form = document.getElementById('rsvp-form');
            var btn = form.querySelector('.inv-rsvp-btn');
            var status = document.getElementById('rsvp-status');
            var webhookUrl = document.getElementById('rsvp-webhook-url').value;
            var thankMsg = document.getElementById('rsvp-thank-msg').value;
            var payload = { name: document.getElementById('rsvp-name').value, attendance: document.getElementById('rsvp-attend').value, guests: document.getElementById('rsvp-guests').value, message: document.getElementById('rsvp-message').value };
            btn.disabled = true; btn.textContent = '\u0110ang g\u1eedi...'; status.style.display = 'none';
            if (!webhookUrl) { status.style.display='block'; status.style.color='#e8c48a'; status.textContent=thankMsg; btn.textContent='\u0110\u00e3 g\u1eedi \u2713'; form.reset(); return false; }
            fetch(webhookUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(function() { status.style.display='block'; status.style.color='#e8c48a'; status.textContent=thankMsg; btn.textContent='\u0110\u00e3 g\u1eedi \u2713'; btn.style.background='#2d8f5e'; btn.style.color='white'; form.reset(); }).catch(function() { status.style.display='block'; status.style.color='#e8c48a'; status.textContent=thankMsg; btn.textContent='\u0110\u00e3 g\u1eedi \u2713'; form.reset(); });
            return false;
        }
    <\/script>
    <script>
        // Personalize guest name from URL parameter
        (function() {
            var params = new URLSearchParams(window.location.search);
            var guestName = params.get('guest');
            if (guestName) {
                var el = document.querySelector('.inv-formal-guest-name');
                if (el) el.textContent = decodeURIComponent(guestName);
                // Also pre-fill RSVP name field
                var rsvpName = document.getElementById('rsvp-name');
                if (rsvpName) rsvpName.value = decodeURIComponent(guestName);
            }
        })();
    <\/script>
</body>
</html>`;

    // Determine which site to publish to
    var siteSelect = document.getElementById('publish-site-select');
    var site = siteSelect ? siteSelect.value : 'wedding';
    var liveUrl = 'https://gondor98.github.io/' + site + '/';

    // Save to local file for the wedding repo
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    a.click();
    URL.revokeObjectURL(url);

    // Show publish instructions
    alert('\u2705 File saved as index.html!\n\nTo publish to: ' + liveUrl + '\n\nRun in terminal:\n   ~/' + site + '/publish.sh ~/Downloads/index.html\n\nYour invitation will be live in ~30 seconds!');
}


function getExportStyles() {
    return `
        :root { --primary: #1a3a6b; --primary-light: #2d5a9e; --primary-dark: #0d1f3d; --gold: #b8965a; --gold-light: #dfc692; --bg-cream: #f5f7fa; --text-dark: #2c2c2c; --text-muted: #6b6b6b; --border: #e0ddd8; --radius: 8px; --radius-lg: 16px; --font-display: 'Playfair Display', serif; --font-elegant: 'Cormorant Garamond', serif; --font-body: 'Montserrat', sans-serif; --font-script: 'Dancing Script', cursive; --hero-gradient: linear-gradient(135deg, #0d1f3d 0%, #1a3a6b 50%, #0d1f3d 100%); --ornament-color: rgba(184,150,90,0.4); }
        [data-theme="luxurious-blue"] { --primary: #1a3a6b; --primary-light: #2d5a9e; --primary-dark: #0d1f3d; --gold: #b8965a; --gold-light: #dfc692; --bg-cream: #f5f7fa; --hero-gradient: linear-gradient(135deg, #0d1f3d 0%, #1a3a6b 50%, #0d1f3d 100%); --ornament-color: rgba(184,150,90,0.4); }
        [data-theme="spanish-garden"] { --primary: #4a7a52; --primary-light: #6a9a6a; --primary-dark: #2e5a3a; --gold: #c49a4c; --gold-light: #e8cb82; --bg-cream: #f8f9f4; --hero-gradient: linear-gradient(135deg, #3a6b4a 0%, #5a8a5a 35%, #7aa868 70%, #5a8a4a 100%); --ornament-color: rgba(196,154,76,0.4); }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: var(--font-body); background: #e8e5e0; display: flex; justify-content: center; padding: 20px; min-height: 100vh; }
        .invitation-wrapper { width: 100%; max-width: 480px; background: white; border-radius: var(--radius-lg); overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.12); }
        .inv-section { position: relative; }
        .inv-hero { background: var(--primary-dark); color: white; text-align: center; padding: 80px 30px; position: relative; overflow: hidden; background-image: var(--hero-gradient); }
        .inv-hero::before, .inv-hero::after { content: ''; position: absolute; width: 150px; height: 150px; background-size: contain; background-repeat: no-repeat; opacity: 0.3; }
        .inv-hero::before { top: 0; right: 0; background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M90,10 Q95,30 80,50 Q65,70 50,60 Q35,50 40,30 Q45,10 60,5 Q75,0 90,10Z" fill="rgba(201,168,76,0.4)"/></svg>'); }
        .inv-hero::after { bottom: 0; left: 0; background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M10,90 Q5,70 20,50 Q35,30 50,40 Q65,50 60,70 Q55,90 40,95 Q25,100 10,90Z" fill="rgba(201,168,76,0.4)"/></svg>'); }
        .inv-hero-subtitle { font-family: var(--font-body); font-size: 0.8rem; letter-spacing: 3px; text-transform: uppercase; color: var(--gold-light); margin-bottom: 16px; }
        .inv-hero-names { font-family: var(--font-display); font-size: 2.4rem; font-weight: 700; line-height: 1.3; margin-bottom: 16px; }
        .inv-hero-ampersand { font-family: var(--font-elegant); font-style: italic; color: var(--gold); font-size: 2rem; display: block; margin: 8px 0; }
        .inv-hero-date { font-family: var(--font-elegant); font-size: 1.1rem; color: var(--gold-light); letter-spacing: 1px; }
        .inv-hero-image { width: 160px; height: 160px; border-radius: 50%; border: 3px solid var(--gold); object-fit: cover; margin: 20px auto 0; display: block; }
        .inv-formal-invite { padding: 60px 24px; background: white; text-align: center; }
        .inv-formal-heading { font-family: var(--font-body); font-size: 0.8rem; letter-spacing: 3px; text-transform: uppercase; color: var(--primary-dark); font-weight: 600; margin-bottom: 16px; }
        .inv-formal-guest-name { font-family: var(--font-script); font-size: 2rem; color: var(--primary); font-weight: 700; font-style: italic; margin-bottom: 24px; }
        .inv-formal-message { font-family: var(--font-body); font-size: 0.75rem; letter-spacing: 2px; text-transform: uppercase; color: var(--gold); font-weight: 600; margin-bottom: 40px; line-height: 1.8; }
        .inv-formal-families { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; text-align: center; }
        .inv-formal-family-side h4 { font-family: var(--font-display); font-size: 1.1rem; color: var(--primary-dark); margin-bottom: 12px; font-weight: 400; }
        .inv-formal-family-side .parent-name { font-family: var(--font-body); font-size: 0.75rem; font-weight: 700; color: var(--text-dark); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
        .inv-formal-family-side .family-address { font-family: var(--font-elegant); font-size: 0.85rem; color: var(--text-muted); font-style: italic; margin-top: 8px; line-height: 1.5; }
        .inv-formal-divider { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 32px 0; color: var(--gold); }
        .inv-formal-divider::before, .inv-formal-divider::after { content: ''; flex: 1; height: 1px; background: linear-gradient(to right, transparent, var(--gold), transparent); }
        .inv-formal-divider span { font-size: 0.9rem; letter-spacing: 4px; }
        .inv-formal-announce { font-family: var(--font-body); font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; color: var(--text-dark); margin-bottom: 24px; }
        .inv-formal-announce strong { color: var(--primary); font-weight: 700; }
        .inv-formal-couple-name { font-family: var(--font-script); font-size: 2.2rem; color: var(--primary-dark); margin-bottom: 8px; font-weight: 700; }
        .inv-formal-role { font-family: var(--font-body); font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px; }
        .inv-formal-heart { color: var(--primary); font-size: 1.5rem; margin: 12px 0; }
        .inv-love-story { padding: 60px 24px; background: var(--bg-cream); }
        .inv-section-label { text-align: center; font-family: var(--font-body); font-size: 0.7rem; letter-spacing: 3px; text-transform: uppercase; color: var(--primary); margin-bottom: 8px; }
        .inv-section-title { text-align: center; font-family: var(--font-display); font-size: 1.6rem; color: var(--primary-dark); margin-bottom: 40px; }
        .inv-timeline { position: relative; padding-left: 30px; }
        .inv-timeline::before { content: ''; position: absolute; left: 8px; top: 0; bottom: 0; width: 2px; background: var(--gold); }
        .inv-timeline-item { position: relative; margin-bottom: 40px; }
        .inv-timeline-item::before { content: ''; position: absolute; left: -26px; top: 6px; width: 12px; height: 12px; border-radius: 50%; background: var(--gold); border: 2px solid white; box-shadow: 0 0 0 2px var(--gold); }
        .inv-timeline-date { font-family: var(--font-elegant); font-size: 0.9rem; color: var(--gold); font-weight: 600; margin-bottom: 4px; }
        .inv-timeline-title { font-family: var(--font-display); font-size: 1.1rem; color: var(--primary-dark); margin-bottom: 8px; }
        .inv-timeline-desc { font-family: var(--font-elegant); font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; }
        .inv-timeline-image { width: 100%; border-radius: var(--radius); margin-top: 12px; object-fit: cover; max-height: 200px; }
        .inv-invitation { padding: 60px 24px; background: white; text-align: center; }
        .inv-invitation-intro { font-family: var(--font-elegant); font-size: 1.1rem; color: var(--text-muted); margin-bottom: 8px; font-style: italic; }
        .inv-invitation-subtitle { font-family: var(--font-elegant); font-size: 0.95rem; color: var(--text-muted); margin-bottom: 40px; }
        .inv-card { background: linear-gradient(135deg, color-mix(in srgb, var(--primary) 3%, white) 0%, color-mix(in srgb, var(--primary) 8%, white) 100%); border: 1px solid color-mix(in srgb, var(--primary) 15%, transparent); border-radius: var(--radius-lg); padding: 32px 24px; margin-bottom: 24px; }
        [data-theme="luxurious-blue"] .inv-card { background: linear-gradient(135deg, #f8fafd 0%, #eef3f9 100%); border-color: rgba(26,58,107,0.12); }
        [data-theme="spanish-garden"] .inv-card { background: linear-gradient(135deg, #f8fbf6 0%, #eef5ea 100%); border-color: rgba(74,122,82,0.15); }
        .inv-card-label { font-family: var(--font-body); font-size: 0.7rem; letter-spacing: 3px; text-transform: uppercase; color: var(--primary); margin-bottom: 16px; font-weight: 600; }
        .inv-card-time { font-family: var(--font-display); font-size: 1.1rem; color: var(--primary-dark); margin-bottom: 8px; }
        .inv-card-date { font-family: var(--font-elegant); font-size: 0.95rem; color: var(--text-muted); margin-bottom: 16px; }
        .inv-card-venue { font-family: var(--font-body); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 4px; }
        .inv-card-venue-name { font-family: var(--font-display); font-size: 1.3rem; color: var(--primary); font-weight: 700; }
        .inv-card-address { font-family: var(--font-elegant); font-size: 0.9rem; color: var(--text-muted); margin-top: 8px; }
        .inv-card-note { font-family: var(--font-elegant); font-size: 0.85rem; color: var(--text-muted); font-style: italic; margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(26,92,58,0.1); }
        .inv-card-map { margin-top: 16px; border-radius: var(--radius); overflow: hidden; border: 1px solid rgba(26,92,58,0.1); }
        .inv-card-map iframe { width: 100%; height: 180px; border: none; display: block; }
        .inv-card-map-placeholder { width: 100%; height: 120px; background: var(--bg-cream); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; color: var(--text-muted); }
        .inv-card-map-link { display: block; text-align: center; padding: 10px; font-family: var(--font-body); font-size: 0.8rem; color: var(--primary); text-decoration: none; background: var(--bg-cream); border-top: 1px solid var(--border); }
        .inv-rsvp { padding: 60px 24px; background: var(--primary-dark); color: white; text-align: center; }
        .inv-rsvp .inv-section-title { color: white; }
        .inv-rsvp-form { max-width: 320px; margin: 0 auto; }
        .inv-rsvp-field { margin-bottom: 16px; }
        .inv-rsvp-field input, .inv-rsvp-field textarea, .inv-rsvp-field select { width: 100%; padding: 12px 16px; border: 1px solid rgba(255,255,255,0.2); border-radius: var(--radius); background: rgba(255,255,255,0.08); color: white; font-family: var(--font-body); font-size: 0.9rem; }
        .inv-rsvp-field input::placeholder, .inv-rsvp-field textarea::placeholder { color: rgba(255,255,255,0.5); }
        .inv-rsvp-field select { appearance: none; }
        .inv-rsvp-field select option { background: var(--primary-dark); color: white; }
        .inv-rsvp-btn { width: 100%; padding: 14px; background: var(--gold); color: var(--primary-dark); border: none; border-radius: var(--radius); font-family: var(--font-body); font-weight: 600; font-size: 0.9rem; cursor: pointer; letter-spacing: 1px; text-transform: uppercase; margin-top: 8px; }
        .inv-rsvp-qr { margin-top: 32px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.15); }
        .inv-rsvp-qr-label { font-family: var(--font-body); font-size: 0.75rem; letter-spacing: 2px; text-transform: uppercase; color: var(--gold-light); margin-bottom: 12px; }
        .inv-rsvp-qr-image { width: 160px; height: 160px; border: 2px dashed rgba(255,255,255,0.3); border-radius: var(--radius); margin: 0 auto; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); overflow: hidden; }
        .inv-rsvp-qr-image img { width: 100%; height: 100%; object-fit: contain; }
        .inv-rsvp-qr-placeholder { font-size: 0.8rem; color: rgba(255,255,255,0.4); text-align: center; padding: 10px; }
        .inv-thank-you { padding: 60px 24px; background: var(--bg-cream); text-align: center; }
        .inv-thank-you-message { font-family: var(--font-elegant); font-size: 1.05rem; color: var(--text-muted); line-height: 1.8; max-width: 360px; margin: 0 auto; }
        .inv-gallery { padding: 60px 24px; background: white; }
        .inv-gallery-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .inv-gallery-item { aspect-ratio: 1; border-radius: var(--radius); overflow: hidden; background: var(--bg-cream); }
        .inv-gallery-item img { width: 100%; height: 100%; object-fit: cover; }
        .inv-gallery-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; color: var(--text-muted); }
        .inv-custom { padding: 40px 24px; background: white; text-align: center; }
        .inv-custom-content { font-family: var(--font-elegant); font-size: 1rem; color: var(--text-dark); line-height: 1.7; }
        .music-toggle { position: fixed; bottom: 24px; right: 24px; width: 50px; height: 50px; border-radius: 50%; background: var(--primary); color: white; border: 2px solid var(--gold); display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 16px rgba(0,0,0,0.2); z-index: 9999; transition: transform 0.3s; }
        .music-toggle:hover { transform: scale(1.1); }
        .music-toggle.playing { animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { box-shadow: 0 4px 16px rgba(0,0,0,0.2); } 50% { box-shadow: 0 4px 24px rgba(201,168,76,0.5); } }
        /* Decorations */
        .inv-section { position: relative; overflow: hidden; }
        .inv-formal-invite, .inv-invitation, .inv-gallery, .inv-thank-you, .inv-love-story, .inv-custom { position: relative; overflow: hidden; }
        .inv-formal-invite::before, .inv-formal-invite::after, .inv-invitation::before, .inv-invitation::after, .inv-gallery::before, .inv-gallery::after, .inv-thank-you::before, .inv-thank-you::after { content: ''; position: absolute; width: 120px; height: 120px; pointer-events: none; opacity: 0.2; background-size: contain; background-repeat: no-repeat; }
        .inv-formal-invite::before, .inv-invitation::before, .inv-gallery::before, .inv-thank-you::before { top: 8px; left: 8px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M5,50 Q5,20 25,10 Q45,0 50,20 Q55,0 75,10 Q95,20 95,50' fill='none' stroke='%23c9a84c' stroke-width='1.5'/%3E%3Cpath d='M15,45 Q20,25 40,20 Q50,15 50,30' fill='none' stroke='%23c9a84c' stroke-width='1'/%3E%3Ccircle cx='50' cy='12' r='3' fill='%23c9a84c' fill-opacity='0.5'/%3E%3C/svg%3E"); }
        .inv-formal-invite::after, .inv-invitation::after, .inv-gallery::after, .inv-thank-you::after { bottom: 8px; right: 8px; transform: rotate(180deg); background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M5,50 Q5,20 25,10 Q45,0 50,20 Q55,0 75,10 Q95,20 95,50' fill='none' stroke='%23c9a84c' stroke-width='1.5'/%3E%3Cpath d='M15,45 Q20,25 40,20 Q50,15 50,30' fill='none' stroke='%23c9a84c' stroke-width='1'/%3E%3Ccircle cx='50' cy='12' r='3' fill='%23c9a84c' fill-opacity='0.5'/%3E%3C/svg%3E"); }
        .inv-love-story { background: linear-gradient(135deg, color-mix(in srgb, var(--primary) 6%, var(--bg-cream)) 0%, var(--bg-cream) 40%, color-mix(in srgb, var(--gold) 8%, var(--bg-cream)) 100%); }
        .inv-formal-invite { background: linear-gradient(180deg, color-mix(in srgb, var(--primary) 5%, white) 0%, white 15%, white 85%, color-mix(in srgb, var(--gold) 6%, white) 100%); border-top: 3px solid var(--gold); }
        .inv-invitation { background: linear-gradient(180deg, color-mix(in srgb, var(--gold) 6%, white) 0%, white 20%, color-mix(in srgb, var(--primary) 3%, white) 50%, white 80%, color-mix(in srgb, var(--gold) 6%, white) 100%); }
        .inv-gallery { background: linear-gradient(180deg, color-mix(in srgb, var(--primary) 5%, var(--bg-cream)) 0%, var(--bg-cream) 50%, color-mix(in srgb, var(--gold) 5%, var(--bg-cream)) 100%); }
        .inv-thank-you { background: radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--gold) 10%, transparent) 0%, transparent 70%), linear-gradient(180deg, var(--bg-cream) 0%, color-mix(in srgb, var(--gold) 5%, var(--bg-cream)) 100%); border-bottom: 3px solid var(--gold); }
        .inv-rsvp { background: var(--primary-dark); background-image: radial-gradient(ellipse at 10% 20%, color-mix(in srgb, var(--primary) 40%, transparent) 0%, transparent 40%), radial-gradient(ellipse at 90% 80%, color-mix(in srgb, var(--gold) 12%, transparent) 0%, transparent 40%), radial-gradient(ellipse at 50% 100%, color-mix(in srgb, var(--primary-light) 15%, transparent) 0%, transparent 50%); }
        .inv-love-story .inv-section-title::after, .inv-invitation .inv-invitation-subtitle::after, .inv-gallery .inv-section-title::after, .inv-thank-you .inv-section-title::after { content: '\\2022  \\2726  \\2022'; display: block; margin-top: 16px; font-size: 1rem; letter-spacing: 8px; color: var(--gold); opacity: 0.6; }
        [data-theme="luxurious-blue"] .inv-love-story { background: linear-gradient(135deg, rgba(26,58,107,0.06) 0%, #f5f7fa 40%, rgba(184,150,90,0.06) 100%); }
        [data-theme="luxurious-blue"] .inv-card { background: linear-gradient(135deg, #f8fafd 0%, #eef3f9 100%); border-color: rgba(26,58,107,0.12); }
        [data-theme="luxurious-blue"] .inv-rsvp { background: #0d1f3d; background-image: radial-gradient(ellipse at 10% 20%, rgba(26,58,107,0.5) 0%, transparent 40%), radial-gradient(ellipse at 90% 80%, rgba(184,150,90,0.12) 0%, transparent 40%); }
        [data-theme="spanish-garden"] .inv-love-story { background: linear-gradient(135deg, rgba(74,122,82,0.07) 0%, #f8f9f4 40%, rgba(196,154,76,0.06) 100%); }
        [data-theme="spanish-garden"] .inv-card { background: linear-gradient(135deg, #f8fbf6 0%, #eef5ea 100%); border-color: rgba(74,122,82,0.15); }
        [data-theme="spanish-garden"] .inv-formal-invite { border-top-color: #c49a4c; }
        [data-theme="spanish-garden"] .inv-thank-you { border-bottom-color: #c49a4c; }
        [data-theme="spanish-garden"] .inv-rsvp { background: #2e5a3a; background-image: radial-gradient(ellipse at 10% 20%, rgba(74,122,82,0.4) 0%, transparent 40%), radial-gradient(ellipse at 90% 80%, rgba(196,154,76,0.15) 0%, transparent 40%); }
        [data-theme="eucalyptus"] { --primary: #5a7a5e; --primary-light: #7a9a7e; --primary-dark: #3a5a3e; --gold: #6b8b6e; --gold-light: #8aaa8e; --bg-cream: #f6f8f4; --text-dark: #2c3e2e; --text-muted: #5a6b5c; --hero-gradient: none; --ornament-color: rgba(90,122,94,0.3); }
        [data-theme="eucalyptus"] .inv-hero { background: #f6f8f4; background-image: none; color: #2c3e2e; padding: 100px 30px 80px; }
        [data-theme="eucalyptus"] .inv-hero::before { content: ""; position: absolute; top: 0; left: 0; width: 200px; height: 100%; opacity: 0.85; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 600'%3E%3Cpath d='M80,600 C85,550 70,500 75,450 C80,400 60,350 70,300 C80,250 65,200 75,150 C85,100 70,50 80,0' fill='none' stroke='%234a7a52' stroke-width='1.5' opacity='0.4'/%3E%3Cellipse cx='60' cy='80' rx='25' ry='18' fill='%235a8a5a' fill-opacity='0.3' transform='rotate(-30 60 80)'/%3E%3Cellipse cx='45' cy='130' rx='22' ry='16' fill='%236a9a6a' fill-opacity='0.35' transform='rotate(-45 45 130)'/%3E%3Cellipse cx='70' cy='180' rx='28' ry='20' fill='%234a8a4a' fill-opacity='0.3' transform='rotate(-20 70 180)'/%3E%3Cellipse cx='50' cy='240' rx='24' ry='17' fill='%235a9a5e' fill-opacity='0.35' transform='rotate(-40 50 240)'/%3E%3Cellipse cx='75' cy='300' rx='26' ry='19' fill='%236aaa6a' fill-opacity='0.3' transform='rotate(-25 75 300)'/%3E%3Cellipse cx='55' cy='360' rx='22' ry='16' fill='%234a8a52' fill-opacity='0.35' transform='rotate(-50 55 360)'/%3E%3C/svg%3E"); background-size: contain; background-repeat: no-repeat; background-position: left center; pointer-events: none; }
        [data-theme="eucalyptus"] .inv-hero::after { content: ""; position: absolute; top: 0; right: 0; width: 200px; height: 100%; opacity: 0.85; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 600'%3E%3Cpath d='M120,600 C115,550 130,500 125,450 C120,400 140,350 130,300 C120,250 135,200 125,150 C115,100 130,50 120,0' fill='none' stroke='%234a7a52' stroke-width='1.5' opacity='0.4'/%3E%3Cellipse cx='140' cy='60' rx='25' ry='18' fill='%235a8a5a' fill-opacity='0.3' transform='rotate(30 140 60)'/%3E%3Cellipse cx='155' cy='120' rx='22' ry='16' fill='%236a9a6a' fill-opacity='0.35' transform='rotate(45 155 120)'/%3E%3Cellipse cx='130' cy='190' rx='28' ry='20' fill='%234a8a4a' fill-opacity='0.3' transform='rotate(20 130 190)'/%3E%3Cellipse cx='150' cy='260' rx='24' ry='17' fill='%235a9a5e' fill-opacity='0.35' transform='rotate(40 150 260)'/%3E%3Cellipse cx='125' cy='330' rx='26' ry='19' fill='%236aaa6a' fill-opacity='0.3' transform='rotate(25 125 330)'/%3E%3Cellipse cx='145' cy='400' rx='22' ry='16' fill='%234a8a52' fill-opacity='0.35' transform='rotate(50 145 400)'/%3E%3C/svg%3E"); background-size: contain; background-repeat: no-repeat; background-position: right center; pointer-events: none; }
        [data-theme="eucalyptus"] .inv-hero-subtitle { color: #3a5a3e; font-weight: 500; letter-spacing: 4px; }
        [data-theme="eucalyptus"] .inv-hero-names { font-family: var(--font-script); font-size: 2.8rem; color: #2c3e2e; }
        [data-theme="eucalyptus"] .inv-hero-ampersand { font-family: var(--font-script); color: #5a7a5e; font-size: 1.8rem; }
        [data-theme="eucalyptus"] .inv-hero-date { color: #5a6b5c; font-family: var(--font-body); letter-spacing: 2px; margin-top: 20px; }
        [data-theme="eucalyptus"] .inv-formal-invite, [data-theme="eucalyptus"] .inv-love-story, [data-theme="eucalyptus"] .inv-invitation, [data-theme="eucalyptus"] .inv-thank-you, [data-theme="eucalyptus"] .inv-gallery, [data-theme="eucalyptus"] .inv-custom { background-color: #f6f8f4; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cellipse cx='50' cy='60' rx='8' ry='5' fill='%235a9a5a' fill-opacity='0.12' transform='rotate(-30 50 60)'/%3E%3Cellipse cx='320' cy='90' rx='6' ry='4' fill='%236aaa6a' fill-opacity='0.1' transform='rotate(20 320 90)'/%3E%3Cellipse cx='180' cy='150' rx='7' ry='4' fill='%234a8a4a' fill-opacity='0.08' transform='rotate(-45 180 150)'/%3E%3Cellipse cx='280' cy='200' rx='9' ry='5' fill='%235a9a5e' fill-opacity='0.1' transform='rotate(35 280 200)'/%3E%3Cellipse cx='100' cy='250' rx='6' ry='4' fill='%236a9a6a' fill-opacity='0.08' transform='rotate(-15 100 250)'/%3E%3Cellipse cx='350' cy='300' rx='8' ry='5' fill='%234a8a52' fill-opacity='0.12' transform='rotate(40 350 300)'/%3E%3Cellipse cx='220' cy='340' rx='7' ry='4' fill='%235a9a5a' fill-opacity='0.1' transform='rotate(-25 220 340)'/%3E%3C/svg%3E"); background-repeat: repeat; background-size: 400px 400px; border-top: none; border-bottom: none; }
        [data-theme="eucalyptus"] .inv-formal-invite::before, [data-theme="eucalyptus"] .inv-love-story::before, [data-theme="eucalyptus"] .inv-invitation::before, [data-theme="eucalyptus"] .inv-thank-you::before, [data-theme="eucalyptus"] .inv-gallery::before, [data-theme="eucalyptus"] .inv-custom::before { content: ""; position: absolute; top: 0; left: 0; width: 140px; height: 100%; opacity: 0.5; pointer-events: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 140 400'%3E%3Cpath d='M60,400 C55,350 65,300 60,250 C55,200 68,150 60,100 C52,50 65,25 60,0' fill='none' stroke='%235a8a5a' stroke-width='1' opacity='0.5'/%3E%3Cellipse cx='40' cy='50' rx='20' ry='14' fill='%235a9a5a' fill-opacity='0.25' transform='rotate(-35 40 50)'/%3E%3Cellipse cx='75' cy='100' rx='18' ry='13' fill='%236aaa6a' fill-opacity='0.2' transform='rotate(-20 75 100)'/%3E%3Cellipse cx='35' cy='160' rx='22' ry='15' fill='%234a8a4a' fill-opacity='0.25' transform='rotate(-45 35 160)'/%3E%3Cellipse cx='70' cy='220' rx='19' ry='13' fill='%235a9a5e' fill-opacity='0.2' transform='rotate(-30 70 220)'/%3E%3Cellipse cx='42' cy='290' rx='21' ry='14' fill='%236a9a6a' fill-opacity='0.25' transform='rotate(-40 42 290)'/%3E%3C/svg%3E"); background-size: contain; background-repeat: repeat-y; background-position: left top; }
        [data-theme="eucalyptus"] .inv-formal-invite::after, [data-theme="eucalyptus"] .inv-love-story::after, [data-theme="eucalyptus"] .inv-invitation::after, [data-theme="eucalyptus"] .inv-thank-you::after, [data-theme="eucalyptus"] .inv-gallery::after, [data-theme="eucalyptus"] .inv-custom::after { content: ""; position: absolute; top: 0; right: 0; width: 140px; height: 100%; opacity: 0.5; pointer-events: none; transform: scaleX(-1); background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 140 400'%3E%3Cpath d='M60,400 C55,350 65,300 60,250 C55,200 68,150 60,100 C52,50 65,25 60,0' fill='none' stroke='%235a8a5a' stroke-width='1' opacity='0.5'/%3E%3Cellipse cx='40' cy='50' rx='20' ry='14' fill='%235a9a5a' fill-opacity='0.25' transform='rotate(-35 40 50)'/%3E%3Cellipse cx='75' cy='100' rx='18' ry='13' fill='%236aaa6a' fill-opacity='0.2' transform='rotate(-20 75 100)'/%3E%3Cellipse cx='35' cy='160' rx='22' ry='15' fill='%234a8a4a' fill-opacity='0.25' transform='rotate(-45 35 160)'/%3E%3Cellipse cx='70' cy='220' rx='19' ry='13' fill='%235a9a5e' fill-opacity='0.2' transform='rotate(-30 70 220)'/%3E%3Cellipse cx='42' cy='290' rx='21' ry='14' fill='%236a9a6a' fill-opacity='0.25' transform='rotate(-40 42 290)'/%3E%3C/svg%3E"); background-size: contain; background-repeat: repeat-y; background-position: left top; }
        [data-theme="eucalyptus"] .inv-card { background: rgba(255,255,255,0.7); border: 1px solid rgba(90,122,94,0.15); }
        [data-theme="eucalyptus"] .inv-rsvp { background: #3a5a3e; background-image: radial-gradient(ellipse at 10% 20%, rgba(90,138,90,0.3) 0%, transparent 40%), radial-gradient(ellipse at 90% 80%, rgba(106,170,106,0.15) 0%, transparent 40%); }
        [data-theme="eucalyptus"] .inv-rsvp-btn { background: #7a9a7e; color: white; }
        [data-theme="eucalyptus"] .inv-formal-invite { border-top: 2px solid #7a9a7e; }
        [data-theme="eucalyptus"] .inv-thank-you { border-bottom: 2px solid #7a9a7e; }
        [data-theme="eucalyptus"] .inv-formal-divider { color: #7a9a7e; }
        [data-theme="eucalyptus"] .inv-formal-divider::before, [data-theme="eucalyptus"] .inv-formal-divider::after { background: linear-gradient(to right, transparent, #7a9a7e, transparent); }
        [data-theme="eucalyptus"] .inv-timeline::before { background: #7a9a7e; }
        [data-theme="eucalyptus"] .inv-timeline-item::before { background: #7a9a7e; box-shadow: 0 0 0 2px #7a9a7e; }
        [data-theme="eucalyptus"] .inv-timeline-date { color: #5a7a5e; }
        [data-theme="eucalyptus"] .inv-love-story .inv-section-title::after, [data-theme="eucalyptus"] .inv-invitation .inv-invitation-subtitle::after, [data-theme="eucalyptus"] .inv-gallery .inv-section-title::after, [data-theme="eucalyptus"] .inv-thank-you .inv-section-title::after { color: #7a9a7e; }
        [data-theme="cherry-blossom"] { --primary: #c4748e; --primary-light: #e8a0b8; --primary-dark: #8b4060; --gold: #d4839b; --gold-light: #f0c0d4; --bg-cream: #faf8fa; --text-dark: #2c2c2c; --text-muted: #6b6b6b; --hero-gradient: none; --ornament-color: rgba(196,116,142,0.3); }
        [data-theme="cherry-blossom"] .inv-hero { background: #faf8fa; background-image: none; color: #2c2c2c; padding: 100px 30px 80px; }
        [data-theme="cherry-blossom"] .inv-hero::before { content: ""; position: absolute; top: 0; left: 0; width: 220px; height: 220px; opacity: 0.9; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 220'%3E%3Cpath d='M30,50 Q25,35 35,30 Q45,25 50,35 Q55,25 65,30 Q75,35 70,50 Q65,60 50,70 Q35,60 30,50Z' fill='%23f8bbd0' opacity='0.9'/%3E%3Ccircle cx='50' cy='45' r='4' fill='%23ffcc80' opacity='0.8'/%3E%3Cpath d='M70,20 Q65,8 75,5 Q85,2 88,12 Q95,5 103,10 Q110,18 105,28 Q98,38 88,44 Q75,36 70,20Z' fill='%23f48fb1' opacity='0.85'/%3E%3Ccircle cx='88' cy='20' r='3.5' fill='%23ffe082' opacity='0.8'/%3E%3Cpath d='M120,40 Q116,28 125,24 Q134,20 137,30 Q143,23 150,27 Q157,34 152,44 Q146,52 137,57 Q126,50 120,40Z' fill='%23f8bbd0' opacity='0.8'/%3E%3Ccircle cx='137' cy='38' r='3' fill='%23ffcc80' opacity='0.7'/%3E%3Cpath d='M10,90 Q6,78 15,74 Q24,70 27,80 Q33,73 40,77 Q47,84 42,94 Q36,102 27,106 Q16,98 10,90Z' fill='%23f48fb1' opacity='0.7'/%3E%3Ccircle cx='27' cy='87' r='3' fill='%23ffe082' opacity='0.7'/%3E%3Cpath d='M80,75 Q77,65 85,62 Q93,59 95,67 Q100,62 106,65 Q112,71 108,79 Q103,86 95,90 Q85,84 80,75Z' fill='%23fce4ec' opacity='0.9'/%3E%3Ccircle cx='95' cy='74' r='2.5' fill='%23ffcc80' opacity='0.7'/%3E%3Cpath d='M50,110 Q47,100 55,97 Q63,94 65,102 Q70,97 76,100 Q82,106 78,114 Q73,121 65,125 Q55,119 50,110Z' fill='%23f48fb1' opacity='0.6'/%3E%3C/svg%3E"); background-size: contain; background-repeat: no-repeat; background-position: top left; pointer-events: none; }
        [data-theme="cherry-blossom"] .inv-hero::after { content: ""; position: absolute; bottom: 0; right: 0; width: 220px; height: 220px; opacity: 0.9; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 220'%3E%3Cpath d='M190,170 Q185,155 195,150 Q205,145 210,155 Q215,148 223,152 Q230,158 226,170 Q220,180 210,186 Q195,178 190,170Z' fill='%23f8bbd0' opacity='0.9'/%3E%3Ccircle cx='210' cy='165' r='4' fill='%23ffcc80' opacity='0.8'/%3E%3Cpath d='M140,190 Q136,178 145,174 Q154,170 157,180 Q163,173 170,177 Q177,184 172,194 Q166,202 157,206 Q146,198 140,190Z' fill='%23f48fb1' opacity='0.85'/%3E%3Ccircle cx='157' cy='188' r='3.5' fill='%23ffe082' opacity='0.8'/%3E%3Cpath d='M170,140 Q166,128 175,124 Q184,120 187,130 Q193,123 200,127 Q207,134 202,144 Q196,152 187,157 Q176,150 170,140Z' fill='%23f8bbd0' opacity='0.8'/%3E%3Ccircle cx='187' cy='138' r='3' fill='%23ffcc80' opacity='0.7'/%3E%3Cpath d='M110,180 Q107,170 115,167 Q123,164 125,172 Q130,167 136,170 Q142,176 138,184 Q133,191 125,195 Q115,189 110,180Z' fill='%23fce4ec' opacity='0.85'/%3E%3Ccircle cx='125' cy='178' r='2.5' fill='%23ffcc80' opacity='0.7'/%3E%3C/svg%3E"); background-size: contain; background-repeat: no-repeat; background-position: bottom right; pointer-events: none; }
        [data-theme="cherry-blossom"] .inv-hero-subtitle { font-family: var(--font-script); font-size: 1.6rem; letter-spacing: 1px; text-transform: none; color: #2c2c2c; }
        [data-theme="cherry-blossom"] .inv-hero-names { font-family: var(--font-script); font-size: 2.8rem; color: #2c2c2c; }
        [data-theme="cherry-blossom"] .inv-hero-ampersand { font-family: var(--font-script); color: #f0a0b8; font-size: 3.5rem; opacity: 0.5; margin: -10px 0; }
        [data-theme="cherry-blossom"] .inv-hero-date { color: #6b6b6b; font-family: var(--font-body); letter-spacing: 2px; margin-top: 20px; }
        [data-theme="cherry-blossom"] .inv-formal-invite, [data-theme="cherry-blossom"] .inv-love-story, [data-theme="cherry-blossom"] .inv-invitation, [data-theme="cherry-blossom"] .inv-thank-you, [data-theme="cherry-blossom"] .inv-gallery, [data-theme="cherry-blossom"] .inv-custom { background-color: #faf8fa; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'%3E%3Cellipse cx='80' cy='70' rx='5' ry='3' fill='%23f8bbd0' fill-opacity='0.3' transform='rotate(-30 80 70)'/%3E%3Cellipse cx='420' cy='120' rx='4' ry='2.5' fill='%23f48fb1' fill-opacity='0.2' transform='rotate(20 420 120)'/%3E%3Cellipse cx='200' cy='200' rx='5' ry='3' fill='%23fce4ec' fill-opacity='0.35' transform='rotate(-45 200 200)'/%3E%3Cellipse cx='380' cy='280' rx='4' ry='2.5' fill='%23f8bbd0' fill-opacity='0.25' transform='rotate(35 380 280)'/%3E%3Cellipse cx='120' cy='350' rx='5' ry='3' fill='%23f48fb1' fill-opacity='0.2' transform='rotate(-15 120 350)'/%3E%3Cellipse cx='450' cy='400' rx='4' ry='2.5' fill='%23fce4ec' fill-opacity='0.3' transform='rotate(40 450 400)'/%3E%3C/svg%3E"); background-repeat: repeat; background-size: 500px 500px; border-top: none; border-bottom: none; }
        [data-theme="cherry-blossom"] .inv-formal-invite::before, [data-theme="cherry-blossom"] .inv-love-story::before, [data-theme="cherry-blossom"] .inv-invitation::before, [data-theme="cherry-blossom"] .inv-thank-you::before, [data-theme="cherry-blossom"] .inv-gallery::before, [data-theme="cherry-blossom"] .inv-custom::before { content: ""; position: absolute; top: 0; left: 0; width: 150px; height: 150px; opacity: 0.6; pointer-events: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 150'%3E%3Cpath d='M20,40 Q16,28 25,24 Q34,20 37,30 Q43,23 50,27 Q57,34 52,44 Q46,52 37,57 Q26,50 20,40Z' fill='%23f8bbd0' opacity='0.7'/%3E%3Ccircle cx='37' cy='38' r='3' fill='%23ffcc80' opacity='0.6'/%3E%3Cpath d='M60,15 Q57,6 64,3 Q71,0 73,7 Q78,2 83,5 Q88,10 85,17 Q80,23 73,26 Q64,21 60,15Z' fill='%23f48fb1' opacity='0.6'/%3E%3Ccircle cx='73' cy='13' r='2.5' fill='%23ffe082' opacity='0.5'/%3E%3Cpath d='M5,70 Q2,62 8,59 Q14,56 16,62 Q20,58 25,60 Q30,65 27,71 Q23,76 16,79 Q9,75 5,70Z' fill='%23fce4ec' opacity='0.6'/%3E%3C/svg%3E"); background-size: contain; background-repeat: no-repeat; background-position: top left; }
        [data-theme="cherry-blossom"] .inv-formal-invite::after, [data-theme="cherry-blossom"] .inv-love-story::after, [data-theme="cherry-blossom"] .inv-invitation::after, [data-theme="cherry-blossom"] .inv-thank-you::after, [data-theme="cherry-blossom"] .inv-gallery::after, [data-theme="cherry-blossom"] .inv-custom::after { content: ""; position: absolute; bottom: 0; right: 0; width: 150px; height: 150px; opacity: 0.6; pointer-events: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 150'%3E%3Cpath d='M130,110 Q126,98 135,94 Q144,90 147,100 Q153,93 160,97 Q167,104 162,114 Q156,122 147,127 Q136,120 130,110Z' fill='%23f8bbd0' opacity='0.7'/%3E%3Ccircle cx='147' cy='108' r='3' fill='%23ffcc80' opacity='0.6'/%3E%3Cpath d='M95,130 Q92,122 99,119 Q106,116 108,123 Q113,118 118,121 Q123,127 119,134 Q114,140 108,143 Q99,138 95,130Z' fill='%23f48fb1' opacity='0.6'/%3E%3Ccircle cx='108' cy='129' r='2.5' fill='%23ffe082' opacity='0.5'/%3E%3C/svg%3E"); background-size: contain; background-repeat: no-repeat; background-position: bottom right; }
        [data-theme="cherry-blossom"] .inv-card { background: rgba(255,255,255,0.75); border: 1px solid rgba(196,116,142,0.15); }
        [data-theme="cherry-blossom"] .inv-rsvp { background: #8b4060; background-image: radial-gradient(ellipse at 10% 20%, rgba(196,116,142,0.3) 0%, transparent 40%), radial-gradient(ellipse at 90% 80%, rgba(240,160,184,0.15) 0%, transparent 40%); }
        [data-theme="cherry-blossom"] .inv-rsvp-btn { background: #e8a0b8; color: #8b4060; }
        [data-theme="cherry-blossom"] .inv-formal-invite { border-top: 2px solid #e8a0b8; }
        [data-theme="cherry-blossom"] .inv-thank-you { border-bottom: 2px solid #e8a0b8; }
        [data-theme="cherry-blossom"] .inv-formal-divider { color: #e8a0b8; }
        [data-theme="cherry-blossom"] .inv-formal-divider::before, [data-theme="cherry-blossom"] .inv-formal-divider::after { background: linear-gradient(to right, transparent, #e8a0b8, transparent); }
        [data-theme="cherry-blossom"] .inv-timeline::before { background: #e8a0b8; }
        [data-theme="cherry-blossom"] .inv-timeline-item::before { background: #e8a0b8; box-shadow: 0 0 0 2px #e8a0b8; }
        [data-theme="cherry-blossom"] .inv-timeline-date { color: #c4748e; }
        [data-theme="cherry-blossom"] .inv-love-story .inv-section-title::after, [data-theme="cherry-blossom"] .inv-invitation .inv-invitation-subtitle::after, [data-theme="cherry-blossom"] .inv-gallery .inv-section-title::after, [data-theme="cherry-blossom"] .inv-thank-you .inv-section-title::after { color: #e8a0b8; }
    `;
}

// ===== SAVE / LOAD (Named Drafts) =====
function getAllDrafts() {
    const raw = localStorage.getItem('wedding-drafts-collection');
    if (!raw) return [];
    try { return JSON.parse(raw); } catch(e) { return []; }
}

function saveAllDrafts(drafts) {
    try {
        localStorage.setItem('wedding-drafts-collection', JSON.stringify(drafts));
        return true;
    } catch (e) {
        console.error('Failed to save drafts:', e);
        if (e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014) {
            alert('⚠️ Storage full! Your images/music data is too large for browser storage.\n\nTips:\n• Use smaller images\n• Remove unused photo slots\n• Delete old drafts first (Load → Delete)\n• Music files are not saved in drafts');
        } else {
            alert('⚠️ Failed to save draft: ' + e.message);
        }
        return false;
    }
}

function openSaveModal() {
    document.getElementById('save-draft-name').value = '';
    openModal('modal-save-draft');
    // Focus the input
    setTimeout(() => document.getElementById('save-draft-name').focus(), 100);
}

function saveDraftWithName() {
    const nameInput = document.getElementById('save-draft-name');
    const name = nameInput.value.trim();
    if (!name) {
        alert('Please enter a name for this draft.');
        nameInput.focus();
        return;
    }

    const drafts = getAllDrafts();
    
    // Check if name already exists
    const existingIndex = drafts.findIndex(d => d.name === name);
    // Save music settings but not the base64 audio data (too large for localStorage)
    const savedMusicSettings = JSON.parse(JSON.stringify(musicSettings));
    if (savedMusicSettings.sourceType === 'file' && savedMusicSettings.source && savedMusicSettings.source.length > 100000) {
        savedMusicSettings.source = '';
        savedMusicSettings.enabled = false;
        savedMusicSettings._note = 'Audio file too large for storage. Re-upload after loading.';
    }
    
    const draftData = {
        name: name,
        savedAt: new Date().toISOString(),
        theme: currentTheme,
        sections: JSON.parse(JSON.stringify(sections)),
        musicSettings: savedMusicSettings
    };

    if (existingIndex >= 0) {
        if (confirm('A draft with this name already exists. Overwrite it?')) {
            drafts[existingIndex] = draftData;
        } else {
            return;
        }
    } else {
        drafts.unshift(draftData);
    }

    if (saveAllDrafts(drafts)) {
        closeModal('modal-save-draft');
        alert('Draft "' + name + '" saved successfully!');
    }
}

function openLoadModal() {
    const drafts = getAllDrafts();
    const listEl = document.getElementById('drafts-list');

    if (drafts.length === 0) {
        listEl.innerHTML = '<div class="no-drafts">No saved drafts yet.<br><small>Use the Save button to create your first draft.</small></div>';
    } else {
        listEl.innerHTML = drafts.map((draft, i) => {
            const date = new Date(draft.savedAt);
            const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const themeLabel = draft.theme === 'cherry-blossom' ? 'Cherry Blossom' : draft.theme === 'eucalyptus' ? 'Eucalyptus' : draft.theme === 'spanish-garden' ? 'Spanish Garden' : 'Luxurious Blue';
            return `
                <div class="draft-item">
                    <div class="draft-item-info">
                        <div class="draft-item-name">${escapeHtml(draft.name)}</div>
                        <div class="draft-item-date">${dateStr} &bull; ${themeLabel} &bull; ${draft.sections ? draft.sections.length : 0} sections</div>
                    </div>
                    <div class="draft-item-actions">
                        <button class="btn-load-draft" onclick="loadDraftByIndex(${i})">Load</button>
                        <button class="btn-delete-draft" onclick="deleteDraftByIndex(${i})">Delete</button>
                    </div>
                </div>`;
        }).join('');
    }

    openModal('modal-load-draft');
}

function loadDraftByIndex(index) {
    const drafts = getAllDrafts();
    if (!drafts[index]) return;

    const draft = drafts[index];
    if (!confirm('Load draft "' + draft.name + '"? Any unsaved changes will be lost.')) return;

    sections = draft.sections || sections;
    musicSettings = draft.musicSettings || musicSettings;
    if (draft.theme) {
        currentTheme = draft.theme;
        document.getElementById('theme-select').value = currentTheme;
        changeTheme(currentTheme);
    }

    closeModal('modal-load-draft');
    renderAll();
    updateMusicButton();
}

function deleteDraftByIndex(index) {
    const drafts = getAllDrafts();
    if (!drafts[index]) return;

    if (!confirm('Delete draft "' + drafts[index].name + '"? This cannot be undone.')) return;

    drafts.splice(index, 1);
    saveAllDrafts(drafts);
    // Re-render the list
    openLoadModal();
}

// ===== FULL PREVIEW =====
function showFullPreview() {
    openModal('modal-full-preview');
    const body = document.getElementById('full-preview-body');
    body.innerHTML = '<div class="preview-frame" style="max-width:480px;width:100%;"></div>';
    renderPreview(body.querySelector('.preview-frame'));
}

// ===== HELPERS =====
function escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
function escapeAttr(text) { return text.replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// ===== RENDER ALL =====
function renderAll() { renderEditorPanel(); renderPreview(); }

// ===== GUEST LINK GENERATOR =====
function openGuestLinksModal() {
    openModal('modal-guest-links');
}

function generateGuestLinks() {
    const baseUrl = document.getElementById('guest-link-site').value;
    const namesText = document.getElementById('guest-names-input').value.trim();
    
    if (!namesText) {
        alert('Please enter at least one guest name.');
        return;
    }
    
    const names = namesText.split('\n').filter(n => n.trim());
    const links = names.map(name => {
        const encoded = encodeURIComponent(name.trim());
        return name.trim() + '\n  ' + baseUrl + '?guest=' + encoded;
    }).join('\n\n');
    
    document.getElementById('guest-links-result').value = links;
    document.getElementById('guest-links-output').style.display = 'block';
}

function copyGuestLinks() {
    const textarea = document.getElementById('guest-links-result');
    textarea.select();
    document.execCommand('copy');
    
    // Also try modern API
    if (navigator.clipboard) {
        navigator.clipboard.writeText(textarea.value);
    }
    
    alert('Links copied to clipboard!');
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-add-section').addEventListener('click', () => openModal('modal-add-section'));
    document.getElementById('btn-preview').addEventListener('click', showFullPreview);
    document.getElementById('btn-export').addEventListener('click', exportHTML);
    document.getElementById('btn-publish').addEventListener('click', publishInvitation);
    document.getElementById('btn-save').addEventListener('click', openSaveModal);
    document.getElementById('btn-load').addEventListener('click', openLoadModal);
    document.getElementById('btn-guest-links').addEventListener('click', openGuestLinksModal);
    document.getElementById('btn-music').addEventListener('click', openMusicModal);
    document.getElementById('btn-save-section').addEventListener('click', saveCurrentSection);

    document.querySelectorAll('.section-type-card').forEach(card => {
        card.addEventListener('click', function() { addSection(this.dataset.type); });
    });

    // Load last used theme
    const savedTheme = localStorage.getItem('wedding-invitation-theme');
    if (savedTheme) currentTheme = savedTheme;

    loadTheme();
    renderAll();
    updateMusicButton();
});
