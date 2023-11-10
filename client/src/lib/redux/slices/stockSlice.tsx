import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state
interface StockState {
  marketStatus: string;
  dataType: string | null;
}

interface ParamsSymbol {
  symbol: string;
  day?: string;
}

const initialState: StockState = {
  marketStatus: '',
  dataType: null,
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setMarketStatus: (state, action: PayloadAction<string>) => {
      if (action.payload !== state.marketStatus) {
        state.marketStatus = action.payload;
      }
    },
    setDataType: (state, action: PayloadAction<string>) => {
      if (action.payload !== state.dataType) {
        state.dataType = action.payload;
      }
    },
  },
});

export const { setMarketStatus, setDataType } = stockSlice.actions;
export default stockSlice;
