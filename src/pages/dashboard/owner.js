import withDashboardAuth from "@/checkauth/withDashboardAuth";

function OwnerDashboardPage() {
  return (
    <iframe
      src="/dashboard/web6_owner_dashboard.html"
      title="Owner Dashboard"
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
        display: "block",
      }}
    />
  );
}

export default withDashboardAuth(OwnerDashboardPage);

