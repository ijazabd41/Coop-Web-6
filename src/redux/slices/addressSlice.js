import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedAddress: [],
    allAddresses: []
}

export const addressReducer = createSlice({
    name: "address",
    initialState,
    reducers: {
        setSelectedAddres: (state, action) => {
            state.selectedAddress = action.payload.data
        },
        setAllAddresses: (state, action) => {
            state.allAddresses = action.payload.data
        }
    }
})

export const { setAllAddresses, setSelectedAddres } = addressReducer.actions

export default addressReducer.reducer