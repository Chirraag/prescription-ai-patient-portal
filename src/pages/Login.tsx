
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  const { currentUser } = useAuth();

  // If user is already logged in, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left section with image and background */}
      <div className="hidden md:flex md:w-1/2 bg-primary p-10 flex-col justify-between">
        <div className="text-white text-3xl font-bold">Prescription AI</div>
        <div className="text-white space-y-4">
          <h1 className="text-4xl font-bold">Welcome to the future of healthcare management</h1>
          <p className="text-lg opacity-80">
            Your complete prescription and medication management platform powered by AI
          </p>
        </div>
        <div className="text-white/70 text-sm">
          © 2025 Prescription AI. All rights reserved.
        </div>
      </div>

      {/* Right section with login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white">
        <div className="md:hidden w-full text-center mb-8 text-primary text-3xl font-bold">
          Prescription AI
        </div>
        
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
