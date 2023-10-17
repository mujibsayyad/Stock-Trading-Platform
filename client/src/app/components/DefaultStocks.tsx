'use client';
import { useState, useMemo, FC } from 'react';
import {
  Container,
  Box,
  Input,
  Button,
  Typography,
  InputAdornment,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

import StockGrid from './StockGrid';
import defaultStocks from './Stocks';
import useDebounce from '../hooks/debounce';
import { useSearchStockQuery } from '@/lib/redux/api/stockApi';

// TS Interface
interface DefaultStocksProps {
  getStateFromStocks: (data: boolean) => void;
}

const DefaultStocks: FC<DefaultStocksProps> = ({ getStateFromStocks }) => {
  const [inputText, setInputText] = useState<string>('');

  const debouncedQuery = useDebounce(inputText, 5000);

  // Search stock by url params (rtk api)
  const {
    data: searchedStockData,
    error,
    isLoading,
    isFetching,
  } = useSearchStockQuery(debouncedQuery, {
    skip: !debouncedQuery,
  });

  // Transform searched data into default stock data format
  const transformSearchedData = (data: any[]): any[] => {
    if (!data || !Array.isArray(data)) return [];

    return data.map((stock) => {
      return {
        name: stock['1. symbol']?.split('.')[0],
        companyName: stock['2. name'],
        symbol: stock['1. symbol']?.split('.')[1],
        country: stock['4. region']?.split('/')[0],
      };
    });
  };

  const reshapedData = useMemo(
    () => transformSearchedData(searchedStockData),
    [searchedStockData]
  );

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
              width: '60%',
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
          reshapedData?.length > 0 ? (
            <StockGrid stocks={reshapedData} />
          ) : (
            <Typography variant='h6'>No data found</Typography>
          )
        ) : (
          <StockGrid stocks={defaultStocks} />
        )}
      </Container>
    </Box>
  );
};

export default DefaultStocks;
