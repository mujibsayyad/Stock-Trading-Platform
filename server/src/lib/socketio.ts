import { WebSocket } from 'ws';
import { Server } from 'socket.io';
import protobuf from 'protobufjs';
// @ts-ignore
import * as UpstoxClient from 'upstox-js-sdk';
import { getAccessToken } from '../util/tokenStore';
import fetchInstrumentDetails from '../util/fetchInstrumentDetails';

// Initialize global variables
let protobufRoot: any = null;
let defaultClient = UpstoxClient.ApiClient.instance;
let apiVersion = '2.0';
let OAUTH2 = defaultClient.authentications['OAUTH2'];

const upstoxToken = getAccessToken();
OAUTH2.accessToken = upstoxToken || process.env.UPSTOX_ACCESS_TOKEN;

// Function to authorize the market data feed
const getMarketFeedUrl = async () => {
  return new Promise((resolve, reject) => {
    let apiInstance = new UpstoxClient.WebsocketApi();

    apiInstance.getMarketDataFeedAuthorize(
      apiVersion,
      // @ts-ignore
      (error, data, response) => {
        if (error) reject(error);
        else resolve(data.data.authorizedRedirectUri);
      }
    );
  });
};

const connectWebSocket = async (wsUrl: any) => {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl, {
      headers: {
        'Api-Version': apiVersion,
        Authorization: 'Bearer ' + OAUTH2.accessToken,
      },
      followRedirects: true,
    });

    ws.on('open', () => {
      console.log('connected');
      resolve(ws);
    });

    ws.on('close', () => {
      console.log('disconnected');
    });

    ws.on('error', (error) => {
      console.log('error:', error);
      reject(error);
    });
  });
};

const initProtobuf = async () => {
  protobufRoot = await protobuf.load(__dirname + '/MarketDataFeed.proto');
  console.log('Protobuf part initialization complete');
};

const decodeProfobuf = (buffer: any) => {
  if (!protobufRoot) {
    console.warn('Protobuf part not initialized yet!');
    return null;
  }

  const FeedResponse = protobufRoot.lookupType(
    'com.upstox.marketdatafeeder.rpc.proto.FeedResponse'
  );
  return FeedResponse.decode(buffer);
};

initProtobuf();

const connectSocket = async (app: any) => {
  console.log('🚀 connectSocket');

  const io = new Server(app, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  const socketToWsMap = new Map();

  io.on('connection', (socket) => {
    let ws: any;

    socket.on('selectSymbol', async (symbol: string) => {
      console.log('socket requested data for:', symbol);

      const instrument = await fetchInstrumentDetails(symbol);
      if (!instrument) {
        throw new Error('No instrument found for the given symbol.');
      }

      const instrumentKey = instrument.instrument_key;
      console.log('🚀 socket.on ~ instrumentKey:', instrumentKey);

      try {
        const wsUrl = await getMarketFeedUrl();
        ws = await connectWebSocket(wsUrl);

        socketToWsMap.set(socket.id, ws);

        const data = {
          guid: 'someguid',
          method: 'sub',
          data: {
            mode: 'full',
            instrumentKeys: [instrumentKey],
          },
        };

        ws.send(Buffer.from(JSON.stringify(data)));

        ws.on('message', (data: any) => {
          const decodedData = decodeProfobuf(data);
          console.log('🚀 decodedData:', decodedData);
          socket.emit('symbolData', decodedData);
        });

        // Handle WebSocket errors
        ws.on('error', (err: Error) => {
          console.error('WebSocket Error:', err);
          socket.emit('error', 'WebSocket encountered an error.');
        });

        // Handle WebSocket close events
        ws.on('close', (code: number, reason: string) => {
          console.log(`WebSocket closed. Code: ${code}, Reason: ${reason}`);
          ws.removeAllListeners();
        });
      } catch (error) {
        console.error('An error occurred:', error);
        socket.emit('error', 'Error retrieving data for the given symbol.');
      }
    });

    // Handle socket.io disconnect and close the associated WebSocket
    socket.on('disconnect', (reason: string) => {
      console.log(`Socket.io client disconnected. Reason: ${reason}`);

      // Fetch the WebSocket instance associated with this socket.io socket
      const clientWs = socketToWsMap.get(socket.id);

      // If the WebSocket exists and it's open, close it.
      if (clientWs && clientWs.readyState === clientWs.OPEN) {
        console.log('Closing WebSocket...');
        ws.close();
        ws.removeAllListeners();
        console.log('Associated WebSocket closed.');
      }

      socketToWsMap.delete(socket.id);
    });
  });
};

export default connectSocket;
