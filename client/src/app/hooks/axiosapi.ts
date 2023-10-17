import api from '../../../axios.config';

export const postData = async <T>(
  url: string,
  userData: Record<string, any>
): Promise<T> => {
  try {
    const res = await api.post<T>(url, userData);
    const data = await res.data;

    return data;
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code outside the range of 2xx
      throw new Error(
        `Request failed with status code ${error.response.status}`
      );
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received from the server.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Request setup error: ${error.message}`);
    }
  }
};

export const getReq = async () => {
  try {
    const req = await api.get('/validate');
    return req.data;
  } catch (error: any) {
    console.log('getReq.error', error?.response?.data);
    return { error: error?.response?.data };
  }
};
