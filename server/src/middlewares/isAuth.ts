import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  token?: string;
  user?: any;
}

const PRIVATE_KEY = process.env.PRIVATE_KEY as string;

const customLogger = (message: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(message);
  }
};

const isAuthenticate = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwtoken;

  customLogger('🚀 token:' + (token ? 'token available' : 'No Token'));

  if (!token) {
    if (process.env.NODE_ENV === 'production') {
      return res.end();
    }
    return res.status(401).json({ error: 'No Token, Authorization Failed' });
  }

  if (!PRIVATE_KEY) {
    customLogger('🚀 PRIVATE_KEY is not set.');
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  try {
    const decoded = jwt.verify(token, PRIVATE_KEY);
    req.token = token;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log('JWT Token Expired');
      return res
        .status(401)
        .json({ name: 'TokenExpiredError', message: 'jwt expired' });
    }

    customLogger('🚀 isAuth catch.error: ' + error);

    res.status(401).json({
      message: 'Unauthorized: token invalid',
    });
  }
};

export default isAuthenticate;
