import { getAccessToken } from '@/libs/Auth';
import { expireCookie } from '@/libs/Cookie';

export const getCompany = async () => {
  const data = await getCompanyData();
  return await data?.data.company;
};

const getCompanyData = async () => {
  try {
    const basePath = process.env.NEXT_PUBLIC_API_BASE_URL;
    const accessToken = getAccessToken();
    const response = await fetch(`${basePath}/api/v1/companies`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      expireCookie('access_token');
      return {
        data: {
          company: null,
        },
      };
    }

    return await response.json();
  } catch (error) {
    expireCookie('access_token');
    return {
      data: {
        company: null,
      },
    };
  }
};
