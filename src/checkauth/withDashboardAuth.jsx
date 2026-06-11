import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Loader from "@/components/loader/Loader";
import { getDashboardPathFromRoleCode } from "@/lib/dashboardRedirect";
import Cookies from "js-cookie";

const withDashboardAuth = (WrappedComponent) => {
    const Wrapper = (props) => {
        const router = useRouter();
        const user = useSelector(state => state.User);
        const [isAuthorized, setIsAuthorized] = useState(false);
        const [authChecked, setAuthChecked] = useState(false);

        useEffect(() => {
            if (!user?.jwtToken) {
                // Not logged in -> go to home
                router.push("/");
                return;
            }

            // Extract the user's role code similar to extractRoleCode in dashboardRedirect.js
            const directRole = user?.cd_mobile_role?.role_code;
            const userRole = user?.user?.cd_mobile_role?.role_code;
            const flatRole = user?.role_code;
            const userFlatRole = user?.user?.role_code;
            const localRole = Cookies.get("role_code") || (typeof window !== "undefined" ? window.localStorage.getItem("role_code") : null);

            const roleCode = directRole || userRole || flatRole || userFlatRole || localRole;
            const allowedDashboardPath = getDashboardPathFromRoleCode(roleCode);

            if (!allowedDashboardPath) {
                // User has no valid dashboard role, kick to home
                router.push("/");
            } else if (allowedDashboardPath !== router.pathname) {
                // User has a role, but is trying to access the wrong dashboard, redirect to theirs
                router.push(allowedDashboardPath);
            } else {
                // Valid access
                setIsAuthorized(true);
            }

            setAuthChecked(true);
        }, [user, router]);

        if (!authChecked || !isAuthorized) {
            return <Loader screen="full" />;
        }

        return <WrappedComponent {...props} />;
    }
    return Wrapper;
}

export default withDashboardAuth;
