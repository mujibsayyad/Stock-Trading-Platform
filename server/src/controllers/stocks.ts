import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { Request, Response } from 'express';
import {
  formatDate,
  fetchUpstoxData,
  getMarketStatus,
  getLastMarketData,
} from '../util/fetchStockData';

// *****************************************************************
// Get Stock Data | Real-Time
// *****************************************************************
export const stockData = async (req: Request, res: Response) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    // Get market status open / close
    const marketStatus = await getMarketStatus();
    // Get data when market is open
    const data: any = await fetchUpstoxData(symbol);

    if (marketStatus === 'closed') {
      //  If the market was open and closed on time, show the data of that day.
      if (data?.data?.candles?.length > 0) {
        return res
          .status(200)
          .json({ data: data.data, type: 'closed_intraday', marketStatus });
      }
      // Else market didn't open due to holiday or weekday, show last 7 days data.
      else {
        // Calculate the date range for the last 7 days
        const today = new Date();
        const sevenDaysAgo = new Date(today);

        // Subtract 7 days from today
        sevenDaysAgo.setDate(today.getDate() - 7);

        const fromDate = formatDate(sevenDaysAgo);
        const toDate = formatDate(today);

        // Fetch historical data for the date range
        const historyData: any = await getLastMarketData({
          symbol,
          toDate,
          fromDate,
        });
        return res
          .status(200)
          .json({ data: historyData.data, type: 'historical', marketStatus });
      }
    } else {
      return res
        .status(200)
        .json({ data: data.data, type: 'open_intraday', marketStatus });
    }
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// *****************************************************************
// Get Historical Data By Date
// *****************************************************************
export const HistoricalData = async (req: Request, res: Response) => {
  try {
    const marketStatus = await getMarketStatus();
    const day = req.params.day.slice(0, -1);
    const symbol = req.params.symbol.toUpperCase();

    const today = new Date();
    const daysAgo = new Date(today);

    // Subtract user selected days from today
    daysAgo.setDate(today.getDate() - Number(day));

    const fromDate = formatDate(daysAgo);
    const toDate = formatDate(today);

    // Fetch the data for the date range
    const historyData: any = await getLastMarketData({
      symbol,
      toDate,
      fromDate,
    });
    return res
      .status(200)
      .json({ data: historyData.data, type: 'historical', marketStatus });
  } catch (error) {
    console.error('Internal server error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// *****************************************************************
// Get Stock Search Data
// *****************************************************************
export const stockSearch = async (req: Request, res: Response) => {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).send('symbol is required.');
  }

  const uppercaseSymbol = (symbol as string).toUpperCase();

  // Set the response to stream in chunks
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Transfer-Encoding', 'chunked');

  // Using a Readable stream and the csv-parser library
  const stream = fs
    .createReadStream(path.join(__dirname, '..', 'util', 'NSE.csv'))
    .pipe(csv());

  const symbolResults = new Map();

  stream.on('data', (row) => {
    if (row.tradingsymbol.includes(uppercaseSymbol)) {
      // Extract the main part of the symbol using regex
      const mainSymbol = row.tradingsymbol.match(/^[A-Z]+/)[0];

      if (!symbolResults.has(mainSymbol)) {
        symbolResults.set(mainSymbol, row.name);
      }
    }
  });

  // When the stream ends, end the response.
  stream.on('end', () => {
    if (symbolResults.size === 0) {
      res.status(404).json({ message: 'No stocks found' });
    } else {
      const output = Object.fromEntries(symbolResults);
      res.status(200).json(output);
    }
  });

  // Handle any errors from the stream
  stream.on('error', (error) => {
    console.log('🚀 searchStock stream.error', error);
    res.status(500).end();
  });
};
