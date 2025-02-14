import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'; 


export interface ownerTypes {
    owners: any[];
    owners_accounts: any[];
}

const initialState: ownerTypes = {
    owners: [],
    owners_accounts: [],
};

const OwnerSlice = createSlice({
    name: 'owners',
    initialState,
    reducers: {
        setOwners(state, action: PayloadAction<string[]>) {
            state.owners = action.payload;
        },
        setOwnersAccounts(state, action: PayloadAction<string[]>) {
            state.owners_accounts = action.payload;
        },
    },
});

export const { setOwners, setOwnersAccounts } = OwnerSlice.actions;
export default OwnerSlice.reducer;