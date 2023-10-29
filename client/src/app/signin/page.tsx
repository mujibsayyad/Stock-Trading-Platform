'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TailSpin } from 'react-loader-spinner';
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
import Loader from '../components/Loader';
import GoogleLogin from '../components/GoogleLogin';
import ForgetPassword from '../components/ForgetPassword';
import { ReduxState } from '@/lib/redux/store';
import { userLogin } from '@/lib/redux/slices/authSlice';
import validateUserData from '../hooks/validation';
import WithAuth, { WithAuthProps } from '../middleware/WithAuth';
import LoginImg from '../../../public/signin/login.jpg';

//* ************** interface *************** *//
interface customInputErrors {
  email?: string;
  password?: string;
}

//* ************** *************** *//

const SignIn: FC<WithAuthProps> = ({ isAuthenticated }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showForgetPass, setShowForgetPass] = useState<boolean>(false);
  const [inputErrors, setInputErrors] = useState<customInputErrors>({});

  const router = useRouter();
  const dispatch = useDispatch<any>();
  const { isSignedIn, status } = useSelector((state: ReduxState) => state.auth);

  useEffect(() => {
    document.title = 'Stock Trading | Sign In';

    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated]);

  if (isAuthenticated || isSignedIn) {
    return <Loader />;
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
    setAuthError('');

    // handle login...
    try {
      const checkAuth = await dispatch(userLogin({ email, password }));
      if (checkAuth.payload?.isSignedIn) {
        router.push('/');
      } else {
        setAuthError(checkAuth?.error.message);
      }
    } catch (error) {
      console.log('🚀 handleSignin.error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // handle forget password pop up box
  const handleForgetPass = () => {
    setShowForgetPass((prev) => !prev);
  };

  return (
    <Container
      component='main'
      maxWidth='xl'
      sx={{
        p: 0,
        position: 'relative',
        minHeight: '100vh',
        my: {
          xs: 0,
          sm: 1.2,
        },
        mb: {
          md: 6,
        },
      }}
    >
      <Grid
        container
        spacing={0}
        sx={{
          borderRadius: '1rem',
          overflow: 'hidden',
          minHeight: '100vh',
          my: {
            sm: 0,
            md: 1,
          },
        }}
      >
        {/* Left Grid for Image */}
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '& img': {
              display: { xs: 'none', md: 'block' },
            },
          }}
        >
          <Image
            src={LoginImg}
            width={0}
            height={0}
            alt='stock chart'
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            priority
          />
        </Grid>

        {/* Right Grid for Login */}
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: {
              sm: 'none',
              md: 'rgba(144, 202, 249, 0.08)',
            },
            overflow: {
              xs: 'hidden',
            },
            mb: {
              xs: 10,
              sm: 1.2,
            },
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'background.paper' }}>
            <ShowChart
              sx={{
                color: 'white',
              }}
            />
          </Avatar>
          <Typography
            component='h1'
            variant='h6'
            sx={{
              pb: 2,
              textTransform: 'uppercase',
              fontWeight: '600',
              fontFamily: 'inherit',
            }}
          >
            Sign in to Trading View
          </Typography>

          {/* Google Button  */}
          <GoogleLogin text={'Google'} />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Box
              sx={{
                my: '2rem',
                height: '1px',
                mx: '11px',
                flex: '1 1 0%',
                borderRadius: '2px',
                backgroundImage:
                  'linear-gradient(90deg, rgba(233, 237, 241, 0) 35%, rgb(161, 165, 190))',
              }}
            ></Box>
            <Typography
              sx={{
                display: 'flex',
                my: '0px',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '14px',
                textAlign: 'center',
              }}
            >
              OR
            </Typography>
            <Box
              sx={{
                display: 'block',
                height: '1px',
                mx: '11px',
                flex: ' 1 1 0%',
                backgroundImage:
                  'linear-gradient(90deg, rgba(233, 237, 241, 0) 35%, rgb(161, 165, 190))',
                transform: 'rotate(180deg)',
                borderRadius: '2px',
              }}
            ></Box>
          </Box>

          {authError && (
            <Typography
              variant='subtitle1'
              sx={{
                color: 'black',
                background: '#f7a7a3',
                backdropFilter: 'blur(5px)',
                fontFamily: 'inherit',
                borderRadius: '0.4rem',
                borderLeft: '5px solid #8f130c',
                px: 3,
                py: 0.8,
                my: 1.5,
              }}
            >
              {authError}
            </Typography>
          )}

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

            <Grid
              container
              justifyContent='center'
              item
              xs={8}
              onClick={handleForgetPass}
            >
              <Typography
                variant='body1'
                sx={{
                  color: '#4fc3f7',
                  cursor: 'pointer',
                }}
              >
                I forgot password or can&apos;t sign in
              </Typography>
              {showForgetPass && <ForgetPassword />}
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
                {submitting ? (
                  <TailSpin
                    height='24'
                    width='24'
                    color='#0079FF'
                    ariaLabel='tail-spin-loading'
                    radius='1'
                    wrapperStyle={{}}
                    wrapperClass=''
                    visible={true}
                  />
                ) : (
                  'Sign In'
                )}
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
