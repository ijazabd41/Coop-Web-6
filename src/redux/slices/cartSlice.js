import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: "loading",
    cart: null,
    cartProducts: null
}

export const cartReducer = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action) => {
            state.status = "fulfill"
            state.cart = action.payload.data
        },
        setCartProducts: (state, action) => {
            state.status = "fulfill"
            state.cartProducts = action.payload.data
        }
    }
})

export const { setCart, setCartProducts } = cartReducer.actions
export default cartReducer.reducer