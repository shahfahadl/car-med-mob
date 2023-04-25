import process from "../env";

export class CommonUtility {
  static objectToParams = (obj) => {
    let str = "";
    for (const key in obj) {
      if (obj[key] !== undefined && obj[key] !== null) {
        if (str !== "") {
          str += "&";
        }
        str += `${key}=${encodeURIComponent(obj[key])}`;
      }
    }
    return str;
  };

  static useBackendImage = (image) => {
    return process.IMAGE_PATH + image;
  };

  static currencyFormat = (value, currency, options = {}) => {
    const tempCurrency = currency || "pkr";
    return isNaN(value || 0)
      ? value
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: tempCurrency,
          ...(options || {}),
        }).format(value || 0);
  };
}

export const genderOptions = [
  { text: "Male", value: "male" },
  { text: "Female", value: "female" },
];

export const signInAsOptions = [
  { value: "user", text: "User" },
  { value: "vendor", text: "Vendor" },
];

export const skillOption = [
  {
    value: "dentAndPaint",
    text: "Dent and Paint",
  },
  {
    value: "carWash",
    text: "Car Wash",
  },
  {
    value: "tyres",
    text: "Tyres",
  },
  {
    value: "mechanic",
    text: "Mechanic",
  },
  {
    value: "electrician",
    text: "Electrician",
  },
  {
    value: "battery",
    text: "Battery",
  },
];
