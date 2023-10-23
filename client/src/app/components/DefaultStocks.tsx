'use client';
import { useState, useEffect, FC } from 'react';
import {
  Container,
  Box,
  Input,
  Button,
  InputAdornment,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

import StockGrid from './StockGrid';
import defaultStocks from './Stocks';
import useDebounce from '../hooks/debounce';
import { searchStock } from '../hooks/axiosapi';

// TS Interface
interface DefaultStocksProps {
  getStateFromStocks: (data: boolean) => void;
}

const DefaultStocks: FC<DefaultStocksProps> = ({ getStateFromStocks }) => {
  const [stocks, setStocks] = useState<any[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const debouncedQuery = useDebounce(inputText, 1000);

  useEffect(() => {
    if (debouncedQuery) {
      setLoading(true);
      const stockSearch = async () => {
        try {
          const res = await searchStock(debouncedQuery);

          if (!res?.error?.message) {
            const stockArray = Object.entries(res).map(([key, value]) => ({
              name: key,
              companyName: value,
            }));

            setStocks(stockArray);
          } else {
            setStocks([]);
          }
        } catch (error) {
          console.error('Error fetching stocks:', error);
          setStocks([]);
        } finally {
          setLoading(false);
        }
      };

      stockSearch();
    }
  }, [debouncedQuery]);

  // Clear search input
  const handleClearButton = () => {
    setInputText('');
  };

  // Close default stock list page
  const handleCloseButton = () => {
    getStateFromStocks(false);
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        position: 'fixed',
      }}
    >
      <Container
        disableGutters
        maxWidth={false}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Input Section */}
        <Box
          sx={{
            background: '#000000',
            height: '4rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Input
            placeholder='Symbol, eg. TATAMOTORS'
            disableUnderline
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            startAdornment={
              <InputAdornment position='start'>
                <Search sx={{ color: '#d1d4dc' }} />
              </InputAdornment>
            }
            sx={{
              color: '#d1d4dc',
              backgroundColor: '#2A2E39',
              borderRadius: '2rem',
              padding: '0.4rem 1rem',
              width: {
                xs: '95%',
                sm: '60%',
              },
              '&:focus': {
                backgroundColor: 'white',
                boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
              },
            }}
            endAdornment={
              <InputAdornment position='end'>
                <Button
                  onClick={handleClearButton}
                  variant='text'
                  sx={{
                    color: '#868993',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    textTransform: 'none',
                    borderRadius: 0,
                    borderRight: '1px solid #434651',
                    paddingTop: '0.2rem',
                    paddingBottom: '0.2rem',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      color: 'white',
                    },
                  }}
                >
                  Clear
                </Button>
                <Button
                  onClick={handleCloseButton}
                  sx={{
                    color: '#868993',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: 'white',
                    },
                  }}
                >
                  <Clear sx={{ fontSize: '1.3rem' }} />
                </Button>
              </InputAdornment>
            }
          />
        </Box>

        {/* Stocks Grid */}
        {inputText ? (
          <StockGrid stocks={stocks} stockLoading={loading} />
        ) : (
          <StockGrid stocks={defaultStocks} stockLoading={loading} />
        )}
      </Container>
    </Box>
  );
};

export default DefaultStocks;
