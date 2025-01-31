import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'; 

export interface itemsTypes {
    items: any[];
    type: string;

    
}

const initialState: itemsTypes = {
    items: [],
    type: '',
};

const ItemSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        setItems(state, action: PayloadAction<string[]>) {
            state.items = action.payload;
        },
        setType(state, action: PayloadAction<string>) {
            state.type = action.payload;
        },
    },
});

export const { setItems, setType } = ItemSlice.actions;
export default ItemSlice.reducer;