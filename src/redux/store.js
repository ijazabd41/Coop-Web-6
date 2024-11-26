import { createStore } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { rootReducer } from './rootReducer';

const persistConfig = {
    key: 'root',
    storage,
};


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);