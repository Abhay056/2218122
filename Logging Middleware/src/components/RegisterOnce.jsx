import React from "react";
import { registerUser } from "../register";

function RegisterOnce() {
  return (
    <div style={{ padding: "1rem" }}>
      <h2>Register with AffordMed Evaluation API</h2>
      <button onClick={registerUser}>Click to Register</button>
    </div>
  );
}

export default RegisterOnce;
