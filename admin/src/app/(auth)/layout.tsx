// client/src/app/(auth)/layout.tsx

import Image from "next/image";
import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-[calc(100vh-4rem)] fixed overflow-hidden bg-gradient-to-br from-slate-950 via-purple-900/60 to-slate-950 text-white ">
      {/* Background Glows */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main Content - Exact height minus navbar */}
      <div className="h-full w-full flex flex-col lg:flex-row overflow-auto">
        {/* Left Section */}
        <div className="hidden lg:flex flex-col items-center justify-center w-1/2 px-8 py-8">
          <div className="max-w-lg w-full space-y-8">
            {/* Heading */}
            {/* <div className="text-center">
              <h1 className="text-4xl xl:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                The Muscular Junction
              </h1>
              <p className="text-gray-300 text-base">
                Compassion. Care. Commitment.
              </p>
            </div> */}

            {/* Image Container */}
            <div className="relative w-full max-w-sm mx-auto aspect-square bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex items-center justify-center">
              <Image
                src="/imgs/auth-illustration.png"
                alt="Clinic illustration"
                width={500}
                height={500}
              />
              {/* <div className="text-center p-6">
                <div className="w-24 h-24 mx-auto mb-3 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <p className="text-gray-400 text-xs">
                  Replace with your clinic image
                </p>
              </div> */}
            </div>

            {/* Features */}
            <div className="flex justify-center gap-8 text-sm text-gray-300">
              {[
                {
                  label: "Secure",
                  path: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                },
                { label: "Fast", path: "M13 10V3L4 14h7v7l9-11h-7z" },
                {
                  label: "Reliable",
                  path: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                },
              ].map((f) => (
                <div key={f.label} className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center border border-white/10 mb-1.5">
                    <svg
                      className="w-5 h-5 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={f.path}
                      />
                    </svg>
                  </div>
                  <span className="text-xs">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="flex items-center justify-center w-full lg:w-1/2 px-6 py-8 lg:py-12">
          <div className="w-full max-w-md">
            {/* Mobile Branding */}
            <div className="lg:hidden text-center mb-6">
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1.5">
                The Muscular Junction
              </h1>
              <p className="text-gray-300 text-sm">
                Where Pain Leaves your Muscles.
              </p>
            </div>

            {/* Form Container */}
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8">
              {children}
            </div>

            {/* Footer */}
            {/* <p className="text-center text-gray-400 text-xs mt-4">
              © 2025 Your Clinic. All rights reserved.
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}
