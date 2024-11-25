import { getAccessToken } from '@/libs/Auth';
import { expireCookie } from '@/libs/Cookie';

export const getUser = async () => {
  const data = await getUserData();
  return await data?.data?.user;
};

export const getPermissions = async () => {
  const data = await getUserData();
  return await data?.data?.permissions;
};

const getUserData = async () => {
  try {
    const basePath = process.env.NEXT_PUBLIC_API_BASE_URL;
    const accessToken = getAccessToken();
    const response = await fetch(`${basePath}/api/v1/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      expireCookie('access_token');
      return {
        data: {
          user: null,
          permissions: null,
        },
      };
    }

    return await response.json();
  } catch (error) {
    expireCookie('access_token');
    return {
      data: {
        user: null,
        permissions: null,
      },
    };
  }
};
