import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentStep: 1,
    address: null,
    selectedDate: null,
    timeSlot: null,
    formattedDate: null,
    selectedPaymentMethod: null,
    isWalletChecked: false,
    orderNote: ""
}


export const checkoutReducer = createSlice({
    name: "checkout",
    initialState,
    reducers: {
        setCurrentStep: (state, action) => {
            state.currentStep = action.payload.data
        },
        setAddress: (state, action) => {
            state.address = action.payload.data
        },
        setSelectedDate: (state, action) => {
            state.selectedDate = action.payload.data
        },
        setTimeSlot: (state, action) => {
            state.timeSlot = action.payload.data
        },
        setFormateDate: (state, action) => {
            state.formattedDate = action.payload.data
        },
        setPaymentMethod: (state, action) => {
            state.selectedPaymentMethod = action.payload.data
        },
        setWalletChecked: (state, action) => {
            state.isWalletChecked = action.payload.data
        },
        setOrderNote: (state, action) => {
            state.orderNote = action.payload.data
        },
        clearCheckout: () => initialState
    }
})

export const { setAddress, setSelectedDate, setFormateDate, setPaymentMethod, setCurrentStep, setTimeSlot, setWalletChecked, setOrderNote, clearCheckout } = checkoutReducer.actions;

export default checkoutReducer.reducer