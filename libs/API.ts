import axios, { AxiosError, AxiosInstance } from 'axios';
import { expireCookie, getCookie, renewCookie, setCookie } from './Cookie';
import Helper from '@/utils/Helpers';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    __isRetryRequest?: boolean;
  }
}

export default class API {
  private static readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  private static getAxiosInstance(): AxiosInstance {
    const accessToken = getCookie('access_token');

    const instance = axios.create({
      baseURL: `${API.API_BASE_URL}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (accessToken) {
      renewCookie('access_token');
    }

    // Add response interceptor to handle token expiration
    instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401 && !error.config?.__isRetryRequest) {
          try {
            const tokenResponse = await axios.post(
              `${API.API_BASE_URL}/api/v1/refresh-token`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            const newToken = tokenResponse.data.data.access_token;

            // Save new token
            setCookie('access_token', newToken, 86400);

            // Retry original request with new token
            if (error.config?.headers) {
              error.config.headers['Authorization'] = `Bearer ${newToken}`;
              error.config.__isRetryRequest = true;
              return axios(error.config);
            }
          } catch (refreshError) {
            // If refresh also fails, force logout
            // expireCookie('access_token');
            // window.location.href = '/login';
            // return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }

  static get = async (url: string, params?: object, version = '1') => {
    const apiVersion = `/api/v${version}/`;
    const apiEndpoint = Helper.sanitizeUrl(`${apiVersion}${url}`);

    return this.getAxiosInstance()
      .get(apiEndpoint, { params })
      .then((res) => res.data);
  };

  static post = async (url: string, params?: object, version = '1') => {
    const apiVersion = `/api/v${version}/`;
    const apiEndpoint = Helper.sanitizeUrl(`${apiVersion}${url}`);

    return this.getAxiosInstance()
      .post(apiEndpoint, params)
      .then((res) => res.data);
  };

  static put = async (url: string, params?: object, version = '1') => {
    const apiVersion = `/api/v${version}/`;
    const apiEndpoint = Helper.sanitizeUrl(`${apiVersion}${url}`);

    return this.getAxiosInstance()
      .put(apiEndpoint, params)
      .then((res) => res.data);
  };

  static delete = async (url: string, params?: object, version = '1') => {
    const apiVersion = `/api/v${version}/`;
    const apiEndpoint = Helper.sanitizeUrl(`${apiVersion}${url}`);

    return this.getAxiosInstance()
      .delete(apiEndpoint, { params })
      .then((res) => res.data);
  };
}
