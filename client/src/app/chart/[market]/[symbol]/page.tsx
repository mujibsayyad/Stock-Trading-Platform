'use client';
import { useState, useEffect, useRef, FC } from 'react';
import { useParams, usePathname } from 'next/navigation';
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
} from 'lightweight-charts';
import { Box, Typography, Grid } from '@mui/material';

//* ************** Custom imports *************** *//
import { socket } from '@/app/middleware/socket';
import { useGetStockDataQuery } from '@/lib/redux/api/stockApi';
import WithAuth, { WithAuthProps } from '@/app/middleware/WithAuth';

const DEFAULT_COLOR = '#b2b5be';
const GREEN = '#089981';
const RED = '#F23645';
const BLACK = 'black';

// * Determines the color of a candle based on its open and close values.
const determineColor = (open: number, close: number) => {
  if (close > open) return GREEN;
  if (close < open) return RED;
  return BLACK;
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

const StockData: FC<WithAuthProps> = ({ isAuthenticated }) => {
  const [chart, setChart] = useState<IChartApi | null>(null);
  const [series, setSeries] = useState<ISeriesApi<'Candlestick'> | null>(null);
  const [color, setColor] = useState<string>(DEFAULT_COLOR);
  const [latestOhlc, setLatestOhlc] = useState(ohlcObj);
  const [ohlc, setOhlc] = useState(ohlcObj);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverColor, setHoverColor] = useState<string>(DEFAULT_COLOR);
  const [prevClose, setPrevClose] = useState<number>(0);

  const chartContainerRef = useRef(null);
  const params = useParams();
  const pathname = usePathname();

  // Search stock by url params (rtk api)
  const { data } = useGetStockDataQuery(params, {
    skip: !isAuthenticated,
  });

  const updateOHLCData = (param: any) => {
    if (param.seriesData && param.seriesData.has(series)) {
      const price = param.seriesData.get(series);
      if (price) {
        setOhlc({
          open: price.open,
          high: price.high,
          low: price.low,
          close: price.close,
        });

        // determineColor function to set the color
        setHoverColor(determineColor(price.open, price.close));
        setIsHovered(true);
      } else {
        setOhlc(latestOhlc);
        setIsHovered(false);
      }
    }
  };

  useEffect(() => {
    if (chartContainerRef.current && !chart) {
      const newChart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: '#151924' },
          textColor: DEFAULT_COLOR,
        },
        grid: {
          vertLines: { color: '#232632' },
          horzLines: { color: '#232632' },
        },
        localization: {
          priceFormatter: (price: number) => `₹${price.toFixed(2)}`,
          timeFormatter: (time: number) => {
            const dateObj = new Date(time * 1000);
            return `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj
              .getMinutes()
              .toString()
              .padStart(2, '0')}`;
          },
        },
      });

      newChart.timeScale().applyOptions({
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: number) => {
          const date = new Date(time * 1000);
          return `${date.getHours().toString().padStart(2, '0')}:${date
            .getMinutes()
            .toString()
            .padStart(2, '0')}`;
        },
      });

      const newSeries = newChart.addCandlestickSeries({
        upColor: GREEN,
        downColor: RED,
        borderDownColor: RED,
        borderUpColor: GREEN,
        wickDownColor: RED,
        wickUpColor: GREEN,
      });

      setChart(newChart);
      setSeries(newSeries);
    }

    if (data && series) {
      let formattedData = transformDataToSeries(data).reverse();
      series.setData(formattedData);

      // Get the last data point which will be the latest data
      const latestDataPoint = formattedData[0];

      if (latestDataPoint) {
        setLatestOhlc({
          open: latestDataPoint.open,
          high: latestDataPoint.high,
          low: latestDataPoint.low,
          close: latestDataPoint.close,
        });

        // Set the color based on the latest data point
        if (latestDataPoint.close > latestDataPoint.open) {
          setColor(GREEN); // Green for price up
        } else if (latestDataPoint.close < latestDataPoint.open) {
          setColor(RED); // Red for price down
        } else {
          setColor('black'); // Default for unchanged
        }
      }

      // Subscribe to crosshair move to get the hovered candlestick data
      chart?.subscribeCrosshairMove((param) => {
        if (param.point && param.seriesData && param.seriesData.has(series)) {
          setIsHovered(true);
          updateOHLCData(param);
        } else {
          setIsHovered(false);
        }
      });

      chart?.timeScale().fitContent();
    }

    socket.emit('selectSymbol', params.symbol);

    socket.on('symbolData', (newData) => {
      if (newData && newData.type === 'live_feed') {
        // Extracting the dynamic stock key
        const stockKey = Object.keys(newData.feeds || {})[0];

        if (!stockKey) {
          console.log('No valid stock key found');
          return;
        }

        // Accessing nested OHLC data
        const ohlcData =
          newData.feeds[stockKey]?.ff?.marketFF?.marketOHLC?.ohlc;

        if (ohlcData) {
          const filteredData = ohlcData.filter(
            (item: any) => item.interval === 'I1'
          );

          setPrevClose(latestOhlc.close);

          const oneMinDataPoint = filteredData[1];
          const lastDataPoint = filteredData[0];

          if (lastDataPoint) {
            setPrevClose(lastDataPoint.close);
          }

          if (oneMinDataPoint && series) {
            const formattedData = transformSingleDataToPoint(oneMinDataPoint);
            // @ts-ignore
            series?.update(formattedData);
          }

          // Save this data as the latest OHLC data
          setLatestOhlc({
            open: oneMinDataPoint.open,
            high: oneMinDataPoint.high,
            low: oneMinDataPoint.low,
            close: oneMinDataPoint.close,
          });

          // Set the color based on the latest data
          if (oneMinDataPoint.close > oneMinDataPoint.open) {
            setColor(GREEN); // Green for price up
          } else if (oneMinDataPoint.close < oneMinDataPoint.open) {
            setColor(RED); // Red for price down
          } else {
            setColor('black');
          }
        }
      }
    });

    return () => {
      if (!pathname.startsWith('/chart/')) {
        console.log('chart cleanup socket ran');
        socket.off('symbolData');
        socket.disconnect();
      }

      // Cleanup: Unsubscribe from crosshair move when the component is unmounted
      if (chart) {
        chart.unsubscribeCrosshairMove(updateOHLCData);
      }
    };
  }, [data, chart, series]);

  // *****************************************************************************

  // Percentage change of current data
  const percentageChangeValue =
    ((latestOhlc.close - prevClose) / prevClose) * 100;
  // Price diffrence between last data and new data
  const priceChangeValue = latestOhlc.close - prevClose;

  // Update title based on current values
  useEffect(() => {
    const prefix = percentageChangeValue > 0 ? '+' : '';

    const newTitle = `${params.market} : ${
      params.symbol
    } (${prefix}${percentageChangeValue.toFixed(2)}%)`;

    document.title = newTitle;
  }, [percentageChangeValue]);

  if (!isAuthenticated) return null;

  return (
    <Grid container sx={{ mt: 8 }}>
      <Grid item xs={12} sm={8} sx={{ ml: 0.2 }}>
        <Box className='chartWrapper'>
          <Box className='ohlcInfo' display='flex' gap={2}>
            <Typography variant='body2'>
              Open:{' '}
              <span style={{ color: isHovered ? hoverColor : color }}>
                {isHovered ? ohlc.open.toFixed(2) : latestOhlc.open.toFixed(2)}
              </span>
            </Typography>
            <Typography variant='body2'>
              High:{' '}
              <span style={{ color: isHovered ? hoverColor : color }}>
                {isHovered ? ohlc.high.toFixed(2) : latestOhlc.high.toFixed(2)}
              </span>
            </Typography>
            <Typography variant='body2'>
              Low:{' '}
              <span style={{ color: isHovered ? hoverColor : color }}>
                {isHovered ? ohlc.low.toFixed(2) : latestOhlc.low.toFixed(2)}
              </span>
            </Typography>
            <Typography variant='body2'>
              Close:{' '}
              <span style={{ color: isHovered ? hoverColor : color }}>
                {isHovered
                  ? ohlc.close.toFixed(2)
                  : latestOhlc.close.toFixed(2)}
              </span>
            </Typography>
          </Box>
          <Box
            ref={chartContainerRef}
            sx={{ width: '100%', height: '550px' }}
          ></Box>
        </Box>
      </Grid>
      <Grid
        item
        style={{ flexGrow: 1 }}
        sx={{
          mx: 2,
          my: 2.5,
          backdropFilter: 'blur(0.5rem)',
          transition: 'backgroundColor 0.5s',
          borderRadius: '1rem',
          background: '#03001Ccc',
          height: 'fit-content',
        }}
      >
        <Typography
          variant='h5'
          sx={{
            background: '#03C988bb',
            backdropFilter: 'blur(5px)',
            textAlign: 'center',
            borderRadius: '2rem',
            mb: 2,
            padding: 1,
          }}
        >
          {params.market} : {params.symbol}
        </Typography>

        <Box
          sx={{
            background: '#1B2430',
            backdropFilter: 'blur(5px)',
            borderRadius: '1rem',
            p: 2,
          }}
        >
          <Typography
            variant='body1'
            sx={{
              backdropFilter: 'blur(5px)',
              textAlign: 'center',
              borderRadius: '2rem',
              mb: 2,
              padding: 1,
              fontWeight: '600',
              width: 'fit-content',
            }}
          >
            Date: {new Date().toLocaleDateString()}
          </Typography>

          <Typography
            variant='body1'
            sx={{
              textAlign: 'left',
              borderRadius: '2rem',
              mb: 2,
              padding: 1,
              fontWeight: '600',
            }}
          >
            Latest Value: ₹{Number(latestOhlc.close).toFixed(2)}
          </Typography>

          <Typography
            variant='body1'
            sx={{
              textAlign: 'left',
              borderRadius: '2rem',
              mb: 2,
              padding: 1,
              fontWeight: '600',
            }}
          >
            Last Value: ₹{Number(prevClose).toFixed(2)}
          </Typography>

          <Typography
            variant='body1'
            sx={{
              textAlign: 'left',
              borderRadius: '2rem',
              mb: 2,
              padding: 1,
              fontWeight: '600',
            }}
          >
            Price Change:{' '}
            <span style={{ color: priceChangeValue < 0 ? RED : GREEN }}>
              ₹ {priceChangeValue > 0 ? '+' : ''}
              {priceChangeValue.toFixed(2)}
            </span>
          </Typography>

          <Typography
            variant='body1'
            sx={{
              textAlign: 'left',
              borderRadius: '2rem',
              mb: 2,
              padding: 1,
              fontWeight: '600',
              width: 'fit-content',
            }}
          >
            Percentage Change:{' '}
            <span style={{ color: percentageChangeValue < 0 ? RED : GREEN }}>
              {percentageChangeValue > 0 ? '+' : ''}
              {percentageChangeValue.toFixed(2)}%
            </span>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default WithAuth(StockData) as FC;
