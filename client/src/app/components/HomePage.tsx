'use client';
import Image from 'next/image';
import { useState, useEffect, FC } from 'react';
import { Noto_Sans } from 'next/font/google';
import { Search } from '@mui/icons-material';
import { Container, Box, Typography, Button, Grid } from '@mui/material';

//* ************** Custom imports *************** *//
import DefaultStocks from './DefaultStocks';
import HomeImg from '../../../public/homepage/hp1.jpg';
import HomeSubImg from '../../../public/homepage/hp2.jpg';
import HisDataImg from '../../../public/homepage/hp3.jpg';
import RealTimeImg from '../../../public/homepage/hp4.jpg';
import IndianFlag from '../../../public/homepage/indian_flag.png';

// Google NOTO Font
const NotoFont = Noto_Sans({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
});

const HomePage: FC = () => {
  const [showStocksList, setShowStocksList] = useState<boolean>(false);

  useEffect(() => {
    if (showStocksList) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showStocksList]);

  const handleStocksList = () => {
    setShowStocksList((prev) => !prev);
  };

  const getStateFromStocks = (data: boolean) => {
    setShowStocksList(data);
  };

  return (
    <Box sx={{ background: '#000' }}>
      <Container maxWidth='xl' disableGutters className={NotoFont.className}>
        <Box
          style={
            showStocksList ? { filter: 'blur(5px)', pointerEvents: 'none' } : {}
          }
        >
          <Box
            sx={{
              position: 'relative',
              height: '41rem',
              width: '100%',
            }}
          >
            <Image
              src={HomeImg}
              alt='homepage img'
              fill
              style={{ objectFit: 'cover' }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '25%',
                left: '5%',
              }}
            >
              <Typography
                sx={{
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '4rem',
                  fontFamily: 'inherit',
                }}
              >
                Bold Moves /<br />
                Start Here.
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: '1.4rem',
                  fontFamily: 'inherit',
                  width: 'fit-content',
                }}
              >
                Every stock. Every story. Every step.
              </Typography>
            </Box>

            <Box
              sx={{
                position: 'absolute',
                bottom: '25%',
                left: '5%',
              }}
            >
              <Button
                startIcon={<Search sx={{ color: 'black' }} />}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '2rem',
                  color: '#868993',
                  textTransform: 'capitalize',
                  outline: 'none',
                  border: 'none',
                  padding: '0.8rem 3rem 0.8rem 1.5rem',
                  fontSize: '1rem',
                  '& .MuiButton-startIcon': {
                    marginLeft: 0,
                  },
                  '&:hover': {
                    backgroundColor: 'white',
                    boxShadow: 'none',
                    color: 'black',
                  },
                }}
                onClick={handleStocksList}
              >
                Search markets here
              </Button>
            </Box>
          </Box>
        </Box>

        {showStocksList && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              width: '100%',
              position: 'absolute',
              top: 0,
              zIndex: 20,
            }}
          >
            <DefaultStocks getStateFromStocks={setShowStocksList} />
          </Box>
        )}
      </Container>

      <Typography
        sx={{
          fontWeight: 600,
          fontSize: '5.5rem',
          fontFamily: 'inherit',
          textAlign: 'center',
          my: 8,
          p: 4,
          letterSpacing: '0.1rem',
        }}
      >
        Where the world does markets
      </Typography>

      <Box
        sx={{
          position: 'relative',
          height: '35rem',
          paddingBottom: 10,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          src={HomeSubImg}
          width={0}
          height={0}
          alt='stock chart'
          style={{
            width: '90%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '2rem',
            position: 'relative',
          }}
          priority
        />

        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '10%',
            textAlign: 'left',
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '2rem',
              fontFamily: 'inherit',
              width: 'fit-content',
            }}
          >
            Whatever the trade
          </Typography>
          <Typography
            sx={{
              color: 'white',
              fontWeight: 700,
              fontSize: '3rem',
              fontFamily: 'inherit',
            }}
          >
            Before you act / <br />
            Ensure facts are intact.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mx: 10 }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '5.5rem',
            fontFamily: 'inherit',
            textAlign: 'center',

            p: 4,
            letterSpacing: '0.1rem',
          }}
        >
          What We Offers ?
        </Typography>

        <Grid
          container
          spacing={5}
          sx={{
            mt: 5,
            mb: 10,
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Grid item xs={6}>
            <Typography
              variant='h4'
              sx={{
                fontWeight: 600,
                fontSize: '3rem',
                fontFamily: 'inherit',
              }}
            >
              Real Time Data
            </Typography>
            <Typography
              variant='body1'
              sx={{
                fontWeight: 500,
                fontSize: '1.2rem',
                fontFamily: 'inherit',
                mt: 5,
              }}
            >
              Dive deep into the world of stocks and stay ahead with <br />
              up-to-the-second market data. Our platform ensures you're always
              informed, allowing you to make swift decisions backed by timely
              and accurate information.
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Image
              src={RealTimeImg}
              alt='Real Time Data Image'
              style={{
                width: '100%',
                height: '20rem',
                objectFit: 'fill',
                borderRadius: '10%',
              }}
            />
          </Grid>
        </Grid>

        <Box mt={4} pb={5}>
          <Grid
            container
            spacing={5}
            sx={{
              mt: 5,
              mb: 10,
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Grid item xs={6}>
              <Image
                src={HisDataImg}
                alt='Placeholder'
                style={{
                  width: '100%',
                  height: '20rem',
                  objectFit: 'fill',
                  borderRadius: '10%',
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant='h4'
                sx={{
                  fontWeight: 600,
                  fontSize: '3rem',
                  fontFamily: 'inherit',
                }}
              >
                Historical Data
              </Typography>
              <Typography
                variant='body1'
                sx={{
                  fontWeight: 500,
                  fontSize: '1.2rem',
                  fontFamily: 'inherit',
                  mt: 5,
                }}
              >
                Delve into the vast archives of stock market history, exploring
                trends, patterns, and pivotal moments. Our platform offers a
                comprehensive look back, equipping you with the insights to
                forecast and strategize for future market movements.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <br />

      <Box
        sx={{
          mx: 10,
          p: 5,
          mb: 20,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          backdropFilter: 'blur(1px) saturate(180%)',
          backgroundColor: 'rgba(41, 35, 35, 0.25)',
          borderRadius: '2rem',
        }}
      >
        <Image
          src={IndianFlag}
          alt='indian flag'
          style={{
            height: '10%',
            width: '10%',
            objectFit: 'cover',
          }}
        />

        <Typography
          variant='h4'
          sx={{
            fontWeight: 600,
            fontSize: '2.5rem',
            fontFamily: 'inherit',
          }}
        >
          Indian Stocks
        </Typography>
        <Typography
          variant='body1'
          sx={{
            mt: 5,
            fontWeight: 500,
            marginTop: '1rem',
            fontSize: '1rem',
            fontFamily: 'inherit',
          }}
        >
          Dive into the world of Indian stock markets with us. Our platform
          primarily focuses on offering data and insights from the National
          Stock Exchange (NSE). From the bustling activity of blue-chip stocks
          to the potential hidden gems in the small-cap universe, we provide
          comprehensive coverage of the Indian equities market. Stay updated,
          make informed decisions, and harness the potential of one of the
          world's fastest-growing economies.
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
