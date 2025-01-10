import { OutgoingMessage } from 'http';

const isServer = typeof window === 'undefined';

export const setCookie = (
  key: string,
  value: string,
  age = 86400,
  path = '/'
): void => {
  document.cookie = `${key}=${value};max-age=${age};path=${path}`;
};

export const expireCookie = (key: string, res?: OutgoingMessage): void => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  date.setHours(date.getHours() - 8);

  const cookie = `${key}=;expires=${date.toUTCString()};path=/`;

  if (isServer) {
    res?.setHeader('Set-Cookie', [cookie]);
  } else {
    document.cookie = cookie;
  }
};

export const getCookie = (key: string, cookie = ''): string | null => {
  const decodedCookie = isServer ? cookie : decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');

  for (let c of ca) {
    c = c.trim();
    if (c.startsWith(`${key}=`)) return c.substring(key.length + 1);
  }

  return null;
};
