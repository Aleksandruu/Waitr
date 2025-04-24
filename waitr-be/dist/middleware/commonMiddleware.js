"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFields = void 0;
const validateFields = (fields, body) => {
    const fieldNames = Object.keys(fields);
    const missingFields = fieldNames.filter((field) => !body[field]);
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }
};
exports.validateFields = validateFields;
