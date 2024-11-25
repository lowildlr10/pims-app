import { cookies } from 'next/headers';

export const getAccessToken = () => {
  const cookieStore = cookies();

  return cookieStore.get('access_token')?.value;
};
