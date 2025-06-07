import axios from 'axios';
import { getCookie } from './Cookie';
import Helper from '@/utils/Helpers';

export default class API {
  private static readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  private static readonly ACCESS_TOKEN = getCookie('access_token');

  private static readonly API = axios.create({
    baseURL: API.API_BASE_URL,
    headers: {
      Authorization: `Bearer ${API.ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  static get = async (url: string, params?: object, version = '1') => {
    const apiVersion = `/api/v${version}/`;
    const apiEndpoint = Helper.sanitizeUrl(`${apiVersion}${url}`);

    return this.API.get(apiEndpoint, { params }).then((res) => res.data);
  };

  static post = async (url: string, params?: object, version = '1') => {
    const apiVersion = `/api/v${version}/`;
    const apiEndpoint = Helper.sanitizeUrl(`${apiVersion}${url}`);

    return this.API.post(apiEndpoint, params).then((res) => res.data);
  };

  static put = async (url: string, params?: object, version = '1') => {
    const apiVersion = `/api/v${version}/`;
    const apiEndpoint = Helper.sanitizeUrl(`${apiVersion}${url}`);

    return this.API.put(apiEndpoint, params).then((res) => res.data);
  };

  static delete = async (url: string, params?: object, version = '1') => {
    const apiVersion = `/api/v${version}/`;
    const apiEndpoint = Helper.sanitizeUrl(`${apiVersion}${url}`);

    return this.API.delete(apiEndpoint, { params }).then((res) => res.data);
  };
}
