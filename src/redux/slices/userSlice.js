
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    status: "loading",
    user: null,
    fcm_token: "",
    authId: "",
    jwtToken: "",
    authType: ""
};

export const userReducer = createSlice({
    name: "user",
    initialState,
    reducers: {
        setCurrentUser: (state, action) => {
            state.status = "fulfill";
            state.user = action.payload.data;
        },
        setAuthType: (state, action) => {
            state.status = "fulfill";
            state.authType = action.payload.data;
        },
        loginSuccess: (state, action) => {
            state.status = "fulfill";
            state.user = action.payload.user;
            state.jwtToken = action.payload.jwtToken || "";
        },
        logoutAuth: (state, action) => {
            state.status = "loading";
            state.user = null;
            state.fcm_token = null;
            state.authId = "";
            state.jwtToken = "";
            // Clear Odoo session from localStorage
            if (typeof window !== "undefined") {
                try {
                    const keys = ["odoo_session_id", "odoo_partner_id", "odoo_uid", "odoo_draft_order_id", "odoo_db", "cd_session_id", "cd_user_id", "cd_user_name", "role_code", "cd_role_code"];
                    keys.forEach((k) => window.localStorage.removeItem(k));
                } catch { /* ignore */ }
            }
        },
        deductUserBalance: (state, action) => {
            console.log("action", action.payload.data)
            if (state.user) {
                state.user.balance -= action.payload.data;
            }
        },
        addUserBalance: (state, action) => {
            if (state.user) {
                state.user.balance += action.payload.data;
            }
        },
        setFcmToken: (state, action) => {
            state.fcm_token = action.payload.data;
        },
        setAuthId: (state, action) => {
            state.authId = action.payload.data;
        },
        setJWTToken: (state, action) => {
            state.jwtToken = action.payload.data;
        }
    }
});

export const { setCurrentUser, loginSuccess, logoutAuth, deductUserBalance, addUserBalance, setFcmToken, setAuthId, setJWTToken, setAuthType } = userReducer.actions;
export default userReducer.reducer;