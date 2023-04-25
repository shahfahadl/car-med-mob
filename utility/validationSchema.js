import * as yup from "yup";

export const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Must be type email")
    .max(50)
    .required("Email is required"),
  password: yup.string().max(50).required("Password is required"),
});

export const VendorSignupSchema = yup.object().shape({
  name: yup
    .string()
    .required("name is required")
    .matches(/^[A-Za-z]+$/, "Name must contain alphabets only")
    .max(50),
  cnic: yup
    .string()
    .typeError("CNIC must be valid")
    .required("CNIC is required")
    .length(13, "CNIC must be exactly 13 digits")
    .test(
      "is-number",
      "CNIC must be a valid 13-digit number",
      (value) => !isNaN(Number(value))
    ),
  contact: yup
    .string()
    .typeError("Contact must be valid")
    .required("CNIC is required")
    .min(11)
    .max(14)
    .matches(/^[\d+\s]+$/, "Contact must be valid"),
  email: yup
    .string()
    .email("must be an email")
    .required("email is required")
    .max(50),
  password: yup.string().required("password is required").max(50),
  gender: yup.string().required("Gender is required"),
  origin: yup.mixed().required("Origin is required"),
  skill: yup.string().required("skill is required"),
  image: yup
    .mixed()
    .required("Image is required")
});

export const UserSignupSchema = yup.object().shape({
  name: yup
    .string()
    .required("name is required")
    .matches(/^[A-Za-z]+$/, "Name must contain alphabets only")
    .max(50),
  cnic: yup
    .string()
    .typeError("CNIC must be valid")
    .required("CNIC is required")
    .length(13, "CNIC must be exactly 13 digits")
    .test(
      "is-number",
      "CNIC must be a valid 13-digit number",
      (value) => !isNaN(Number(value))
    ),
  email: yup
    .string()
    .email("must be an email")
    .required("email is required")
    .max(50),
  password: yup
    .string("Email is required")
    .required("password is required")
    .max(50),
  contact: yup
    .string(),
  skill: yup
    .string("Email is required"),
  gender: yup.string().required("Gender is required"),
  image: yup.mixed()
});
