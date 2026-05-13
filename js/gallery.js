// ===== GOOGLE APPS SCRIPT URL =====
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/useTrigger';

const letterGallery = document.getElementById('letterGallery');
const emptyState = document.getElementById('emptyState');
const letterModal = document.getElementById('letterModal');
const closeBtn = document.querySelector('.close-btn');

// ===== LOAD LETTERS FROM GOOGLE SHEETS =====
async function loadLetters() {
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL + '?action=getLetters');
        const data = await response.json();

        if (!data.letters || data.letters.length === 0) {
            emptyState.style.display = 'block';
            letterGallery.innerHTML = '';
            return;
        }

        // Clear existing letters
        letterGallery.innerHTML = '';
        emptyState.style.display = 'none';

        // Render each letter
        data.letters.forEach(letter => {
            const letterCard = createLetterCard(letter);
            letterGallery.appendChild(letterCard);
        });

    } catch (error) {
        console.error('Error loading letters:', error);
        emptyState.textContent = '❌ Lỗi khi tải thư. Vui lòng thử lại!\nChắc chắn bạn đã cập nhật DEPLOYMENT_ID chưa?';
        emptyState.style.display = 'block';
    }
}

// ===== CREATE LETTER CARD =====
function createLetterCard(letter) {
    const card = document.createElement('div');
    card.className = 'letter-card';
    
    // Determine font class
    const fontClass = letter.font || 'default';
    
    // Escape HTML to prevent XSS
    const escapedTo = escapeHtml(letter.to);
    const escapedFrom = escapeHtml(letter.from);
    const escapedMessage = escapeHtml(letter.message);
    
    card.innerHTML = `
        <div class="letter-card-header">
            <div class="letter-card-to">📬 ${escapedTo}</div>
            <div class="letter-card-from">từ ${escapedFrom}</div>
        </div>
        <div class="letter-card-body">
            <div class="letter-card-flower">${letter.flower}</div>
            <div class="letter-card-preview">${escapedMessage}</div>
            <div class="letter-card-date">${letter.timestamp}</div>
            ${letter.image ? `<img src="${letter.image}" class="letter-card-image" alt="Attached image">` : ''}
        </div>
    `;

    // Open modal on click
    card.addEventListener('click', () => {
        openLetterModal(letter, fontClass);
    });

    return card;
}

// ===== OPEN LETTER MODAL =====
function openLetterModal(letter, fontClass) {
    document.getElementById('modalTo').textContent = letter.to;
    document.getElementById('modalFrom').textContent = letter.from;
    document.getElementById('modalDate').textContent = letter.timestamp;
    
    const messageEl = document.getElementById('modalMessage');
    messageEl.textContent = letter.message;
    messageEl.className = `modal-letter-content letter-content ${fontClass}`;

    // Show image if exists
    const imageContainer = document.getElementById('modalImageContainer');
    if (letter.image) {
        imageContainer.style.display = 'block';
        document.getElementById('modalImage').src = letter.image;
    } else {
        imageContainer.style.display = 'none';
    }

    letterModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// ===== CLOSE MODAL =====
closeBtn.addEventListener('click', () => {
    letterModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

letterModal.addEventListener('click', (e) => {
    if (e.target === letterModal) {
        letterModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// ===== ESCAPE KEY TO CLOSE MODAL =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        letterModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// ===== ESCAPE HTML =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== LOAD LETTERS ON PAGE LOAD =====
window.addEventListener('load', loadLetters);

// ===== AUTO-REFRESH EVERY 5 SECONDS =====
setInterval(loadLetters, 5000);