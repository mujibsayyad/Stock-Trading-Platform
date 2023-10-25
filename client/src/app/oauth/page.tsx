'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

import Loader from '../components/Loader';
import { userLogin } from '@/lib/redux/slices/authSlice';

function GoogleOAuth() {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const dispatch: any = useDispatch();

  useEffect(() => {
    const token: string | null = new URLSearchParams(
      window.location.search
    ).get('token');

    setToken(token);
  }, []);

  useEffect(() => {
    if (token) {
      document.cookie = `jwtoken=${token}; max-age=36000; path=/`;
      router.push('/');
    }
  }, [token]);

  return <Loader />;
}

export default GoogleOAuth;
