// @ts-ignore
import * as UpstoxClient from 'upstox-js-sdk';
import fetchInstrumentDetails from './fetchInstrumentDetails';
// import { redis } from '../lib/redis';
import { WebSocket } from 'ws';

export const fetchUpstoxData = async (symbol: string): Promise<string> => {
  const instrument = await fetchInstrumentDetails(symbol);
  if (!instrument) {
    throw new Error('No instrument found for the given symbol.');
  }

  const interval = '1minute';
  const instrumentKey = instrument.instrument_key;

  // const cacheStockData = await redis.get(instrument.instrument_key);

  // if (cacheStockData) {
  //   console.log('🚀 serving cacheStockData:');
  //   return JSON.parse(cacheStockData);
  // }

  console.log('🚀 serving real api:');
  return new Promise((resolve, reject) => {
    let apiInstance = new UpstoxClient.HistoryApi();
    let apiVersion = '2.0';
    apiInstance.getIntraDayCandleData(
      instrumentKey,
      interval,
      apiVersion,
      // @ts-ignore
      (error, data, response) => {
        if (error) {
          console.log('🚀 fetchUpstoxData error:', error);
          reject(error);
        } else {
          // redis.set(instrument.instrument_key, JSON.stringify(data));
          // redis.expire(instrument.instrument_key, 1000);
          resolve(data);
        }
      }
    );
  });
};

// import axios from 'axios';

// type StockDataResponse = {
//   date: Date;
//   open: number;
//   high: number;
//   low: number;
//   close: number;
//   volume: number;
// }[];
// type StockError = { error: string };
// // const url = `http://api.marketstack.com/v1/intraday?access_key=${process.env.STOCK_API}&symbols=${symbol}`;

// type FetchStockDataResult = StockDataResponse | StockError;

// const fetchStockData = async (
//   market: string,
//   symbol: string
// ): Promise<FetchStockDataResult> => {
//   const INTERVAL = 1;

//   // Adjust the symbol based on market
//   const adjustedSymbol = market === 'BSE' ? `${symbol}.${market}` : symbol;

//   const cacheStockData = await redis.get('stockData');
//   if (cacheStockData) {
//     console.log('🚀 serving cacheStockData:');
//     return JSON.parse(cacheStockData);
//   }

//   const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${adjustedSymbol}&interval=${INTERVAL}&apikey=${process.env.STOCK_API}`;

//   try {
//     const response = await axios.get(url);
//     const resData = response.data;

//     if (!resData || !resData['Time Series (1)']) {
//       console.log('🚀 stockData:error', resData);
//       return { error: 'No data found' };
//     }

//     console.log('🚀 I hitted real api 🚀');

//     const rawData = resData['Time Series (1)'];

//     const transformedData = Object.keys(rawData).map((date) => ({
//       date: new Date(date),
//       open: +rawData[date]['1. open'],
//       high: +rawData[date]['2. high'],
//       low: +rawData[date]['3. low'],
//       close: +rawData[date]['4. close'],
//       volume: +rawData[date]['5. volume'],
//     }));

//     await redis.set('stockData', JSON.stringify(transformedData));
//     await redis.expire('stockData', 300);

//     return transformedData;
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     throw error;
//   }
// };

// export default fetchStockData;
