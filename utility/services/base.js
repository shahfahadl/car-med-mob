import { BrowserUtility } from '../browser-utility';
import { commonConstants } from '../constants/api';
import axios from 'axios';
import process from '../../env'
import Toast from "react-native-toast-message";

const baseURL = process.API_PATH;

const onSuccess = (response) => response.data

const onError = async (error) => {
  console.log(error)
  if (error.response) {
    if (error.response.status === 403) {
      await BrowserUtility.remove(commonConstants.uniqueUserName);
      return Promise.reject(error);
    }
  }

  if (error.response.status === 405) {
    await BrowserUtility.remove(commonConstants.uniqueUserName);
    Toast.show({
      type: "error",
      text1: `You are blocked`,
    });
    return error;
  }

  return Promise.reject({
    code: error?.response?.data?.code || error?.response?.code || '',
    error: error?.response?.data?.error || error?.response?.data || '',
    status: error?.response?.status || '',
  });
}

const request = async (options, isSecure = true) => {
  const headers = {};

  if (isSecure) {
    const user = await BrowserUtility.getObj(commonConstants.uniqueUserName);
    headers.authorization = user?.token;
    headers.type = user?.type;
  }

  const client = axios.create({
    baseURL: baseURL,
    headers: { ...headers }
  });

  return client(options)
    .then(onSuccess)
    .catch(onError);
}

export class BaseService {
  static get = (url, isSecure = true) => request({
    url,
    method: 'GET',
  }, isSecure)

  static post = (url, data, isSecure = true) => request({
    url,
    method: 'POST',
    data,
  }, isSecure)

  static put = (url, data, isSecure = true) => request({
    url,
    method: 'PUT',
    data,
  }, isSecure)

  static remove = (url, isSecure = true) => request({
    url,
    method: 'DELETE',
  }, isSecure)
}