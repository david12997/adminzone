import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'; 


export interface transactionTypes {
    current_transaction: {
        type_movement: string;
        amount: number;
        concept: string;
        account_id: string;
        user_id: string;
        products: any[];
        data_transaction: any[];
    };
    current_status: string;
}

const initialState: transactionTypes = {
    current_transaction: {
        type_movement: 'entrada',
        amount: 0,
        concept: '',
        account_id: '',
        user_id: '',
        products: [],
        data_transaction: [],
    },
    current_status: '',
};

const TransactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        setTransaction: (state, action: PayloadAction<transactionTypes['current_transaction']>) => {
            state.current_transaction = action.payload;
        },
        setStatus: (state, action: PayloadAction<string>) => {
            state.current_status = action.payload;
        },
    },
});

export const { setTransaction, setStatus } = TransactionSlice.actions;
export default TransactionSlice.reducer;