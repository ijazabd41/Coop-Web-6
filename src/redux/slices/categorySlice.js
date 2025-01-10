import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   
    selectedCategories: []
}

const categoryReducer = createSlice({
    name: "category",
    initialState,
    reducers: {
        setSelectedCategories: (state, action) => {
            state.selectedCategories.push(action.payload.data)
        },
        resetSelectedCategories: (state) => {
            state.selectedCategories = []
        }
    }
})

export const { setSelectedCategories, resetSelectedCategories } = categoryReducer.actions
export default categoryReducer.reducer;