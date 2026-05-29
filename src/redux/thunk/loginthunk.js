import { setJWTToken } from "../slices/userSlice";
import { getOdooSession, setOdooSession } from "@/api/odoo/session";

export const setTokenThunk = (token, user = null) => async (dispatch) => {
    try {
        if (token) {
            const partial = { sessionId: token };
            const partnerId = user?.partner_id || user?.id;
            if (partnerId) {
                partial.partnerId = Number(partnerId);
            }
            if (user?.uid) {
                partial.uid = Number(user.uid);
            }
            const existing = getOdooSession();
            if (!partial.partnerId && existing?.partnerId) {
                partial.partnerId = existing.partnerId;
            }
            if (!partial.uid && existing?.uid) {
                partial.uid = existing.uid;
            }
            setOdooSession(partial);
        }
        await dispatch(setJWTToken({ data: token }));
        return true;
    } catch (error) {
        console.error("Error setting token:", error);
        return false;
    }
};