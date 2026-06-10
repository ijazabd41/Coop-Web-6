export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { orderRef, transactionId, orderId } = req.body;
    const storeId = process.env.NEXT_PUBLIC_TELR_STORE_ID;
    const authKey = process.env.NEXT_PUBLIC_TELR_AUTH_KEY;
    const odooUrl = process.env.ODOO_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://cooperp.freeddns.org:8076";

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

    if (statusCode === 3 || statusText === "Paid") {
      // It's Paid! Call Odoo to Mark Done.
      const providerId = process.env.NEXT_PUBLIC_TELR_PROVIDER_ID || 23;
      const odooReqUrl = `${odooUrl}/api/order/${orderId}/order_transaction_mark_done?by_AJR=1&transaction_id=${transactionId}&args=[${providerId}]`;
      
      const odooRes = await fetch(odooReqUrl, {
         method: "GET",
         headers: {
            "Content-Type": "application/json"
         }
      });
      const odooData = await odooRes.json();
      
      if (odooData.success === 1) {
          // create invoice just in case
          try {
             await fetch(`${odooUrl}/api/order/${orderId}/create_invoice?by_AJR=1`);
          } catch(e) {}
          return res.status(200).json({ status: 1, message: "Payment successful and order confirmed." });
      } else {
          return res.status(400).json({ status: 0, message: "Payment verified but ERP confirmation failed." });
      }
    } else {
       return res.status(400).json({ status: 0, message: `Payment not completed. Status: ${statusText}` });
    }
  } catch (error) {
    console.error("Telr verify payment error:", error);
    return res.status(500).json({ status: 0, message: error.message });
  }
}
