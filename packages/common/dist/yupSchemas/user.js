"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yup = require("yup");
exports.shortPassword = "password must be at least 3 characters";
exports.invalidEmail = "email must be a valid email";
exports.registerPasswordValidation = yup
    .string()
    .min(3, exports.shortPassword)
    .max(255)
    .required();
exports.validUserSchema = yup.object().shape({
    email: yup
        .string()
        .email(exports.invalidEmail)
        .required(),
    password: exports.registerPasswordValidation
});
//# sourceMappingURL=user.js.map