const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dynamicQRRoutes = require('./routes/dynamicQR');

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        error: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút'
    }
});

app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/dynamic-qr', dynamicQRRoutes);

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Dynamic QR API Server',
        version: '1.0.0',
        endpoints: {
            'GET /api/dynamic-qr/generate': 'Tạo mã QR động',
            'GET /api/dynamic-qr/health': 'Kiểm tra trạng thái API'
        }
    });
});

app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint không tìm thấy'
    });
});

app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        success: false,
        error: 'Đã xảy ra lỗi hệ thống'
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Dynamic QR API Server đang chạy trên port ${PORT}`);
        console.log(`📖 API Documentation: http://localhost:${PORT}`);
        console.log(`🔗 Health Check: http://localhost:${PORT}/api/dynamic-qr/health`);
    });
}

module.exports = app; 