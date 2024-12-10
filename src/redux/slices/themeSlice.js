import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    status: 'loading',
    theme: "light"
}

export const themeSlice = createSlice({
    name: "Theme",
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.status = "fulfill",
                theme = action.payload.data
        }
    }
})

export const { setTheme } = themeSlice.actions
export default themeSlice.reducer;