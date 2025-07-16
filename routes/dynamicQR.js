const express = require('express');
const Joi = require('joi');
const { createDynamicQR } = require('../utils/qrUtils');

const router = express.Router();

/**
 * @typedef {Object} DynamicQRRequest
 * @property {string} txt - Chuỗi mã QR tĩnh của người dùng (query parameter)
 * @property {number} amount - Số tiền giao dịch sẽ được bao gồm trong mã QR (query parameter)
 */

/**
 * @typedef {string} DynamicQRResponse - Mã QR động đã tạo (dưới dạng text thuần)
 */

const requestSchema = Joi.object({
    txt: Joi.string().required().min(1).messages({
        'string.empty': 'Chuỗi QR tĩnh không được để trống',
        'any.required': 'Chuỗi QR tĩnh là bắt buộc'
    }),
    amount: Joi.number().positive().required().messages({
        'number.positive': 'Số tiền phải lớn hơn 0',
        'any.required': 'Số tiền là bắt buộc'
    })
});

/**
 * Tạo mã QR động từ mã QR tĩnh và số tiền giao dịch
 * @param {import("express").Request} req - Request object
 * @param {import("express").Response} res - Response object chứa dynamicQR dưới dạng text thuần
 * @returns {Promise<void>}
 */
async function generateDynamicQR(req, res) {
    try {
        const { txt, amount } = req.query;
        
        // Convert amount to number if it's provided as string
        const requestData = {
            txt,
            amount: amount ? Number(amount) : undefined
        };
        
        const { error, value } = requestSchema.validate(requestData);
        
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const { txt: validTxt, amount: validAmount } = value;

        const dynamicQR = createDynamicQR(validTxt, validAmount);

        res.send(dynamicQR);

    } catch (error) {
        console.error('Error generating dynamic QR:', error);
        
        res.status(500).send(error.message || 'Đã xảy ra lỗi khi tạo mã QR động');
    }
}

router.get('/generate', generateDynamicQR);

router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Dynamic QR API is running',
        timestamp: new Date().toISOString()
    });
});

module.exports = router; 