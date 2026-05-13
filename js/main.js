// ===== GOOGLE APPS SCRIPT URL =====
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/useTrigger';

// ===== DOM ELEMENTS =====
const toField = document.getElementById('toField');
const fromField = document.getElementById('fromField');
const messageField = document.getElementById('messageField');
const sendBtn = document.getElementById('sendBtn');
const flowerOptions = document.querySelectorAll('.flower-option');
const handwritingOptions = document.querySelectorAll('.handwriting-option');
const successMessage = document.getElementById('successMessage');

const previewTo = document.getElementById('previewTo');
const previewFrom = document.getElementById('previewFrom');
const previewMessage = document.getElementById('previewMessage');
const previewFlower = document.getElementById('previewFlower');

let selectedFlower = '🌸';
let selectedFont = 'normal';

// ===== UPDATE CHARACTER COUNTERS =====
toField.addEventListener('input', (e) => {
    const next = e.target.nextElementSibling;
    next.textContent = `${e.target.value.length}/25`;
    previewTo.textContent = e.target.value || 'You';
});

fromField.addEventListener('input', (e) => {
    const next = e.target.nextElementSibling;
    next.textContent = `${e.target.value.length}/25`;
    previewFrom.textContent = e.target.value || 'Someone who cares';
});

messageField.addEventListener('input', (e) => {
    const next = e.target.nextElementSibling;
    next.textContent = `${e.target.value.length}/140`;
    
    // Update preview with current font
    previewMessage.textContent = e.target.value || 'Your message will appear here as you type...';
    previewMessage.className = `letter-content ${selectedFont}`;
});

// ===== FLOWER SELECTION =====
flowerOptions.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all
        flowerOptions.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked
        btn.classList.add('active');
        
        // Update flower
        selectedFlower = btn.dataset.flower;
        previewFlower.textContent = selectedFlower;
    });
});

// Set first flower as active by default
if (flowerOptions.length > 0) {
    flowerOptions[0].classList.add('active');
}

// ===== HANDWRITING SELECTION =====
handwritingOptions.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all
        handwritingOptions.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked
        btn.classList.add('active');
        
        // Update font
        selectedFont = btn.dataset.font;
        
        // Update preview message font
        if (messageField.value) {
            previewMessage.className = `letter-content ${selectedFont}`;
        }
    });
});

// Set first handwriting as active by default
if (handwritingOptions.length > 0) {
    handwritingOptions[0].classList.add('active');
}

// ===== FORM SUBMISSION =====
sendBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!toField.value.trim() || !messageField.value.trim()) {
        alert('⚠️ Please fill in "To" and "Your message" fields');
        return;
    }
    
    // Disable send button
    const originalText = sendBtn.textContent;
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';
    
    // Prepare data
    const letterData = {
        to: toField.value.trim(),
        from: fromField.value.trim() || 'Anonymous',
        message: messageField.value.trim(),
        flower: selectedFlower,
        font: selectedFont,
        timestamp: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    try {
        // Send to Google Apps Script
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(letterData)
        });
        
        // Show success
        successMessage.style.display = 'block';
        
        // Reset form
        setTimeout(() => {
            toField.value = '';
            fromField.value = '';
            messageField.value = '';
            toField.nextElementSibling.textContent = '0/25';
            fromField.nextElementSibling.textContent = '0/25';
            messageField.nextElementSibling.textContent = '0/140';
            
            previewTo.textContent = 'You';
            previewFrom.textContent = 'Someone who cares';
            previewMessage.textContent = 'Your message will appear here as you type...';
            previewFlower.textContent = '🌸';
            
            selectedFlower = '🌸';
            selectedFont = 'normal';
            
            flowerOptions.forEach((btn, idx) => {
                btn.classList.toggle('active', idx === 0);
            });
            
            handwritingOptions.forEach((btn, idx) => {
                btn.classList.toggle('active', idx === 0);
            });
            
            previewMessage.className = 'letter-content normal';
            
            sendBtn.disabled = false;
            sendBtn.textContent = originalText;
            
            // Hide success after 3 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        }, 500);
        
    } catch (error) {
        console.error('Error:', error);
        sendBtn.disabled = false;
        sendBtn.textContent = originalText;
        alert('❌ Something went wrong. Please make sure you updated the DEPLOYMENT_ID correctly.');
    }
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        sendBtn.click();
    }
});