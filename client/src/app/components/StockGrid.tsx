import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect, memo, FC } from 'react';
import { Grid, Typography, Button } from '@mui/material';

import Loader from './Loader';
// Flag Images
import indiaFlag from '../../../public/flags/india-flag.png';

interface StockType {
  name: string;
  companyName: string;
  symbol: string;
  country: string;
}

interface StockGridProps {
  stocks: StockType[];
}

interface StockDataInterface {
  name: string;
  companyName: string;
  symbol: string;
  country: string;
}

const StockGrid: FC<StockGridProps> = ({ stocks }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (loading && pathname.startsWith('/chart/')) {
      setLoading(false); // Set loading to false when the chart route is loaded
    }
  }, [pathname, searchParams]);

  // Handle redirect to chart page
  const handleLaunchChartButton = async (data: StockDataInterface) => {
    console.log('launch chart data:', data);
    const { name, symbol } = data;
    setLoading(true);
    router.push(`/chart/${symbol}/${name}`);
  };

  if (loading) return <Loader />;

  return (
    <Grid
      container
      spacing={2}
      sx={{
        backgroundColor: '#1E222D',
        mt: 3,
        ml: 0,
        borderRadius: '0.2rem',
        width: '60%',
        height: '30rem',
        overflowY: 'scroll !important',
      }}
    >
      {stocks.map((stock, index) => (
        <Grid
          item
          xs={12}
          key={index}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          sx={{
            height: '2.8rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

            placeItems: 'center !important',
            margin: 'auto',
            paddingBottom: '0.2rem',
            borderBottom: '1px solid #2a2e39',
            width: '100%',
            '&:hover': {
              backgroundColor: '#2A2E39',
              transition: 'backgroundColor 0.5s',
            },
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={3} sx={{ textAlign: 'left' }}>
              <Typography variant='body1'>{stock.name}</Typography>
            </Grid>

            <Grid item xs={6} sx={{ textAlign: 'left' }}>
              <Typography variant='body2'>{stock.companyName}</Typography>
            </Grid>

            <Grid
              item
              xs={3}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '24px',
              }}
            >
              {hovered === index ? (
                <Button
                  variant='contained'
                  onClick={() => handleLaunchChartButton(stock)}
                  sx={{
                    color: '#fff',
                    backgroundColor: '#2962ff',
                    boxShadow: 'none',
                    textTransform: 'none',
                    borderRadius: 2,
                    p: '0.02rem 0.6rem',
                    '&:hover': {
                      backgroundColor: '#2962ff',
                    },
                  }}
                >
                  Launch Chart
                </Button>
              ) : (
                <Typography
                  variant='body2'
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {stock.symbol}

                  <Image
                    src={indiaFlag}
                    height={25}
                    width={25}
                    alt='india flag'
                    style={{
                      borderRadius: '50%',
                      marginLeft: '5px',
                    }}
                  />
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default memo(StockGrid);
