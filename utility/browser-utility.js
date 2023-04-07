import AsyncStorage from '@react-native-async-storage/async-storage';

export class BrowserUtility {
  static save = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log('Error saving data:', error);
    }
  };

  static get = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      console.log('Error retrieving data:', error);
      return null;
    }
  };

  static saveObj = async (key, obj) => {
    try {
      const jsonValue = JSON.stringify(obj);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.log('Error saving object:', error);
    }
  };

  static getObj = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.log('Error retrieving object:', error);
      return null;
    }
  };

  static remove = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log('Error removing data:', error);
    }
  };

  static removeAll = async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.log('Error clearing data:', error);
    }
  };

  static isMobileSafari() {
    const ua = window.navigator.userAgent;
    return /(iPad|iPhone|iPod).*WebKit/.test(ua) && !/(CriOS|OPiOS)/.test(ua);
  }
}