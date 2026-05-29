import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess, logoutAuth } from "@/redux/slices/userSlice";
import { getOdooSession, setOdooSession, clearOdooSession } from "@/api/odoo/session";
import * as api from "@/api/apiRoutes";

/**
 * SessionBootstrap — restores Odoo session on app mount.
 *
 * On first render, checks localStorage for a saved Odoo session.
 * If found and Redux has no user, attempts to fetch user profile
 * from the API and populates Redux state.
 *
 * Also syncs Redux jwtToken changes back to localStorage.
 */
const SessionBootstrap = () => {
  const dispatch = useDispatch();
  const jwtToken = useSelector((state) => state.User?.jwtToken);
  const user = useSelector((state) => state.User?.user);

  // On mount: restore session from localStorage -> Redux
  useEffect(() => {
    const session = getOdooSession();
    if (!session?.sessionId) return;

    // If Redux already has user data, just sync the session ID
    if (jwtToken && user) {
      // Ensure localStorage is in sync with Redux
      setOdooSession({
        sessionId: jwtToken,
        partnerId: user.partner_id || user.id,
        uid: user.uid,
      });
      return;
    }

    // Redux lost user data (page refresh) but localStorage has session
    if (!user && session.sessionId) {
      // Attempt to restore user from API
      api
        .getUser()
        .then((res) => {
          if (res?.user) {
            dispatch(
              loginSuccess({
                jwtToken: session.sessionId,
                user: {
                  ...res.user,
                  partner_id: res.user.partner_id || session.partnerId,
                  uid: res.user.uid || session.uid,
                },
              })
            );
          }
        })
        .catch(() => {
          // Session expired or invalid — clear everything
          clearOdooSession();
          dispatch(logoutAuth());
        });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync Redux jwtToken changes -> localStorage
  useEffect(() => {
    if (jwtToken) {
      setOdooSession({
        sessionId: jwtToken,
        partnerId: user?.partner_id || user?.id,
        uid: user?.uid,
      });
    }
  }, [jwtToken, user]);

  return null;
};

export default SessionBootstrap;
