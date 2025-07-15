require('dotenv').config();

fetch("http://20.244.56.144/evaluation-service/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    email: process.env.EMAIL,
    name: process.env.NAME,
    mobileNo: process.env.MOBILE_NO,
    githubUsername: process.env.GITHUB_USERNAME,
    rollNo: process.env.ROLL_NO,
    accessCode: process.env.ACCESS_CODE
  })
})
.then(async res => {
  const contentType = res.headers.get("content-type");
  const text = await res.text();
  console.log("Raw response:", text);
  if (contentType && contentType.includes("application/json")) {
    try {
      const data = JSON.parse(text);
      console.log("✅ Registered successfully:");
      console.log("clientID:", data.clientID);
      console.log("clientSecret:", data.clientSecret);
    } catch (e) {
      console.error("❌ Could not parse JSON:", e);
    }
  } else {
    throw new Error("Server did not return JSON: " + text);
  }
})
.catch(err => {
  console.error("❌ Registration failed:", err);
});
