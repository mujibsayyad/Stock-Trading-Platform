'use client';
import { useEffect, FC } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';

//* ************** Custom imports *************** *//
import { socket } from './socket';
import { getReq } from '../hooks/axiosapi';
import { validateUser } from '@/lib/redux/slices/authSlice';
import {
  connectSocket,
  disconnectSocket,
} from '@/lib/redux/slices/socketSlice';

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

    const { isSignedIn, status } = useSelector((state: any) => state.auth);
    console.log('🚀 isSignedIn:', isSignedIn);

    const dispatch = useDispatch<any>();

    useEffect(() => {
      getReq().then((data) => {
        dispatch(validateUser(data));

        if (data?.isSignedIn) {
          // Connect the socket when user signin
          dispatch(connectSocket());

          if (isPublicPage) {
            router.push('/');
          }
        } else if (!isPublicPage) {
          router.push('/signin');
        }
      });

      // Clean up by disconnecting the socket when the component unmounts
      return () => {
        if (socket.connected) {
          console.log('🚀 cleanup socket connected:');
          socket.disconnect();
          dispatch(disconnectSocket());
        }
      };
    }, [dispatch, isPublicPage, isSignedIn]);

    if (status === 'loading') {
      return <div>Loading...</div>;
    }

    return <Component {...props} isAuthenticated={isSignedIn} />;
  };

  return Inner;
};

export default WithAuth;
