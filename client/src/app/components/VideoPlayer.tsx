'use client';
import { Box } from '@mui/material';
// @ts-ignore
import STP from '../../../public/video/STP.mp4';
import BlueFrame from '../../../public/homepage/blue_frame.png';

const VideoPlayer = () => {
  return (
    <Box
      sx={{
        backgroundImage: `url(${BlueFrame.src})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        p: 3,
        height: {
          xs: '18rem',
          sm: '30rem',
        },
        width: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& video': {
          width: 'auto', // width for larger screens
          borderRadius: '0.5rem',
          '@media (max-width: 820px)': {
            width: '80%', // width for smaller screens
          },
        },
      }}
    >
      <video preload='metadata' height='68%' autoPlay muted loop>
        <source src={STP} type='video/mp4' />
        Your browser does not support the video tag.
      </video>
    </Box>
  );
};

export default VideoPlayer;
