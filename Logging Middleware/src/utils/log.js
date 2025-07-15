export async function Log({ stack, level, package: pkg, message, token }) {
  try {
    const res = await fetch("http://20.244.56.144/eva1uation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ stack, level, package: pkg, message })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("❌ Log failed:", errText);
    } else {
      const data = await res.json();
      console.log("✅ Log created:", data.logID);
    }
  } catch (err) {
    console.error("🚨 Logging error:", err.message);
  }
}
