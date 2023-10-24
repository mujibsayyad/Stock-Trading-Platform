import axios from 'axios';
import qs from 'qs';

interface GoogleOAuthTokenParams {
  code: string;
}

interface GoogleUserParams {
  id_token: string;
  access_token: string;
}

export const getGoogleOAuthToken = async ({ code }: GoogleOAuthTokenParams) => {
  const url = 'https://oauth2.googleapis.com/token';

  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: 'authorization_code',
  };

  try {
    const res = await axios.post(url, qs.stringify(values), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return res.data;
  } catch (error) {
    console.log('🚀 getGoogleOAuthToken.catch.error', error);
    return { error: error };
  }
};

export const getGoogleUser = async ({
  id_token,
  access_token,
}: GoogleUserParams): Promise<any> => {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.log('🚀 getGoogleUser.catch.error', error);
    return { error: error };
  }
};
