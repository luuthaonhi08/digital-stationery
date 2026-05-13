// Lấy spreadsheet ID từ URL
const SHEET_ID = '127Ul11BJUssZ-UbgloqOIkKZT0leXtLMd0EnCazWZa0'; // ID của Google Sheet
const SHEET_NAME = 'Letters'; // Tên sheet để lưu dữ liệu

// Tạo HTTP endpoint để nhận dữ liệu
function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);
        
        // Mở Google Sheet
        const sheet = SpreadsheetApp.openById(SHEET_ID);
        let ws = sheet.getSheetByName(SHEET_NAME);
        
        // Nếu sheet chưa tồn tại, tạo mới
        if (!ws) {
            ws = sheet.addSheet(SHEET_NAME);
            // Thêm header
            ws.appendRow(['Timestamp', 'To', 'From', 'Message', 'Flower', 'Font', 'Image']);
        }
        
        // Chuẩn bị hàng dữ liệu
        const row = [
            data.timestamp,
            data.to,
            data.from,
            data.message,
            data.flower,
            data.font,
            data.image // Lưu base64 image
        ];
        
        // Append row vào sheet
        ws.appendRow(row);
        
        // Trả về response thành công
        return ContentService.createTextOutput(JSON.stringify({
            status: 'success',
            message: 'Letter saved successfully'
        })).setMimeType(ContentService.MimeType.JSON);
        
    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({
            status: 'error',
            message: error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

// Hàm lấy tất cả các thư
function doGet(e) {
    try {
        const action = e.parameter.action;
        
        if (action === 'getLetters') {
            const sheet = SpreadsheetApp.openById(SHEET_ID);
            const ws = sheet.getSheetByName(SHEET_NAME);
            
            if (!ws) {
                return ContentService.createTextOutput(JSON.stringify({
                    status: 'error',
                    letters: []
                })).setMimeType(ContentService.MimeType.JSON);
            }
            
            const data = ws.getDataRange().getValues();
            const headers = data[0];
            const letters = [];
            
            // Bỏ qua header row
            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                letters.push({
                    timestamp: row[0],
                    to: row[1],
                    from: row[2],
                    message: row[3],
                    flower: row[4],
                    font: row[5],
                    image: row[6] || ''
                });
            }
            
            // Trả về theo thứ tự ngược (thư mới nhất trước)
            letters.reverse();
            
            return ContentService.createTextOutput(JSON.stringify({
                status: 'success',
                letters: letters
            })).setMimeType(ContentService.MimeType.JSON);
        }
        
    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({
            status: 'error',
            message: error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

// Hàm khởi tạo sheet (chạy một lần)
function initializeSheet() {
    const sheet = SpreadsheetApp.openById(SHEET_ID);
    
    // Kiểm tra sheet có tồn tại không
    let ws = sheet.getSheetByName(SHEET_NAME);
    if (!ws) {
        ws = sheet.addSheet(SHEET_NAME);
    }
    
    // Thêm header nếu chưa có
    const range = ws.getRange(1, 1, 1, 7);
    range.setValues([['Timestamp', 'To', 'From', 'Message', 'Flower', 'Font', 'Image']]);
    range.setFontWeight('bold');
    range.setBackgroundColor('#d4a574');
    range.setFontColor('white');
}
