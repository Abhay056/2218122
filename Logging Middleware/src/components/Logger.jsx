import React from "react";

let cachedToken = null;
let tokenExpiry = null;

const AUTH_URL = "http://20.244.56.144/evaluation-service/auth";
const LOG_URL = "http://20.244.56.144/evaluation-service/logs";

const EMAIL = import.meta.env.EMAIL;
const NAME = import.meta.env.NAME;
const ROLLNO = import.meta.env.ROLL_NO;
const CLIENT_ID = import.meta.env.CLIENT_ID;
const CLIENT_SECRET = import.meta.env.CLIENT_SECRET;
const ACCESS_CODE = import.meta.env.VITE_ACCESS_CODE;

async function fetchToken() {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const response = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: EMAIL,
      name: NAME,
      rollNo: ROLLNO,
      accessCode: ACCESS_CODE,
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET
    }),
  });

  if (!response.ok) {
    throw new Error("❌ Failed to fetch token");
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + 50 * 60 * 1000; 
  return cachedToken;
}

export async function log(stack, level, pkg, message) {
  try {
    const token = await fetchToken();
    await fetch(LOG_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
  } catch (err) {
    console.error("Logger error:", err);
  }
}

export default function Logger() {
  return (
    <div>
      <h2>Logger Utility Loaded</h2>
      <p>This component can be expanded to show logs or logging status.</p>
    </div>
  );
}