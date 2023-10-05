import * as yup from "yup";

export const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email("Must be type email")
    .max(50)
    .required("Email is required"),
  password: yup.string().max(50).required("Password is required"),
});

export const EmailSchema = yup
  .string()
  .trim()
  .email("Must be type email")
  .max(50)
  .required("Email is required");

export const VendorSignupSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("name is required")
    .matches(/^[A-Za-z ]+$/, "Name must contain alphabets only")
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
  otp: yup.string("OTP is required").required("OTP is required").trim(),
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
  city: yup.string().required("City is required"),
  lat: yup.mixed().required("City is required"),
  lng: yup.mixed().required("City is required"),
  skill: yup.string().required("skill is required"),
  image: yup.mixed().required("Image is required"),
});

export const UserSignupSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("name is required")
    .matches(/^[A-Za-z ]+$/, "Name must contain alphabets only")
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
  otp: yup.string("OTP is required").required("OTP is required").trim(),
  contact: yup.string().required("contact is required"),
  skill: yup.string("Email is required"),
  gender: yup.string().required("Gender is required"),
  profile: yup.mixed(),
});

export const OrderSchema = yup.object().shape({
  problem: yup.string("Problem is required").required("Problem is required"),
  carType: yup.string("Car type is required").required("Car type is required"),
  bid: yup
    .string()
    .typeError("Bid is required")
    .required("Bid is required")
    .test(
      "is-number",
      "Bid must be a number",
      (value) => !isNaN(Number(value))
    ),
  location: yup.string("Location is required").required("Location is required"),
});
