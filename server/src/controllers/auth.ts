import { Request, Response } from 'express';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @ts-ignore
import * as UpstoxClient from 'upstox-js-sdk';
const defaultClient = UpstoxClient.ApiClient.instance;

import User from '../models/userSchema';
import { setAccessToken } from '../util/tokenStore';
import {
  signinValidationRules,
  signupValidationRules,
  validate,
} from '../middlewares/validators';

//* ************** Interface *************** *//
interface RequestBody {
  email: string;
  password: string;
}

interface User extends Request {
  user?: string;
}
//* ************** *************** *//

// First time user validation (to check user Signined/loggedIn or not)
export const validateLogin = async (req: User, res: Response) => {
  try {
    if (req.user) {
      // console.log('🚀 validate.req.user:', req.user);
      return res
        .status(200)
        .json({ isSignedIn: true, message: 'User is logged in.' });
    } else {
      return res.status(401).json({
        isSignedIn: false,
        message: 'Unauthorized, please login',
      });
    }
  } catch (error) {
    console.log('validateLogin error', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

//* ************** User SignIn *************** *//
export const signin = [
  ...signinValidationRules(),
  validate,
  async (req: Request, res: Response) => {
    const { email, password } = req.body as RequestBody;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No user found' });
    }

    try {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      console.log('Error comparing password', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    let accessToken;
    try {
      accessToken = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.PRIVATE_KEY as string,
        { expiresIn: '12h' }
      );
    } catch (error) {
      console.log('Error signing JWT', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    res.cookie('jwtoken', accessToken, {
      maxAge: 43200000, // 12 hr
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    });

    return res.status(200).json({
      message: 'Login Successfull',
      isSignedIn: true,
      _id: user.id,
      email: user.email,
      token: accessToken,
    });
  },
];

//* ************** User Signup *************** *//
export const signup = [
  ...signupValidationRules(),
  validate,
  async (req: Request, res: Response) => {
    const { fullname, email, password } = req.body;

    let existingUser = await User.findOne({ email });
    // console.log('🚀 existingUser:', existingUser);

    if (existingUser) {
      return res.status(422).json({ error: 'Email already in use' });
    }

    let hashedPassword = await bcrypt.hash(password, 12);

    let newUser = new User({
      name: fullname,
      email: email,
      password: hashedPassword,
    });

    try {
      await newUser.save();
    } catch (error) {
      console.log('🚀 newUser error:', error);
      return res
        .status(422)
        .json({ error: 'Could not create new user, Please try again' });
    }

    const { id, name, email: userEmail } = newUser;

    let accessToken;
    try {
      accessToken = jwt.sign(
        { _id: id, email: email },
        process.env.PRIVATE_KEY as string,
        { expiresIn: '12h' }
      );
    } catch (error) {
      console.log('Error signing JWT', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    res.cookie('jwtoken', accessToken, {
      maxAge: 43200000, // 12 hr
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    });

    return res.status(200).json({
      message: 'Registration Successful',
      _id: id,
      name: name,
      email: userEmail,
    });
  },
];

// Handle User Logout
export const logout = (req: Request, res: Response) => {
  res.clearCookie('jwtoken', {
    domain: process.env.CLIENT_DOMAIN_NAME,
    secure: true,
    sameSite: 'none',
  });

  return res
    .status(200)
    .json({ isSignedIn: false, message: 'sign out successfully' });
};

//* ************** UPSTOX AUTH *************** *//
export const loginUpstox = async (req: Request, res: Response) => {
  const loginUrl = `https://api-v2.upstox.com/login/authorization/dialog?response_type=code&client_id=${process.env.UPSTOX_API_KEY}&redirect_uri=${process.env.UPSTOX_REDIRECT_URL}`;
  res.redirect(loginUrl);
};

// Callback after successful login
export const redirectUpstox = async (req: Request, res: Response) => {
  const code = req.query.code;
  // console.log('🚀 code:', code);

  // Set up data to get accessToken
  const tokenData = {
    code: code,
    client_id: process.env.UPSTOX_API_KEY,
    client_secret: process.env.UPSTOX_API_SECRET,
    redirect_uri: process.env.UPSTOX_REDIRECT_URL,
    grant_type: 'authorization_code',
  };

  // console.log('🚀 tokenData:', tokenData);

  try {
    const response = await axios.post(
      'https://api-v2.upstox.com/login/authorization/token',
      tokenData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Api-Version': '2.0',
        },
      }
    );

    const accessToken = response.data.access_token;
    // console.log('🚀 accessToken:', accessToken);

    // Store this accessToken for subsequent requests
    setAccessToken(accessToken);
    defaultClient.authentications['OAUTH2'].accessToken = accessToken;

    res.send('Authenticated successfully!');
  } catch (error) {
    console.error(error);
    res.send('Error getting access token');
  }
};
