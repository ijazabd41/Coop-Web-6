import { useEffect } from "react";
import { useRouter } from "next/router";
import { getDashboardPathFromRoleCode } from "@/lib/dashboardRedirect";

export default function DashboardIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const roleCode = localStorage.getItem("role_code");
    const route = getDashboardPathFromRoleCode(roleCode) || "/dashboard/owner";
    router.replace(route);
  }, [router]);

  return null;
}

