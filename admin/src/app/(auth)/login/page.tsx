// client/src/app/(auth)/login/page.tsx

import React from "react";
import LoginForm from "@/components/forms/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl">Login</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
