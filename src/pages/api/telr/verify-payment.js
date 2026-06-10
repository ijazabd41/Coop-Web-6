export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { orderRef } = req.body;
    const storeId = process.env.NEXT_PUBLIC_TELR_STORE_ID;
    const authKey = process.env.NEXT_PUBLIC_TELR_AUTH_KEY;

    if (!storeId || !authKey) {
      return res.status(500).json({ status: 0, message: "Telr credentials not configured." });
    }

    const telrPayload = {
      method: "check",
      store: storeId,
      authkey: authKey,
      order: {
        ref: orderRef
      }
    };

    const telrRes = await fetch("https://secure.telr.com/gateway/order.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(telrPayload),
    });

    const telrData = await telrRes.json();
    
    const statusCode = telrData?.order?.status?.code;
    const statusText = telrData?.order?.status?.text;

    // 3 means Paid in Telr
    if (statusCode === 3 || statusText === "Paid") {
      return res.status(200).json({ status: 1, message: "Payment verified by Telr." });
    } else {
       return res.status(400).json({ status: 0, message: `Payment not completed. Status: ${statusText}` });
    }
  } catch (error) {
    console.error("Telr verify payment error:", error);
    return res.status(500).json({ status: 0, message: error.message });
  }
}
