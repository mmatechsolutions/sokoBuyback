// routes/payment.js
import express from "express";

const router = express.Router();

router.post("/mpesa", async (req, res) => {
  const { phone, amount, orderId } = req.body;

  if (!phone || !amount || !orderId)
    return res.status(400).json({ message: "Missing parameters" });

  try {
    const mpesaUrl =
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    const shortCode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, "")
      .slice(0, 14);
    const password = Buffer.from(shortCode + passkey + timestamp).toString(
      "base64"
    );

    const body = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: shortCode,
      PhoneNumber: phone,
      CallBackURL: `${process.env.SERVER_URL}/api/pay/mpesa/callback`,
      AccountReference: `Order${orderId}`,
      TransactionDesc: "Order Payment",
    };

    // Use fetch instead of axios
    const response = await fetch(mpesaUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
          ).toString("base64"),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ message: data.errorMessage || "M-Pesa request failed", data });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "M-Pesa request failed" });
  }
});

export default router;
