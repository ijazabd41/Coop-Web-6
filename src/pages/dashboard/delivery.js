import withDashboardAuth from "@/checkauth/withDashboardAuth";

function DeliveryDashboardPage() {
  return (
    <iframe
      src="/dashboard/web6_delivery_dashboard.html"
      title="Delivery Dashboard"
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
        display: "block",
      }}
    />
  );
}

export default withDashboardAuth(DeliveryDashboardPage);

