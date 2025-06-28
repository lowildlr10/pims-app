import { cookies } from 'next/headers';

export const getAccessToken = async () => {
  const cookiesStore = await cookies();
  const token = cookiesStore.get('access_token');

  return token?.value;
};
