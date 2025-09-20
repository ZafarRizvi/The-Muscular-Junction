"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const goToLogin = () => {
    router.push("/login");
  };

  return (
    <div>
      <h1 className="text-center text-2xl pt-5">The Muscular Junction</h1>
      <button
        onClick={goToLogin}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Login
      </button>
    </div>
  );
};

export default Page;
