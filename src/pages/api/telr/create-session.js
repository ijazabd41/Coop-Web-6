export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { orderId, transactionId, amount } = req.body;
    
    const storeId = process.env.NEXT_PUBLIC_TELR_STORE_ID;
    const authKey = process.env.NEXT_PUBLIC_TELR_AUTH_KEY;
    const isTest = process.env.NEXT_PUBLIC_TELR_TEST_MODE == "1" ? 1 : 0;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    if (!storeId || !authKey) {
      return res.status(500).json({ status: 0, message: "Telr credentials not configured in environment." });
    }

    if (!transactionId) {
      return res.status(400).json({ status: 0, message: "Missing transaction ID." });
    }

    // Create Telr Session
    const telrPayload = {
      method: "create",
      store: storeId,
      authkey: authKey,
      framed: 0,
      order: {
        cartid: String(transactionId),
        test: String(isTest),
        amount: parseFloat(amount).toFixed(2),
        currency: "AED",
        description: `Order Payment #${orderId}`
      },
      return: {
        authorised: `${baseUrl}/web-payment-status?status=success&payment_method=telr&order_id=${orderId}&transaction_id=${transactionId}`,
        declined: `${baseUrl}/web-payment-status?status=failed&payment_method=telr&order_id=${orderId}`,
        cancelled: `${baseUrl}/checkout?status=cancelled`
      }
    };

    const telrRes = await fetch("https://secure.telr.com/gateway/order.json", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(telrPayload),
    });

    const telrData = await telrRes.json();

    if (telrData && telrData.order && telrData.order.url) {
      return res.status(200).json({ 
        status: 1, 
        url: telrData.order.url, 
        transaction_id: transactionId,
        order_ref: telrData.order.ref 
      });
    } else {
      console.error("Telr error:", telrData);
      return res.status(400).json({ status: 0, message: "Failed to create Telr session.", error: telrData });
    }

  } catch (error) {
    console.error("Telr create session error:", error);
    return res.status(500).json({ status: 0, message: error.message });
  }
}
