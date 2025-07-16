const request = require('supertest');
const app = require('../app');

describe('Dynamic QR API', () => {
    test('GET /api/dynamic-qr/health should return API status', async () => {
        const response = await request(app)
            .get('/api/dynamic-qr/health')
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Dynamic QR API is running');
        expect(response.body.timestamp).toBeDefined();
    });

    test('GET /api/dynamic-qr/generate should create dynamic QR successfully', async () => {
        const txt = '00020101021238540010A00000072701270006970454011639565802VN5309Tran Duy6008Ho Chi Minh610870000630466E4';
        const amount = 50000;

        const response = await request(app)
            .get('/api/dynamic-qr/generate')
            .query({ txt, amount })
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.dynamicQR).toBeDefined();
        expect(response.body.originalQR).toBe(txt);
        expect(response.body.amount).toBe(amount);
    });

    test('GET /api/dynamic-qr/generate should return error for missing txt', async () => {
        const response = await request(app)
            .get('/api/dynamic-qr/generate')
            .query({ amount: 50000 })
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('bắt buộc');
    });

    test('GET /api/dynamic-qr/generate should return error for invalid amount', async () => {
        const txt = '00020101021238540010A00000072701270006970454011639565802VN5309Tran Duy6008Ho Chi Minh610870000630466E4';
        const amount = -1000;

        const response = await request(app)
            .get('/api/dynamic-qr/generate')
            .query({ txt, amount })
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('lớn hơn 0');
    });

    test('GET /api/dynamic-qr/generate should handle string amount parameter', async () => {
        const txt = '00020101021238540010A00000072701270006970454011639565802VN5309Tran Duy6008Ho Chi Minh610870000630466E4';
        const amount = '25000'; // String amount

        const response = await request(app)
            .get('/api/dynamic-qr/generate')
            .query({ txt, amount })
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.dynamicQR).toBeDefined();
        expect(response.body.amount).toBe(25000); // Should be converted to number
    });

    test('GET / should return API info', async () => {
        const response = await request(app)
            .get('/')
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Dynamic QR API Server');
        expect(response.body.endpoints).toBeDefined();
    });

    test('GET /nonexistent should return 404', async () => {
        const response = await request(app)
            .get('/nonexistent')
            .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('không tìm thấy');
    });
}); 