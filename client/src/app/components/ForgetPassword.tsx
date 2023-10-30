import { FC } from 'react';
import { Grid, Typography, Button } from '@mui/material';

const ForgetPassword: FC = () => {
  return (
    <Grid
      container
      sx={{
        p: 1,
        px: 3,
        zIndex: 150,
        width: {
          xs: '100%',
          sm: '40%',
        },
        height: {
          xs: '100%',
          sm: '60%',
        },
        position: 'fixed',
        borderRadius: '0.5rem',
        backdropFilter: 'blur(5px)',
        backgroundColor: 'rgba(0, 0, 0, 0.30)',
        border: '1px solid rgba(144, 202, 249, 0.15)',
        bottom: {
          xs: '0',
          sm: '10%',
        },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Grid
        item
        sx={{
          textAlign: 'center',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant='body1'
          sx={{
            fontWeight: 'bold',
            fontFamily: 'inherit',
            letterSpacing: 1,
          }}
        >
          Forget Password?
        </Typography>
      </Grid>

      <hr style={{ border: 'none', height: '1px', backgroundColor: 'white' }} />

      <Grid
        item
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          letterSpacing: 0.5,
        }}
      >
        <Typography
          variant='body1'
          sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}
        >
          Relax and try to remember your password.
        </Typography>
        <Typography
          variant='body1'
          sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}
        >
          We are not going anywhere!
        </Typography>
      </Grid>

      <hr style={{ border: 'none', height: '1px', backgroundColor: 'white' }} />

      <Grid
        item
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
        }}
      >
        <Button sx={{ fontWeight: 'bold' }}>Thanks!</Button>
      </Grid>
    </Grid>
  );
};

export default ForgetPassword;
