import axios from 'axios';
// @ts-ignore
import * as UpstoxClient from 'upstox-js-sdk';
import { utcToZonedTime, format } from 'date-fns-tz';
import { isSameDay } from 'date-fns';

// import { redis } from '../lib/redis';
import fetchInstrumentDetails from './fetchInstrumentDetails';

// *****************************************************************
// Helper: Fetch UPSTOX Data | INTRADAY Data
// *****************************************************************
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

// *****************************************************************
// Helper: Get Historical Data By Date
// *****************************************************************
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
  const interval = '1minute';

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

// *****************************************************************
// Helper: Get Market Status Open / Close
// *****************************************************************
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

    // Gov Holidays in 2023
    const closedDates = [
      utcToZonedTime(new Date(2023, 10, 14), istTimeZone), // 14-Nov-2023
      utcToZonedTime(new Date(2023, 10, 27), istTimeZone), // 27-Nov-2023
      utcToZonedTime(new Date(2023, 11, 25), istTimeZone), // 25-Dec-2023
    ];

    const currentTime = new Date(formattedTime);

    // If today is a weekend or the market is closed on a specific date, return 'closed'
    if (
      isWeekend(currentTime) ||
      closedDates.some((closedDate) => isSameDay(currentTime, closedDate))
    ) {
      return 'closed';
    }

    // Market Open Time
    const marketOpenTime = new Date();
    marketOpenTime.setHours(9, 15, 0); // 9:15 am IST

    // Market Close Time
    const marketCloseTime = new Date();
    marketCloseTime.setHours(15, 30, 0); // 3:30 pm IST

    // If the initial status is 'closed' and the current time is within market hours,
    // set status to 'open'
    if (
      status === 'closed' &&
      currentTime >= marketOpenTime &&
      currentTime <= marketCloseTime
    ) {
      status = 'open';
    }

    return status;
  } catch (error) {
    console.log('🚀 getMarketStatus ~ error:', error);
    return;
  }
};

// *****************************************************************
// Helper: Check Is It Holiday/Weekday
// *****************************************************************
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
