import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'; 

export interface movementTypes {
    products: any[];
    total_movement: number | string;
    owner: string;
    bank_account: string;
    movement_type: string;
    movement_date: string;
    movement_description: string;

    
}


const initialState: movementTypes = {
    products: [],
    total_movement: 0,
    owner: '',
    bank_account: '',
    movement_type: '',
    movement_date: '',
    movement_description: '',
};

const ProductSlice = createSlice({
    name: 'movements',
    initialState,
    reducers: {
        setProducts(state, action: PayloadAction<any[]>) {
            state.products = action.payload;
        },
        setTotalMovement(state, action: PayloadAction<number | string>) {
            state.total_movement = action.payload;
        },
        setOwner(state, action: PayloadAction<string>) {
            state.owner = action.payload;
        },
        setBankAccount(state, action: PayloadAction<string>) {
            state.bank_account = action.payload;
        },
        setMovementType(state, action: PayloadAction<string>) {
            state.movement_type = action.payload;
        },
        setMovementDate(state, action: PayloadAction<string>) {
            state.movement_date = action.payload;
        },
        setMovementDescription(state, action: PayloadAction<string>) {
            state.movement_description = action.payload;
        },
    },
});

export const { setProducts, setTotalMovement, setOwner, setBankAccount, setMovementType, setMovementDate, setMovementDescription } = ProductSlice.actions;
export default ProductSlice.reducer;