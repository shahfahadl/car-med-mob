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
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

export const signInAsOptions = [
  { value: "user", label: "User" },
  { value: "vendor", label: "Vendor" },
];

export const skillOption = [
  {
    value: "dentAndPaint",
    label: "Dent and Paint",
  },
  {
    value: "carWash",
    label: "Car Wash",
  },
  {
    value: "tyres",
    label: "Tyres",
  },
  {
    value: "mechanic",
    label: "Mechanic",
  },
  {
    value: "electrician",
    label: "Electrician",
  },
  {
    value: "battery",
    label: "Battery",
  },
];

export const carTypeOptions = [
  {
    value: "cars",
    label: "Cars",
  },
  {
    value: "bigCars",
    label: "Big Cars",
  },
  {
    value: "HighRoof",
    label: "High Roof Cars",
  },
];

export const cities = [
  {
    value: {
      name: "Nowshera",
      latLng: {
        lat: 33.9956777,
        lng: 71.9075292,
      },
    },
    label: "Nowshera",
  },
  {
    value: {
      name: "Peshawar",
      latLng: {
        lat: 34.0151,
        lng: 71.5249,
      },
    },
    label: "Peshawar",
  },
  {
    value: {
      name: "Islamabad",
      latLng: {
        lat: 33.6844,
        lng: 73.0479,
      },
    },
    label: "Islamabad",
  },
];
