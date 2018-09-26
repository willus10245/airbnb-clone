import * as yup from "yup";
import { shortPassword } from "./modules//user/register/errorMessages";

export const registerPasswordValidation = yup
  .string()
  .min(3, shortPassword)
  .max(255)
  .required();
