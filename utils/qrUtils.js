/**
 * Calculates the CRC-16/CCITT-FALSE checksum for an input string.
 * This algorithm complies with ISO/IEC 13239 as described in the VietQR specification.
 * @param {string} str - The input data string.
 * @returns {string} The calculated CRC as a 4-character uppercase hex string.
 */
function calculateCRC16_CCITT_FALSE(str) {
    let crc = 0xFFFF; // Initial value: 0xFFFF
    const polynomial = 0x1021; // Polynomial: 0x1021

    for (let i = 0; i < str.length; i++) {
        const byte = str.charCodeAt(i);
        crc ^= (byte << 8);
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) {
                crc = (crc << 1) ^ polynomial;
            } else {
                crc <<= 1;
            }
        }
    }
    
    // Return the final 16-bit CRC value as a 4-character hex string
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Creates a dynamic VietQR string from a static QR string and a transaction amount.
 * @param {string} staticQRString - The initial static VietQR string.
 * @param {number} amount - The transaction amount.
 * @returns {string} The final, complete dynamic VietQR string.
 */
function createDynamicQR(staticQRString, amount) {
    // 1. Remove the old CRC field (ID 63), which is always the last 8 characters.
    let baseString = staticQRString.slice(0, -8);

    // 2. Update the Point of Initiation Method (ID 01) from '11' (static) to '12' (dynamic).
    baseString = baseString.replace('010211', '010212');

    // 3. Create the Transaction Amount field (ID 54).
    const amountStr = amount.toString();
    const amountLength = amountStr.length.toString().padStart(2, '0');
    const transactionAmountField = `54${amountLength}${amountStr}`;

    // 4. Insert the amount field before the Country Code field (ID 58).
    const countryCodeIndex = baseString.indexOf('5802VN');
    if (countryCodeIndex === -1) {
        throw new Error("Country Code (ID 58) not found in the QR string.");
    }
    let stringToCRC = baseString.slice(0, countryCodeIndex) + transactionAmountField + baseString.slice(countryCodeIndex);

    // 5. Prepare the string for CRC calculation by appending the CRC field ID and length.
    const stringForCRCCalculation = stringToCRC + '6304';
    
    // 6. Calculate the new CRC for the modified string.
    const newCRC = calculateCRC16_CCITT_FALSE(stringForCRCCalculation);

    // 7. Return the final dynamic QR string with the new CRC appended.
    return stringForCRCCalculation + newCRC;
}

module.exports = {
    calculateCRC16_CCITT_FALSE,
    createDynamicQR
}; 