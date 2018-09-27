import * as yup from "yup";

export const shortPassword = "password must be at least 3 characters";
export const invalidEmail = "email must be a valid email";

export const registerPasswordValidation = yup
  .string()
  .min(3, shortPassword)
  .max(255)
  .required();

export const validUserSchema = yup.object().shape({
  email: yup
    .string()
    .email(invalidEmail)
    .required(),
  password: registerPasswordValidation
});
