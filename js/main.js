// ===== GOOGLE APPS SCRIPT URL =====
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/useTrigger';

// ===== GLOBAL VARIABLES =====
const toField = document.getElementById('toField');
const fromField = document.getElementById('fromField');
const messageField = document.getElementById('messageField');
const fontSelect = document.getElementById('fontSelect');
const flowerButtons = document.querySelectorAll('.flower-btn');
const imageUpload = document.getElementById('imageUpload');
const letterForm = document.getElementById('letterForm');
const charCount = document.getElementById('charCount');

const previewTo = document.getElementById('previewTo');
const previewFrom = document.getElementById('previewFrom');
const previewMessage = document.getElementById('previewMessage');
const previewFlower = document.getElementById('previewFlower');
const previewImage = document.getElementById('previewImage');
const previewSigner = document.getElementById('previewSigner');
const previewSignerName = document.getElementById('previewSignerName');
const successMessage = document.getElementById('successMessage');

let selectedFlower = '🌸';
let uploadedImageBase64 = '';

// ===== LIVE PREVIEW UPDATES =====

// Real-time update "To" field
toField.addEventListener('input', (e) => {
    previewTo.textContent = e.target.value || 'Người nhận';
});

// Real-time update "From" field
fromField.addEventListener('input', (e) => {
    previewFrom.textContent = e.target.value || 'Người gửi';
    previewSignerName.textContent = e.target.value ? `❤️` : '❤️';
});

// Real-time update Message with character count
messageField.addEventListener('input', (e) => {
    const text = e.target.value;
    previewMessage.textContent = text || 'Nội dung thư của bạn sẽ xuất hiện tại đây...';
    charCount.textContent = text.length;
});

// Font selection update
fontSelect.addEventListener('change', (e) => {
    const fontClass = e.target.value;
    previewMessage.className = `letter-content ${fontClass}`;
});

// Flower selection
flowerButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all buttons
        flowerButtons.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Update selected flower
        selectedFlower = btn.dataset.flower;
        previewFlower.textContent = selectedFlower;
    });
});

// Image upload with preview
imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('⚠️ File quá lớn! Vui lòng chọn ảnh dưới 5MB');
            imageUpload.value = '';
            previewImage.style.display = 'none';
            uploadedImageBase64 = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            uploadedImageBase64 = event.target.result;
            previewImage.src = uploadedImageBase64;
            previewImage.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        previewImage.style.display = 'none';
        previewImage.src = '';
        uploadedImageBase64 = '';
        if (file) {
            alert('⚠️ Vui lòng chọn một file hình ảnh hợp lệ (JPG, PNG, GIF)!');
        }
    }
});

// ===== FORM SUBMISSION =====
letterForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!toField.value.trim() || !fromField.value.trim() || !messageField.value.trim()) {
        alert('❌ Vui lòng điền đầy đủ thông tin: Gửi đến, Từ, và Nội dung thư');
        return;
    }

    // Disable send button during submission
    const sendBtn = document.querySelector('.send-btn');
    const originalText = sendBtn.textContent;
    sendBtn.disabled = true;
    sendBtn.textContent = '⏳ Đang gửi...';

    // Prepare data for Google Sheets
    const letterData = {
        to: toField.value.trim(),
        from: fromField.value.trim(),
        message: messageField.value.trim(),
        flower: selectedFlower,
        font: fontSelect.value,
        timestamp: new Date().toLocaleString('vi-VN'),
        image: uploadedImageBase64 // Base64 image data
    };

    try {
        // Send data to Google Apps Script
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(letterData)
        });

        // Show success message
        successMessage.style.display = 'block';
        successMessage.textContent = '✅ Thư của bạn đã được gửi vào hòm thư bí mật!';

        // Reset form
        setTimeout(() => {
            letterForm.reset();
            previewTo.textContent = 'Người nhận';
            previewFrom.textContent = 'Người gửi';
            previewMessage.textContent = 'Nội dung thư của bạn sẽ xuất hiện tại đây...';
            previewFlower.textContent = '🌸';
            previewImage.style.display = 'none';
            previewMessage.className = 'letter-content default';
            fontSelect.value = 'default';
            selectedFlower = '🌸';
            uploadedImageBase64 = '';
            flowerButtons.forEach(btn => btn.classList.remove('active'));
            charCount.textContent = '0';
            sendBtn.disabled = false;
            sendBtn.textContent = originalText;

            // Hide success message after 3 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        }, 500);

    } catch (error) {
        console.error('Lỗi khi gửi thư:', error);
        sendBtn.disabled = false;
        sendBtn.textContent = originalText;
        alert('❌ Có lỗi xảy ra. Vui lòng thử lại!\nChắc chắn bạn đã cập nhật DEPLOYMENT_ID chưa?');
    }
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter để gửi thư
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        letterForm.dispatchEvent(new Event('submit'));
    }
});