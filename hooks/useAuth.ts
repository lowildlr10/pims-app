import { useState, useCallback } from 'react';
import API from '@/libs/API';
import { expireCookie, setCookie } from '@/libs/Cookie';

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const login = useCallback(async (loginData: LoginFormType) => {
    setLoading(true);

    try {
      if (loginData.login && loginData.password) {
        API.post('/login', loginData)
          .then(({ data }) => {
            setCookie('access_token', data.access_token, 86400);
            setMessage(data.message);
            setError(false);
            setLoading(false);

            window.location.href = '/';
          })
          .catch((err) => {
            setMessage(err?.response?.data?.message ?? err.message);
            setLoading(false);
            setError(true);
          });
      } else {
        setMessage('Login and password are required.');
        setLoading(false);
        setError(true);
      }
    } catch (err: any) {
      setMessage(err?.response?.data?.message ?? err.message);
      setLoading(false);
      setError(true);
    }
  }, []); // No dependencies, only memoized once during hook initialization

  const logout = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      API.post('/logout')
        .then(({ data }) => {
          setMessage(data?.message);
          expireCookie('access_token');
          setError(false);
          setLoading(false);

          window.location.href = '/login';
        })
        .catch((err) => {
          setMessage(err?.response?.data?.message ?? err.message);
          setLoading(false);
          setError(true);
        });
    } catch (err: any) {
      setMessage(err?.response?.data?.message ?? err.message);
      setLoading(false);
      setError(true);
    }
  }, []);

  return { loading, error, message, login, logout };
};

export default useAuth;
