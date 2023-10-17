'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Grid,
  Avatar,
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';
import { Email, Password, ShowChart } from '@mui/icons-material';

//* ************** Custom imports *************** *//
import { ReduxState } from '@/lib/redux/store';
import { userLogin } from '@/lib/redux/slices/authSlice';
import validateUserData from '../hooks/validation';
import WithAuth, { WithAuthProps } from '../middleware/WithAuth';
import StockChartImg from '../../../public/signin/stock_chart.jpg';

//* ************** interface *************** *//
interface customInputErrors {
  email?: string;
  password?: string;
}

//* ************** *************** *//

const SignIn: FC<WithAuthProps> = ({ isAuthenticated }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [inputErrors, setInputErrors] = useState<customInputErrors>({});

  const router = useRouter();
  const dispatch = useDispatch<any>();
  const { isSignedIn } = useSelector((state: ReduxState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated]);

  if (isAuthenticated || isSignedIn) {
    return <div>Loading...</div>;
  }

  // Handle Signin with input validation
  const handleSignin: any = async () => {
    const validationResult = validateUserData({ email, password }, 'login');

    if (!validationResult.valid) {
      setInputErrors(validationResult.errors);
      return;
    }

    setInputErrors({});
    setSubmitting(true);

    // handle login...
    try {
      const checkAuth = await dispatch(userLogin({ email, password }));
      if (checkAuth.payload?.isSignedIn) {
        router.push('/');
      }
    } catch (error) {
      console.log('🚀 handleSignin.error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container
      component='main'
      maxWidth='xl'
      sx={{
        my: 8,
        p: 0,
        position: 'relative',
        height: '30rem',
      }}
    >
      <Grid
        container
        spacing={0}
        sx={{
          borderRadius: '1rem',
          overflow: 'hidden',
          height: '100%',
        }}
      >
        {/* Left Grid for Image */}
        <Grid
          item
          xs={7}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            src={StockChartImg}
            width={0}
            height={0}
            alt='stock chart'
            style={{ width: '100%', height: '100%' }}
            priority
          />
        </Grid>

        {/* Right Grid for Login */}
        <Grid
          item
          xs={5} // 40%
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#191919',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'background.paper' }}>
            <ShowChart
              sx={{
                color: 'white',
              }}
            />
          </Avatar>
          <Typography variant='h5'>Sign in with email</Typography>
          <Box
            component='form'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Grid container justifyContent='center'>
              <Grid item xs={8}>
                <TextField
                  error={!!inputErrors.email}
                  helperText={inputErrors.email}
                  autoFocus
                  fullWidth
                  required
                  margin='normal'
                  id='email'
                  label='Email Address'
                  type='email'
                  name='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={8}>
                <TextField
                  fullWidth
                  required
                  margin='normal'
                  id='password'
                  label='Password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Password />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Grid container justifyContent='center' item xs={8}>
              <Link href='/forgot'>{"I forgot password or can't sign in"}</Link>
            </Grid>

            <Grid container justifyContent='center' item xs={8}>
              <Button
                sx={{
                  borderRadius: 5,
                  marginTop: 3,
                  width: '100%',
                }}
                variant='contained'
                onClick={handleSignin}
                disabled={submitting}
              >
                {submitting ? 'Loading...' : 'Sign In'}
              </Button>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {/* Footer Grid */}
      <Grid
        container
        alignItems='center'
        justifyContent='center'
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: 1,
          backgroundColor: 'background.paper',
          padding: 1,
          zIndex: 1,
          height: '3rem',
        }}
      >
        <Grid item>
          {"Don't have an account? "}
          <Link style={{ fontSize: '1rem' }} href='/signup'>
            Sign up
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WithAuth(SignIn, true) as FC;
