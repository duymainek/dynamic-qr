const { createDynamicQR } = require('../../utils/qrUtils');

exports.handler = async (event) => {
  try {
    const params = event.queryStringParameters || {};
    const txt = params.txt;
    const amount = params.amount ? Number(params.amount) : undefined;

    if (!txt) {
      return {
        statusCode: 400,
        body: 'Chuỗi QR tĩnh là bắt buộc'
      };
    }
    if (!amount || amount <= 0) {
      return {
        statusCode: 400,
        body: 'Số tiền phải lớn hơn 0'
      };
    }

    const dynamicQR = createDynamicQR(txt, amount);
    return {
      statusCode: 200,
      body: dynamicQR
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error.message || 'Đã xảy ra lỗi khi tạo mã QR động'
    };
  }
}; 