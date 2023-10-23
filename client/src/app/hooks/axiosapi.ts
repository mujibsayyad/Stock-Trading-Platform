import api from '../../../axios.config';

export const postData = async <T>(
  url: string,
  userData: Record<string, any>
) => {
  try {
    const res = await api.post<T>(url, userData);
    const data = await res.data;

    return data;
  } catch (error: any) {
    return { error: error?.response?.data };
  }
};

export const getReq = async () => {
  try {
    const req = await api.get('/validate');
    return req.data;
  } catch (error: any) {
    return { error: error?.response?.data };
  }
};

export const searchStock = async (symbol: string) => {
  try {
    const req = await api.get(`/stockdata/search`, {
      params: {
        symbol: symbol,
      },
    });
    return req.data;
  } catch (error: any) {
    return { error: error?.response?.data };
  }
};
