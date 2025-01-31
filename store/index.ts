import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import {  persistReducer } from "redux-persist";
import { persistConfig } from "./persist.config";
import { createWrapper } from "next-redux-wrapper";

import MovementSliceReducer from "./movement";
import ItemSliceReducer from "./item";

const rootReducer = combineReducers({

    movement:MovementSliceReducer,
    item:ItemSliceReducer

});

const savedPersistReducer = persistReducer(persistConfig,rootReducer);

export const store = configureStore({
    reducer: savedPersistReducer,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck:false
    }),
    devTools:process.env.NODE_ENV !== 'production'

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const wrapper = createWrapper (()=>store);