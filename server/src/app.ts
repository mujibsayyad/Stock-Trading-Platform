import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import useRoutes from './routes';

const app = express();

app.use(helmet());
app.disable('x-powered-by');

const whiteList = [
  'http://localhost:3000',
  'https://stock-platform.vercel.app',
];

const corsOption = {
  origin: whiteList,
  credentials: true,
};

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', useRoutes);

export default app;
