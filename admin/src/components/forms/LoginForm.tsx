"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mutate } from "swr";
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

import api from "@/lib/api"; // ✅ we’ll use Axios instance with withCredentials

// ✅ Zod validation schema
const loginSchema = z.object({
  userId: z
    .string()
    .min(1, "User ID is required")
    .regex(
      /^(A|D|R|P)-\d{2}-[A-Za-z]+$/,
      "User ID must match pattern e.g., A-01-ZafarRizvi"
    ),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const router = useRouter();

  // ✅ React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // ✅ Local states
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Handle Submit
  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setLoginStatus("idle");
      setErrorMessage("");

      // ✅ Send request using Axios (which includes credentials automatically)
      const res = await api.post("/admin/login", {
        publicId: data.userId,
        password: data.password,
      });

      if (res.status === 200) {
        setLoginStatus("success");
        await mutate("/admin/me"); // revalidate cache so Navbar sees new state
        router.push("/dashboard");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Login error:", err);
      setLoginStatus("error");
      const message =
        err.response?.data?.message || "Login failed, please try again.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ✅ Status messages */}
      {loginStatus === "success" && (
        <div className="flex items-center gap-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 px-4 py-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <p className="text-sm text-emerald-300">
            Login successful! Redirecting...
          </p>
        </div>
      )}

      {loginStatus === "error" && (
        <div className="flex items-center gap-3 rounded-xl bg-red-500/20 border border-red-500/50 px-4 py-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-sm text-red-300">{errorMessage}</p>
        </div>
      )}

      {/* ✅ User ID */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-200">
          User ID
        </label>
        <input
          type="text"
          {...register("userId")}
          placeholder="A-01-ZafarRizvi"
          disabled={isLoading}
          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 
          focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:opacity-50"
        />
        {errors.userId && (
          <p className="text-xs text-pink-400 flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-pink-400" />
            {errors.userId.message}
          </p>
        )}
      </div>

      {/* ✅ Password */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-200">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="••••••••"
            disabled={isLoading}
            className="w-full px-4 py-2.5 pr-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 
            focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={isLoading}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-pink-400 flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-pink-400" />
            {errors.password.message}
          </p>
        )}
      </div>

      {/* ✅ Submit */}
      <button
        type="submit"
        disabled={isLoading || loginStatus === "success"}
        className="w-full py-2.5 px-4 rounded-xl font-semibold text-white bg-linear-to-r 
        from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 
        transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Signing in...</span>
          </>
        ) : (
          <span>Sign In</span>
        )}
      </button>
    </form>
  );
};

export default LoginForm;
