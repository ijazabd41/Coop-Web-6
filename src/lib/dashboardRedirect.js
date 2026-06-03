const ROLE_DASHBOARD_PATHS = {
  company_owner: "/dashboard/owner",
  store_manager: "/dashboard/owner",
  delivery_manager: "/dashboard/delivery",
  delivery_boy: "/dashboard/delivery",
  stock_manager: "/dashboard/stock",
};

function normalizeRoleCode(roleCode) {
  if (!roleCode || typeof roleCode !== "string") return null;
  return roleCode.trim().toLowerCase();
}

function extractRoleCode(loginData) {
  // Support multiple backend payload shapes.
  const directRole = loginData?.cd_mobile_role?.role_code;
  const userRole = loginData?.user?.cd_mobile_role?.role_code;
  const flatRole = loginData?.role_code;
  const userFlatRole = loginData?.user?.role_code;
  const localRole =
    typeof window !== "undefined" ? window.localStorage.getItem("role_code") : null;

  return normalizeRoleCode(directRole || userRole || flatRole || userFlatRole || localRole);
}

export function getDashboardPathFromRoleCode(roleCode) {
  const normalizedRoleCode = normalizeRoleCode(roleCode);
  if (!normalizedRoleCode) return null;
  return ROLE_DASHBOARD_PATHS[normalizedRoleCode] || null;
}

export function redirectToRoleDashboard(loginData) {
  if (typeof window === "undefined") return false;

  const roleCode = extractRoleCode(loginData);
  const destination = getDashboardPathFromRoleCode(roleCode);

  if (!destination) return false;

  // Keep latest role available for future redirects/fallbacks.
  window.localStorage.setItem("role_code", roleCode);
  window.location.assign(destination);
  return true;
}

