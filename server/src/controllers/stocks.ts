import { Request, Response } from 'express';
import { fetchUpstoxData } from '../util/fetchStockData';

export const stockData = async (req: Request, res: Response) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const data = await fetchUpstoxData(symbol);
    res.json(data);
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// export const stockData = async (req: Request, res: Response) => {
//   try {
//     const symbol = req.params.symbol.toUpperCase();
//     console.log('🚀 Fetching data for symbol:', symbol);

//     const instrument = await fetchInstrumentDetails(symbol);

//     if (!instrument) {
//       return res
//         .status(404)
//         .json({ message: 'No instrument found for the given symbol.' });
//     }

//     const instrumentKey = instrument.instrument_key;
//     const interval = '1minute';
//     console.log('🚀 instrumentKey:', instrumentKey);
//     let apiInstance = new UpstoxClient.HistoryApi();
//     let apiVersion = '2.0'; // String | API Version Header

//     apiInstance.getIntraDayCandleData(
//       instrumentKey,
//       interval,
//       apiVersion,
//       // @ts-ignore
//       (error, data, response) => {
//         if (error) {
//           console.error('Error calling Upstox API:', error);
//           return res
//             .status(500)
//             .json({ message: 'Failed to fetch data from Upstox.' });
//         } else {
//           res.json(data);
//         }
//       }
//     );
//   } catch (error) {
//     console.error('Internal server error:', error);
//     res.status(500).json({ message: 'Internal server error.' });
//   }
// };

// Search stocks
export const stockSearch = async (req: Request, res: Response) => {
  const { symbol } = req.query;
  console.log('🚀 req.query:', req.query);

  // if (!symbol) {
  //   return res.status(400).send('symbol is required.');
  // }

  // try {
  //   const cacheStockData = await redis.get('tata');
  //   if (cacheStockData) {
  //     console.log('🚀 serving cacheStockData:tata', cacheStockData);
  //     return res.status(200).json(JSON.parse(cacheStockData));
  //   }

  //   // SEARCH FOR COMPANY BY NAME/KEYWORD
  //   const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${process.env.STOCK_API}`;

  //   const { data } = await axios.get(url);

  //   if (!data?.bestMatches.length) {
  //     return res.status(404).json({ error: 'Data not found' });
  //   }

  //   console.log('🚀 I hitted real api 🚀');

  //   await redis.set('tata', JSON.stringify(data?.bestMatches));
  //   await redis.expire('tata', 10000);

  //   return res.status(200).json(data?.bestMatches);
  // } catch (error) {
  //   console.log('🚀 stockSearch ~ error:', error);
  //   res.status(500).json({ error: 'Internal server error' });
  // }
};

// export const stockData = async (req: Request, res: Response) => {
//   console.log('🚀 req.params:', req.params);
//   const { market, symbol } = req.params;

//   try {
//     const data = await fetchStockData(market, symbol);

//     // Check if data contains an error message or if time series data is missing
//     if ('error' in data) {
//       return res.status(404).json({ error: data.error });
//     }

//     return res.status(200).json({ stockData: data });
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     return res.status(500).json({ error: 'Server error' });
//   }
// };

// alternative way of fetching data from api

// try {
//   const response = await axios.get(
//     `https://api-v2.upstox.com/historical-candle/intraday/${instrumentKey}/${interval}`,
//     {
//       headers: {
//         'Api-Version': '2.0',
//         // Add Authorization header here if needed for authentication
//       },
//     }
//   );

//   console.log('🚀 data:', response.data);
//   res.json(response.data);
// } catch (err: any) {
//   console.error('Error fetching intra-day candle data:', err);
//   console.error('Error details:', err.response && err.response.data);
//   res.status(500).json({ message: 'Error fetching intra-day candle data' });
// }
