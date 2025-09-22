import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-300 to-blue-700 px-4">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col lg:flex-row w-full max-w-6xl min-h-[80vh]">
        {/* Left Section (Form Area) */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12">
          <div className="text-black w-full max-w-md">{children}</div>
        </div>

        {/* Right Section (Branding / Illustration) */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-white text-black p-12">
          <div className="text-center max-w-md space-y-6">
            {/* <h1 className="text-4xl font-extrabold">
              Welcome to The Muscular Junction
            </h1>
            <p className="text-lg leading-relaxed opacity-90">
              A Modern Physiotherapy Clinic.
            </p> */}
            <div className="flex items-center justify-center">
              <img
                src="imgs/auth-illustration.png"
                alt="Clinic Illustration"
                className="object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
