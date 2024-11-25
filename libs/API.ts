import axios from 'axios';
import { getCookie } from './Cookie';
import Helper from '@/utils/Helpers';

export default class API {
  private static readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  private static readonly ACCESS_TOKEN = getCookie('access_token');

  private static readonly API = axios.create({
    baseURL: API.API_BASE_URL,
    headers: {
      Authorization: `Bearer ${API.ACCESS_TOKEN}`
    }
  });

  static get = (url: string, params?: any, version = '1') => {
    const paramsString = new URLSearchParams(params).toString();
    const apiVersion = `/api/v${version}/`;
    const apiEndpoint = Helper.sanitizeUrl(`${apiVersion}${url}`);

    return this.API.get(`${apiEndpoint}?${paramsString}`)
      .then((res) => res.data);
  };

  static post = (url: string, params?: any, version = '1') => {
    const paramsString = new URLSearchParams(params).toString();
    const apiVersion = `/api/v${version}/`;
    const apiEndpoint = Helper.sanitizeUrl(`${apiVersion}${url}`);

    return this.API.post(apiEndpoint, paramsString)
      .then((res) => res.data);
  };

  static put = (url: string, params?: any, version = '1') => {
    const paramsString = new URLSearchParams(params).toString();
    const apiVersion = `/api/v${version}/`;
    const apiEndpoint = Helper.sanitizeUrl(`${apiVersion}${url}`);

    return this.API.put(apiEndpoint, paramsString)
      .then((res) => res.data);
  };

  static delete = (url: string, params?: any, version = '1') => {
    const paramsString = new URLSearchParams(params).toString();
    const apiVersion = `/api/v${version}/`;
    const apiEndpoint = Helper.sanitizeUrl(`${apiVersion}${url}`);

    return this.API.delete(`${apiEndpoint}?${paramsString}`)
      .then((res) => res.data);
  };
}