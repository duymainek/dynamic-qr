const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api/dynamic-qr';

async function testDynamicQRAPI() {
    console.log('🧪 Testing Dynamic QR API...\n');

    try {
        // Test health endpoint
        console.log('1. Testing health endpoint...');
        const healthResponse = await axios.get(`${API_BASE_URL}/health`);
        console.log('✅ Health check:', healthResponse.data);
        console.log('');

        // Test generate endpoint with valid data
        console.log('2. Testing generate endpoint with valid data...');
        const generateResponse = await axios.get(`${API_BASE_URL}/generate`, {
            params: {
                txt: '00020101021238540010A00000072701270006970454011639565802VN5309Tran Duy6008Ho Chi Minh610870000630466E4',
                amount: 50000
            }
        });
        console.log('✅ Generate dynamic QR:', generateResponse.data);
        console.log('');

        // Test generate endpoint with invalid data
        console.log('3. Testing generate endpoint with invalid data...');
        try {
            await axios.get(`${API_BASE_URL}/generate`, {
                params: {
                    txt: '',
                    amount: -1000
                }
            });
        } catch (error) {
            console.log('✅ Expected error for invalid data:', error.response.data);
        }
        console.log('');

        console.log('🎉 All tests completed successfully!');

    } catch (error) {
        console.error('❌ Error testing API:', error.message);
        console.log('Make sure the server is running on port 3000');
        console.log('Run: npm start or npm run dev');
    }
}

// Chạy test nếu file này được execute trực tiếp
if (require.main === module) {
    testDynamicQRAPI();
}

module.exports = { testDynamicQRAPI }; 