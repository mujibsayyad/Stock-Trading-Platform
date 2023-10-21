'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, ChangeEvent, FormEvent, FC } from 'react';
import { useSelector } from 'react-redux';

//* ************** mui *************** *//
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  CssBaseline,
  InputAdornment,
} from '@mui/material';
import {
  Email,
  Password,
  ShowChart,
  Person,
  AccessibilityNew,
} from '@mui/icons-material';

//* ************** Custom imports *************** *//
import Loader from '../components/Loader';
import { postData } from '../hooks/axiosapi';
import { ReduxState } from '@/lib/redux/store';
import validateUserData from '../hooks/validation';
import WithAuth, { WithAuthProps } from '../middleware/WithAuth';
import SignupImg from '../../../public/signin/signup.jpg';

//* ************** types *************** *//
type FieldNames =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'password'
  | 'confirmPassword';

type UserData = {
  [key in FieldNames]: string;
};

type InputErrors = {
  [key in FieldNames]?: string;
};

//* ************** *************** *//
const initialUserData: UserData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};
//* ************** *************** *//

const Signup: FC<WithAuthProps> = ({ isAuthenticated }) => {
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [inputErrors, setInputErrors] = useState<InputErrors>({});

  const { firstName, lastName, email, password, confirmPassword } = userData;

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

  const handleSignup = (e: FormEvent) => {
    e.preventDefault();
    const validationResult = validateUserData(userData, 'signup');

    if (!validationResult.valid) {
      setInputErrors(validationResult.errors);
    } else {
      setInputErrors({});
      // handle successful signup...
      postData('/signup', userData);
    }
  };

  return (
    <Container
      component='main'
      maxWidth='xl'
      sx={{
        p: 0,
        position: 'relative',
        height: {
          xs: '100vh',
          sm: '70vh',
          md: '100vh',
          lg: '100vh',
          xl: '100vh',
        },
        overflowY: 'auto',
        my: {
          xs: 0,
          sm: 8,
          md: 8,
        },
        mb: {
          xs: 8,
          sm: 0,
        },
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
          xs={12}
          md={7}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '& img': {
              display: { xs: 'none', sm: 'none', md: 'block' },
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
              md: '#191919',
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
          <Typography component='h1' variant='h5'>
            Sign up with email
          </Typography>
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
                  name='firstName'
                  id='firstName'
                  label='First Name'
                  value={firstName}
                  onChange={handleChange}
                  error={!!inputErrors.firstName}
                  helperText={inputErrors.firstName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Person />
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
                  id='lastName'
                  label='Last Name'
                  name='lastName'
                  value={lastName}
                  onChange={handleChange}
                  error={!!inputErrors.lastName}
                  helperText={inputErrors.lastName}
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
              >
                Sign Up
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
