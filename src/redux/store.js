import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { rootReducer } from './rootReducer';
import { thunk } from "redux-thunk";

const persistConfig = {
    key: 'root',
    storage,
    /** Transient UI state rehydrates from API; avoids stale checkout/filters. */
    whitelist: [
        'User',
        'Language',
        'Theme',
        'City',
        'Setting',
        'Cart',
        'Addresses',
        'Favorite',
        'Shop',
    ],
};


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
        applyMiddleware: thunk
    })
});
export const persistor = persistStore(store);