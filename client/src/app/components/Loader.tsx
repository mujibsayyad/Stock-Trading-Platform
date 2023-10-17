import { Box } from '@mui/material';
import { TailSpin } from 'react-loader-spinner';

import React from 'react';

const Loader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        minHeight: '100vh',
        position: 'fixed',
      }}
    >
      <TailSpin
        height='80'
        width='80'
        color='#0079FF'
        ariaLabel='tail-spin-loading'
        radius='1'
        wrapperStyle={{}}
        wrapperClass=''
        visible={true}
      />
    </Box>
  );
};

export default Loader;
