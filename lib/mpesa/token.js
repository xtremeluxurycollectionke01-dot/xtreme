const axios = require("axios");

let cachedToken = null;
let expiry = 0;

const getAccessToken = async () => {
  const now = Date.now();

  // 🧠 1. Check cache first
  if (cachedToken && now < expiry) {
    console.log("🔁 Using cached M-Pesa token");
    return cachedToken;
  }

  console.log("🔐 Requesting new M-Pesa access token...");

  try {
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString("base64");

    const res = await axios.get(
      "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    if (!res.data?.access_token) {
      console.error("❌ No access token received:", res.data);
      throw new Error("Failed to get M-Pesa token");
    }

    cachedToken = res.data.access_token;
    expiry = now + 3500 * 1000;

    console.log("✅ M-Pesa token generated successfully...");
    console.log("🧾 Token preview:", cachedToken.slice(0, 10) + "...");

    return cachedToken;
  } catch (error) {
    console.error("❌ M-Pesa token error:", {
      message: error.message,
      response: error.response?.data,
    });

    throw error;
  }
};

module.exports = { getAccessToken };