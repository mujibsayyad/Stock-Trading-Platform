'use client';
import { useState, useEffect, FC } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';

//* ************** Custom imports *************** *//
import { socket } from './socket';
import { getReq } from '../hooks/axiosapi';
import { validateUser } from '@/lib/redux/slices/authSlice';
import {
  connectSocket,
  disconnectSocket,
} from '@/lib/redux/slices/socketSlice';
import Loader from '../components/Loader';

//* ************** interface *************** *//
export interface WithAuthProps {
  isAuthenticated: boolean;
}
//* ************** *************** *//

const WithAuth = (
  Component: FC<WithAuthProps>,
  isPublicPage: boolean = false
): FC<WithAuthProps> => {
  const Inner: FC<WithAuthProps> = (props: WithAuthProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(pathname.startsWith('/chart/'));

    const { isSignedIn, status } = useSelector((state: any) => state.auth);
    console.log('🚀 isSignedIn:', isSignedIn);

    const dispatch = useDispatch<any>();

    useEffect(() => {
      getReq().then((data) => {
        dispatch(validateUser(data));

        if (data?.isSignedIn) {
          if (pathname.startsWith('/chart/')) {
            // Connect the socket only for /chart page
            socket.connect();
          }

          if (isPublicPage) {
            router.push('/');
          }
        } else if (!isPublicPage) {
          router.push('/signin');
        }
        setLoading(false);
      });

      // Clean up by disconnecting the socket when the component unmounts
      return () => {
        if (pathname.startsWith('/chart/')) {
          if (socket.connected) {
            console.log('🚀 withauth cleanup socket connected:');
            socket.disconnect();
            // dispatch(disconnectSocket());
          }
        }
      };
    }, [dispatch, isPublicPage, isSignedIn, router]);

    if (status === 'loading' || loading) {
      return <Loader />;
    }

    return <Component {...props} isAuthenticated={isSignedIn} />;
  };

  return Inner;
};

export default WithAuth;
