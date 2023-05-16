import { BrowserUtility } from '../browser-utility';
import { commonConstants } from '../constants/api';
import axios from 'axios';
import process from '../../env'

const baseURL = process.API_PATH;

const onSuccess = (response) => response.data

const onError = async (error) => {
  if (error.response) {
    if (error.response.status === 403) {
      window.localStorage.clear();
      window.location.href = '/login';
      return Promise.reject(error);
    }
  }

  return Promise.reject({
    code: error?.response?.data?.code || error?.response?.code || '',
    error: error?.response?.data?.error || error?.response?.data || '',
    status: error?.response?.status || '',
  });
}

const request = async (options, isSecure) => {
  const headers = {};

  if (isSecure) {
    const token = BrowserUtility.getObj(commonConstants.uniqueUserName);
    headers.Authorization = token;
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
  static get = (url, isSecure = false) => request({
    url,
    method: 'GET',
  }, isSecure)

  static post = (url, data, isSecure = false) => request({
    url,
    method: 'POST',
    data,
  }, isSecure)

  static put = (url, data, isSecure = false) => request({
    url,
    method: 'PUT',
    data,
  }, isSecure)

  static remove = (url, isSecure = false) => request({
    url,
    method: 'DELETE',
  }, isSecure)
}