# 💌 Digital Stationery - Viết Thư Online

Một website tương tác để viết và gửi thư online với hiệu ứng live preview thời gian thực.

## ✨ Tính Năng Chính

✅ **Live Preview** - Cập nhật real-time khi nhập nội dung  
✅ **Handwriting Fonts** - 8 loại font chữ khác nhau từ Google Fonts  
✅ **Flower Decorations** - 8 biểu tượng hoa để chọn  
✅ **Image Upload** - Upload ảnh đính kèm với preview  
✅ **Google Sheets Integration** - Lưu trữ dữ liệu an toàn  
✅ **Secret Gallery** - Trang xem thư riêng cho chủ sở hữu  
✅ **Responsive Design** - Hoạt động trên desktop, tablet, mobile  
✅ **Beautiful Animations** - Các hiệu ứng hover và transition mượt mà

## 🚀 Cách Setup

### Bước 1: Clone Repository
```bash
git clone https://github.com/luuthaonhi08/digital-stationery.git
cd digital-stationery
```

### Bước 2: Tạo Google Apps Script
1. Vào [script.google.com](https://script.google.com)
2. Tạo project mới
3. Copy toàn bộ code từ `google-apps-script.js` vào editor
4. Click **Deploy** → **New deployment**
5. Select **Web app**
   - Execute as: Your Account
   - Who has access: Anyone
6. Copy **Deployment URL** (ví dụ: `https://script.google.com/macros/d/ABCD123456789/useTrigger`)

### Bước 3: Cập Nhật Deployment ID

Thay `YOUR_DEPLOYMENT_ID` trong hai file:

**js/main.js (dòng 2)**
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/d/DEPLOYMENT_ID/useTrigger';
```

**js/gallery.js (dòng 2)**
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/d/DEPLOYMENT_ID/useTrigger';
```

### Bước 4: Deploy Website

Bạn có thể deploy lên:
- **Netlify** - Kéo thả folder
- **GitHub Pages** - Push lên branch `gh-pages`
- **Vercel** - Kết nối GitHub
- **Server riêng** - Upload FTP

## 📝 Cấu Trúc File

```
digital-stationery/
├── index.html              # Trang viết thư chính
├── gallery.html            # Trang tổng hợp thư (bí mật)
├── css/
│   ├── style.css           # Styles chung
│   └── gallery.css         # Styles cho trang gallery
├── js/
│   ├── main.js             # Logic trang viết thư
│   └── gallery.js          # Logic trang gallery
├── google-apps-script.js   # Google Apps Script code
└── README.md               # Hướng dẫn này
```

## 🔐 Bảo Mật

- **Gallery URL**: Đổi tên `gallery.html` thành tên bí mật để chỉ người biết mới có thể truy cập
- **Data Validation**: Tất cả dữ liệu nhập vào đều được escape để ngăn XSS
- **File Size Limit**: Ảnh tải lên bị giới hạn max 5MB

## 🎨 Tùy Chỉnh

### Đổi Màu Sắc
Mở `css/style.css` và tìm các mã màu:
- `#d4a574` - Màu chính (nâu vàng)
- `#5a4a42` - Màu chữ (nâu đậm)
- `#fffbf7` - Màu nền (trắng ấm)

### Thêm Font Mới
Trong `index.html`, thêm font từ Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT:wght@400;700&display=swap" rel="stylesheet">
```

Rồi thêm option vào select:
```html
<option value="yourfont">Your Font Name</option>
```

Và thêm CSS class trong `css/style.css`:
```css
.letter-content.yourfont {
    font-family: 'Your Font', cursive;
    font-size: 18px;
}
```

## 📱 Responsive Design

- **Desktop (1024px+)**: Layout 2 cột (Form + Preview)
- **Tablet (768px - 1023px)**: Layout 1 cột, cuộn dọc
- **Mobile (480px - 767px)**: Tối ưu hóa cho điện thoại
- **Very Small (< 480px)**: Font nhỏ hơn, các nút compact

## 🤝 Đóng Góp

Nếu bạn có ý tưởng cải thiện, hãy tạo issue hoặc pull request!

## 📄 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

## 👤 Tác Giả

Tạo bởi **Lưu Thảo Nhi** (@luuthaonhi08)

---

**Hãy gửi những lá thư đặc biệt của bạn! 💌✨**
