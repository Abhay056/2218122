require("dotenv").config();

fetch("http://20.244.56.144/evaluation-service/auth", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    email: process.env.EMAIL,
    name: process.env.NAME,
    rollNo: process.env.ROLL_NO,
    accessCode: process.env.ACCESS_CODE,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  })
})
  .then(async (res) => {
    const contentType = res.headers.get("content-type");
    const text = await res.text();
    console.log("Raw response:", text);

    if (contentType && contentType.includes("application/json")) {
      try {
        const data = JSON.parse(text);
        if (data.access_token) {
          console.log("✅ Access Token:");
          console.log("VITE_LOGGER_TOKEN=" + data.access_token);
        } else {
          console.error("❌ Token not found in response.");
        }
      } catch (e) {
        console.error("❌ Could not parse JSON:", e);
      }
    } else {
      throw new Error("Server did not return JSON: " + text);
    }
  })
  .catch((err) => {
    console.error("❌ Token request failed:", err);
  });
