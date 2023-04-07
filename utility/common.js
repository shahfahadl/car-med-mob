import process from '../env'

export class CommonUtility {
    static objectToParams = (obj) => {
      let str = '';
      for (const key in obj) {
        if (obj[key] !== undefined && obj[key] !== null) {
          if (str !== '') {
            str += '&';
          }
          str += `${key}=${encodeURIComponent(obj[key])}`;
        }
      }
      return str;
    };

    static useBackendImage = (image) =>{
      return process.IMAGE_PATH + image
    }

    static currencyFormat = (value, currency, options = {}) => {
      const tempCurrency = currency || "pkr";
      return isNaN(value || 0)
        ? value
        : new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: tempCurrency,
            ...(options || {}),
          }).format(value || 0);
    };

  }