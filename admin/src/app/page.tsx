import React from "react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="flex w-screen h-screen justify-center items-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to The Muscular Junction
        </h1>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-6 py-3 rounded-2xl bg-white text-slate-900 font-semibold shadow-lg hover:bg-gray-200 transition-all"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 rounded-2xl bg-purple-600 font-semibold shadow-lg hover:bg-purple-700 transition-all"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
