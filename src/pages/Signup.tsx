
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SignupForm from "@/components/auth/SignupForm";

const Signup = () => {
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
          <h1 className="text-4xl font-bold">Create your personal healthcare hub</h1>
          <p className="text-lg opacity-80">
            Join thousands of patients managing their medications and prescriptions with AI assistance
          </p>
        </div>
        <div className="text-white/70 text-sm">
          © 2025 Prescription AI. All rights reserved.
        </div>
      </div>

      {/* Right section with signup form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white">
        <div className="md:hidden w-full text-center mb-8 text-primary text-3xl font-bold">
          Prescription AI
        </div>
        
        <div className="w-full max-w-md">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default Signup;
