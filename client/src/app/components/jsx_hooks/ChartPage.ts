const DEFAULT_COLOR = '#b2b5be';
const GREEN = '#089981';
const RED = '#F23645';

// * Determines the color of a candle based on its open and close values.
const determineColor = (open: number, close: number) => {
  if (close > open) return GREEN;
  if (close < open) return RED;
  return DEFAULT_COLOR;
};

// * Transforms API response data to a series suitable for chart rendering.
const transformDataToSeries = (response: any) =>
  response.data.candles.map((item: any) => ({
    time: new Date(item[0]).getTime() / 1000,
    open: item[1],
    high: item[2],
    low: item[3],
    close: item[4],
  }));

// * Transforms a single data point to the format suitable for chart update.
const transformSingleDataToPoint = (dataPoint: any) => {
  if (
    !dataPoint.ts ||
    dataPoint.open === null ||
    dataPoint.high === null ||
    dataPoint.low === null ||
    dataPoint.close === null
  ) {
    console.error('transformSingleDataToPoint Invalid data point:', dataPoint);
    return null;
  }

  return {
    time: new Date(parseInt(dataPoint.ts)).getTime() / 1000,
    open: dataPoint.open,
    high: dataPoint.high,
    low: dataPoint.low,
    close: dataPoint.close,
  };
};

const ohlcObj = {
  open: 0,
  high: 0,
  low: 0,
  close: 0,
};

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export {
  RED,
  GREEN,
  ohlcObj,
  monthNames,
  DEFAULT_COLOR,
  determineColor,
  transformDataToSeries,
  transformSingleDataToPoint,
};
