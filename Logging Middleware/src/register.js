// src/register.js

export async function registerUser() {
  try {
    const response = await fetch(
      "http://20.244.56.144/evaluation-service/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "ARMAANRAWAT.22021662@gehu.ac.in",
          name: "Armaan Rawat",
          mobileNo: "7983573326",
          githubUsername: "ArmaanRawat",
          rollNo: "2218460",
          accessCode: "QAhDUr",
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to register: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Registration successful!");
    console.log("Your credentials:", data);

    // Suggestion: copy the values and store in your .env manually
    alert("Check console for clientID and clientSecret!");
  } catch (err) {
    console.error("❌ Registration failed:", err);
  }
}
