import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'; 

export interface metricsTypes {
   data: any[];
   totalAmountEntered: any;

    
}

const initialState: metricsTypes = {
   data: [],
   totalAmountEntered: 0,
};

const MetricsSlice = createSlice({
   name: 'metrics',
   initialState,
   reducers: {
       setData(state, action: PayloadAction<any[]>) {
           state.data = action.payload;
       },
         setTotalAmountEntered(state, action: PayloadAction<any>) {
              state.totalAmountEntered = action.payload;
         },
   },
});

export const { setData, setTotalAmountEntered } = MetricsSlice.actions;
export default MetricsSlice.reducer;