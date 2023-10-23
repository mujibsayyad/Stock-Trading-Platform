import 'dotenv/config';
import http from 'http';
import app from './app';
import connectDB from './lib/mongodb';
// import connectRedis from './lib/redis';
import connectSocket from './lib/socketio';

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    await connectSocket(server);
    // await connectRedis();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  server.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
  });
})();
