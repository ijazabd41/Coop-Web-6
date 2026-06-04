import withDashboardAuth from "@/checkauth/withDashboardAuth";

function StockDashboardPage() {
  return (
    <iframe
      src="/dashboard/web6_stock_dashboard.html"
      title="Stock Dashboard"
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
        display: "block",
      }}
    />
  );
}

export default withDashboardAuth(StockDashboardPage);

