// store/index.js

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';



const reducers = combineReducers({
    user: userReducer,
});

// whitelist
const persistConfig = {
    key: 'user',
    storage: storage,
    stateReconciler: autoMergeLevel2,
    //whitelist: ['username', 'userInfo']
};

const persistedReducer = persistReducer(persistConfig, reducers);


export const store = configureStore({
    reducer: persistedReducer,
    //devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk],
});