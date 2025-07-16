# Dynamic QR API

API để tạo mã QR động từ mã QR tĩnh VietQR với số tiền giao dịch cụ thể.

## 🔧 Cài đặt và chạy local

```bash
# Cài đặt dependencies
npm install

# Chạy server
npm start

# Chạy development mode
npm run dev
```

Server sẽ chạy trên port 3000.

## 🚀 Deploy Netlify Functions

- Đã có sẵn function tại: `netlify/functions/dynamic-qr.js`
- Khi deploy lên Netlify, endpoint sẽ là:
  ```
  https://<your-netlify-site>.netlify.app/.netlify/functions/dynamic-qr?txt=...&amount=...
  ```
- Không cần build, chỉ cần push code lên GitHub và kết nối với Netlify.
- **Functions directory:** `netlify/functions`

## 📱 Cách lấy originalQR (txt parameter)

**Bước 1:** Vào app ngân hàng của bạn

**Bước 2:** Chọn tài khoản bạn muốn tạo QR thanh toán

**Bước 3:** Tải QR code của tài khoản đó về

**Bước 4:** Dùng app scan QR code để lấy text

➡️ **Text đó chính là originalQR** - hay chính là field `txt` cần truyền trong API.

## 📱 Cách triển khai trên IOS bằng Shortcuts
<img width="985" height="980" alt="image" src="https://github.com/user-attachments/assets/3f36a5ad-45ff-443a-a1ab-39cf4a8e66aa" />


## 🚀 Cách sử dụng API

### Endpoint: GET /api/dynamic-qr/generate (local) hoặc /.netlify/functions/dynamic-qr (Netlify)

**Query Parameters:**
- `txt` (string, required): Chuỗi mã QR tĩnh VietQR (originalQR)
- `amount` (number, required): Số tiền giao dịch (phải > 0)

**Example:**
```bash
curl "http://localhost:3000/api/dynamic-qr/generate?txt=00020101021238540010A00000072701270006970454011639565802VN5309Tran%20Duy6008Ho%20Chi%20Minh610870000630466E4&amount=50000"

# Hoặc trên Netlify:
curl "https://<your-netlify-site>.netlify.app/.netlify/functions/dynamic-qr?txt=...&amount=..."
```

**Response:**
```
00020101021238540010A00000072701270006970454011639565405500005802VN5309Tran Duy6008Ho Chi Minh6108700006304228B
```

### Health Check

```bash
curl http://localhost:3000/api/dynamic-qr/health
```

## 🧪 Test API

```bash
# Test với example script
npm run example

# Chạy unit tests
npm test
```

## 📝 Lưu ý

- API sẽ tự động tính toán CRC-16/CCITT-FALSE theo chuẩn VietQR
- Số tiền phải là số dương
- Chuỗi QR tĩnh phải có định dạng VietQR hợp lệ
