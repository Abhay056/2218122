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
          email: "abjun504@gmail.com",
          name: "Abhay Bahuguna",
          mobileNo: "9458124662",
          githubUsername: "Abhay056",
          rollNo: "2218122",
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

    alert("Check console for clientID and clientSecret!");
  } catch (err) {
    console.error("❌ Registration failed:", err);
  }
}
