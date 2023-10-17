import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

// interface for the instrument data
interface Instrument {
  instrument_key: string;
  exchange_token: string;
  tradingsymbol: string;
  name: string;
  last_price: string;
  expiry: string;
  strike: string;
  tick_size: string;
  lot_size: string;
  instrument_type: string;
  option_type: string;
  exchange: string;
}

const fetchInstrumentDetails = async (
  stockName: string
): Promise<Instrument | null> => {
  return new Promise((resolve, reject) => {
    const stream = fs
      .createReadStream(path.join(__dirname, 'NSE.csv'))
      .pipe(csv());

    stream
      .on('data', (row: Instrument) => {
        if (row.tradingsymbol === stockName || row.name === stockName) {
          resolve(row);
          stream.destroy(); // Stop the stream when the data is found
        }
      })
      .on('end', () => {
        resolve(null);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

export default fetchInstrumentDetails;
