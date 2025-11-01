"use client";

import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";

import api from "@/lib/api";
import { fetcher } from "@/lib/fetcher";

export default function Navbar() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { data, error } = useSWR("/admin/me", fetcher, {
    revalidateOnFocus: false,
  });

  const admin = data?.admin ?? null;
  const isLoggedIn = Boolean(admin) && !error;

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/admin/logout");
      await mutate("/admin/me");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="bg-linear-to-r from-slate-900 via-purple-900 to-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            TMJ
          </div>
          <div className="text-lg font-semibold text-gray-200 tracking-wide">
            Admin Panel
          </div>
          <div className="relative" ref={dropdownRef}>
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => setIsDropdownOpen((p) => !p)}
                  className="p-2 rounded-full hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                >
                  <User className="w-6 h-6" />
                  <span className="hidden sm:inline text-sm">{admin.name}</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-slate-800 border border-white/10 rounded-xl shadow-lg py-2 animate-fadeIn backdrop-blur-md">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        router.push("/dashboard/settings");
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-2" /> Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <></>
              // <button
              //   onClick={() => router.push("/login")}
              //   className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition"
              // >
              //   Login
              // </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
