'use client';
import React, { useState, useEffect, FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Tooltip,
  MenuItem,
} from '@mui/material';
import { Person, CandlestickChart } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutMutation } from '@/lib/redux/api/profileApi';
import { signout } from '@/lib/redux/slices/authSlice';

const settings = ['Sign out'];

const Navbar: FC = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const pathname = usePathname();
  const dispatch = useDispatch();

  const { isSignedIn } = useSelector((state: any) => state.auth);

  const [logout] = useLogoutMutation();

  useEffect(() => {
    const handleScroll = () => {
      // Here, 100 is the amount of pixels scrolled before changing the navbar style
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    userLogout();
  };

  // Handle user logout
  const userLogout = async () => {
    const resLogout = await logout('');
    dispatch(signout(resLogout));
  };

  return (
    <AppBar
      position='fixed'
      sx={{
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
        width: '100vw',
        boxShadow: 'none',
        transition: 'backgroundColor 0.5s',
        zIndex: 10,
      }}
    >
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Box
            sx={{
              display: 'flex',
              flexGrow: 1,
              justifyContent: 'space-between',
            }}
          >
            {/* Left items */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CandlestickChart
                sx={{
                  height: {
                    xs: '2rem',
                    sm: '2.5rem',
                  },
                  width: '2.5rem',
                }}
              />
              <Link
                href={'/'}
                style={{
                  color: 'white',
                  marginRight: '2rem',
                  fontWeight: 700,
                  letterSpacing: '.1rem',
                }}
              >
                <Typography
                  sx={{
                    fontWeight: '600',
                    fontSize: {
                      xs: '0.8rem',
                      sm: '0.9rem',
                      md: '',
                    },
                  }}
                >
                  TRADING VIEW
                </Typography>
              </Link>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {!isSignedIn &&
                pathname !== '/signin' &&
                pathname !== '/signup' && (
                  <>
                    <Link href={'/signin'} className='nav_link'>
                      SignIn
                    </Link>
                    <Link href={'/signup'} className='nav_link'>
                      SignUp
                    </Link>
                  </>
                )}

              {isSignedIn && (
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title='Open settings'>
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar sx={{ background: 'transparent' }}>
                        <Person
                          sx={{
                            color: 'white',
                          }}
                        />
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id='menu-appbar'
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    disableScrollLock={true}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {settings.map((setting) => (
                      <MenuItem key={setting} onClick={handleCloseUserMenu}>
                        <Typography textAlign='center'>{setting}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
