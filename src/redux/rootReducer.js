import { combineReducers } from 'redux';
import ShopReducer from "@/redux/slices/shopSlice"
import SettingReducer from "@/redux/slices/settingSlice"
import UserReducer from "@/redux/slices/userSlice"
import ProductFilterReducer from "@/redux/slices/productFilterSlice"
import CityReducer from "@/redux/slices/citySlice"

export const rootReducer = combineReducers({
    City: CityReducer,
    Shop: ShopReducer,
    Setting: SettingReducer,
    User: UserReducer,
    ProductFilter: ProductFilterReducer,
})

