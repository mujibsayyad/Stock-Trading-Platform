// @ts-ignore
import * as UpstoxClient from 'upstox-js-sdk';
import fetchInstrumentDetails from './fetchInstrumentDetails';
import { utcToZonedTime, format } from 'date-fns-tz';
// import { redis } from '../lib/redis';
import axios from 'axios';

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

  // console.log('🚀 serving real api:');
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

// Get Historical data by date
interface marketPara {
  symbol: string;
  toDate: string;
  fromDate: string;
}

export const getLastMarketData = async ({
  symbol,
  toDate,
  fromDate,
}: marketPara) => {
  const instrument = await fetchInstrumentDetails(symbol);
  if (!instrument) {
    throw new Error('No instrument found for the given symbol.');
  }
  const instrumentKey = instrument.instrument_key;
  const apiInstance = new UpstoxClient.HistoryApi();
  const apiVersion = '2.0';
  const interval = '30minute';

  return new Promise((resolve, reject) => {
    apiInstance.getHistoricalCandleData1(
      instrumentKey,
      interval,
      toDate,
      fromDate,
      apiVersion,
      // @ts-ignore
      (error, data, response) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          resolve(data);
        }
      }
    );
  });
};

// Get market status open / close
export const getMarketStatus = async (): Promise<string | undefined> => {
  try {
    const url = `https://www.alphavantage.co/query?function=MARKET_STATUS&apikey=demo`;
    const res = await axios.get(url);

    const indiaMarketStatus = res.data.markets.filter(
      (market: any) => market.region === 'India'
    );

    if (!indiaMarketStatus.length) {
      return 'Market Not Found';
    }

    // Market status open / close
    let status = indiaMarketStatus[0].current_status;

    // Convert current UTC time to IST
    const istTimeZone = 'Asia/Kolkata';
    const nowInIST = utcToZonedTime(new Date(), istTimeZone);

    const formattedTime = format(nowInIST, 'yyyy-MM-dd HH:mm:ss', {
      timeZone: istTimeZone,
    });

    const currentTime = new Date(formattedTime);

    // If today is a weekend, return 'closed'
    if (isWeekend(currentTime)) {
      return 'closed';
    }

    // Extending extra time, due to mismatch closing time with alphavantage api
    if (status === 'closed') {
      const closingTime = new Date();
      closingTime.setHours(15, 30, 0); // 3:30 pm IST

      // Extend the 'open' status till 3:30 pm
      if (currentTime <= closingTime) {
        status = 'open';
      }
    }
    return status;
  } catch (error) {
    console.log('🚀 getMarketStatus ~ error:', error);
    return;
  }
};

// Get day to check it's not holiday
export const isWeekend = (date: Date) => {
  const day = date.getDay();
  // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  return day === 0 || day === 6;
};

// Format to full date (YYYY-MM-DD / 2022-10-01)
export const formatDate = (date: Date): string => {
  let dd: string | number = date.getDate();
  let mm: string | number = date.getMonth() + 1; // January is 0!
  const yyyy: number = date.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  return `${yyyy}-${mm}-${dd}`;
};
