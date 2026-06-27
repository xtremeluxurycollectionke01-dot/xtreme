/*Yes — we can do it, but first we need to be precise because not all of those URLs apply to STK Push.

You’re mixing two different M-Pesa systems:

🧠 1. IMPORTANT CLARIFICATION (VERY IMPORTANT)
🔵 A. STK PUSH (Lipa Na M-Pesa Online)

Used in e-commerce checkout (your case)

👉 Uses ONLY:
✔ Callback URL
❌ DOES NOT use:
Validation URL
Confirmation URL
URL registration API
🟡 B. C2B (Paybill / Till direct deposits)

Used when customer sends money manually to Paybill

👉 Uses:
✔ Validation URL
✔ Confirmation URL
✔ URL registration (mandatory)
🚀 2. WHAT YOU SHOULD DO RIGHT NOW

Since you're building e-commerce checkout, your priority is:

👉 STEP 1 (YOU ARE HERE)

✔ STK Push (DONE almost)

👉 STEP 2

✔ Register ONLY callback usage (not registration API)

📲 3. YOUR STK CALLBACK (NO REGISTRATION REQUIRED)

You already use this:

CallBackURL: "https://www.linkchemsupplies.co.ke/api/mpesa/callback"

👉 Safaricom will automatically call it.

✔ NO dashboard registration
✔ NO API registration
✔ NOTHING else needed

⚠️ 4. NOW ABOUT URL REGISTRATION API

You ONLY use this when doing C2B:

POST https://api.safaricom.co.ke/mpesa/c2b/v1/registerurl
📦 Example (ONLY if you want Paybill manual payments)
import axios from "axios";
import { getAccessToken } from "@/lib/mpesa/token";

export const registerC2BUrls = async () => {
  const token = await getAccessToken();

  const payload = {
    ShortCode: process.env.MPESA_SHORTCODE,
    ResponseType: "Completed",
    ConfirmationURL: "https://www.linkchemsupplies.co.ke/api/mpesa/confirm",
    ValidationURL: "https://www.linkchemsupplies.co.ke/api/mpesa/validate",
  };

  const res = await axios.post(
    "https://api.safaricom.co.ke/mpesa/c2b/v1/registerurl",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("C2B URL registration:", res.data);
};
🧾 5. WHAT CONFIRMATION & VALIDATION DO
🟡 Validation URL

👉 Runs BEFORE money is accepted

You can:

block invalid payments
check account number
approve/reject transaction

👉 Most apps just ALWAYS approve

🟡 Confirmation URL

👉 Runs AFTER payment is received

You:

save transaction
update DB
mark payment complete
🧠 6. SIMPLE DECISION TREE FOR YOU
👉 Are you doing STK Push checkout?

✔ YES (your case)

👉 Then you ONLY need:

Callback URL
👉 Are you also allowing Paybill manual deposits?

✔ YES or future plan

👉 Then you ALSO need:

registerurl API
validation URL
confirmation URL
🚀 7. WHAT I RECOMMEND FOR YOUR SYSTEM

Since you are building:

🛒 e-commerce (LinkChem Supplies)

Start with:

✔ STK Push only (clean checkout)

Later upgrade:

✔ C2B Paybill (optional fallback payment method)*/





/*/mpesa
  ├── stkPush.js
  ├── accessToken.js
  ├── callback.js
  ├── registerUrl.js (only if using C2B)*/



import axios from "axios";
import { getAccessToken } from "@/lib/mpesa/token";

export const registerC2BUrls = async () => {
  const token = await getAccessToken();

  const payload = {
    ShortCode: process.env.MPESA_SHORTCODE,
    ResponseType: "Completed",
    ConfirmationURL: "https://www.xtremeluxurycollection.co.ke/api/mpesa/confirm",
    ValidationURL: "https://www.xtremeluxurycollection.co.ke/api/mpesa/validate",
  };

  const res = await axios.post(
    "https://api.safaricom.co.ke/mpesa/c2b/v1/registerurl",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("C2B URL registration:", res.data);
};