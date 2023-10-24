'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, ChangeEvent, FormEvent, FC } from 'react';
import { useSelector } from 'react-redux';
import { TailSpin } from 'react-loader-spinner';

//* ************** mui *************** *//
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  InputAdornment,
} from '@mui/material';
import {
  Email,
  Password,
  ShowChart,
  AccessibilityNew,
} from '@mui/icons-material';

//* ************** Custom imports *************** *//
import Loader from '../components/Loader';
import { postData } from '../hooks/axiosapi';
import { ReduxState } from '@/lib/redux/store';
import validateUserData from '../hooks/validation';
import GoogleLogin from '../components/GoogleLogin';
import WithAuth, { WithAuthProps } from '../middleware/WithAuth';
import SignupImg from '../../../public/signin/signup.jpg';

//* ************** types *************** *//
type FieldNames = 'fullname' | 'email' | 'password' | 'confirmPassword';

type UserData = {
  [key in FieldNames]: string;
};

type InputErrors = {
  [key in FieldNames]?: string;
};

//* ************** *************** *//
const initialUserData: UserData = {
  fullname: '',
  email: '',
  password: '',
  confirmPassword: '',
};
//* ************** *************** *//

const Signup: FC<WithAuthProps> = ({ isAuthenticated }) => {
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [inputErrors, setInputErrors] = useState<InputErrors>({});
  const [authError, setAuthError] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { fullname, email, password, confirmPassword } = userData;

  const router = useRouter();
  const { isSignedIn, status } = useSelector((state: ReduxState) => state.auth);

  useEffect(() => {
    document.title = 'Stock Trading | Sign Up';

    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated]);

  if (status === 'loading' || isAuthenticated || isSignedIn) {
    return <Loader />;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    const validationResult = validateUserData(userData, 'signup');

    if (!validationResult.valid) {
      setInputErrors(validationResult.errors);
    } else {
      setInputErrors({});
      setSubmitting(true);

      // handle signup...
      try {
        const checkAuth: any = await postData('/signup', userData);

        if (!checkAuth?.error?.error) {
          router.push('/');
        } else {
          setAuthError(checkAuth.error.error);
        }
      } catch (error) {
        console.log('🚀 handleSignup.error:', error);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <Container
      component='main'
      maxWidth='xl'
      sx={{
        p: 0,
        position: 'relative',
        minHeight: '100vh',
        mb: {
          xs: 10,
          sm: 10,
          md: 10,
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
          mt: {
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
            src={SignupImg}
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
              md: 'rgba(144, 202, 249, 0.08);',
            },

            overflow: {
              xs: 'hidden',
            },
            pb: {
              xs: 10,
              md: 6,
            },
            mt: {
              xs: 8,
              md: 0,
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
            Sign up for Trading View
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
            >
              {' '}
            </Box>
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
                  fullWidth
                  required
                  margin='normal'
                  id='fullName'
                  label='Full Name'
                  name='fullname'
                  value={fullname}
                  onChange={handleChange}
                  error={!!inputErrors.fullname}
                  helperText={inputErrors.fullname}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <AccessibilityNew />
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
                  id='email'
                  label='Email Address'
                  type='email'
                  name='email'
                  value={email}
                  onChange={handleChange}
                  error={!!inputErrors.email}
                  helperText={inputErrors.email}
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
                  name='password'
                  value={password}
                  onChange={handleChange}
                  error={!!inputErrors.password}
                  helperText={inputErrors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Password />
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
                  id='confirmPassword'
                  label='Confirm Password'
                  type='password'
                  name='confirmPassword'
                  value={confirmPassword}
                  onChange={handleChange}
                  error={!!inputErrors.confirmPassword}
                  helperText={inputErrors.confirmPassword}
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
              <Button
                fullWidth
                type='submit'
                variant='contained'
                sx={{
                  marginTop: 3,
                  borderRadius: 5,
                }}
                onClick={handleSignup}
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
                  'Sign Up'
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
          {'Already have an account? '}
          <Link style={{ fontSize: '1rem' }} href='/signin'>
            Sign In
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WithAuth(Signup, true) as FC;
