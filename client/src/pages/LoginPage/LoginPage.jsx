import React from "react";
import LoginForm from "../../components/LoginForm/LoginForm";
import "./LoginPage.css";

export default function LoginPage() {
  return (
    <div className="login-page d-flex justify-content-center align-items-center min-vh-100">
      <div className="login-container shadow rounded p-4 bg-white">
        <h2 className="text-center mb-4">Login</h2>
        <LoginForm />
      </div>
    </div>
  );
}
