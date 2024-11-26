import { combineReducers } from 'redux';
import ShopReducer from "@/redux/slices/shopSlice"
import SettingReducer from "@/redux/slices/settingSlice"
import UserReducer from "@/redux/slices/userSlice"

export const rootReducer = combineReducers({
    Shop: ShopReducer,
    Setting: SettingReducer,
    User: UserReducer
})

