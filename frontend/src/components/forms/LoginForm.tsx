"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Lock } from "lucide-react";

// ✅ Schema validation
const loginSchema = z.object({
  userID: z
    .string()
    .nonempty("User ID is required")
    .min(5, "User ID must be at least 5 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);

      // Call API (example placeholder)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Login failed");
      // Redirect or store token
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-lg">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="p-3 rounded-full bg-blue-100">
          <img
            src="/imgs/tmj-logo.png"
            alt="Company Logo"
            className="w-20 h-20 object-contain"
          />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
        {/* User ID */}
        <div className="relative">
          <input
            type="text"
            placeholder="User ID"
            {...register("userID")}
            aria-invalid={!!errors.userID}
            className="w-full px-4 py-3 pl-10 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <User className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
          {errors.userID && (
            <p className="mt-1 text-xs text-red-600">{errors.userID.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            aria-invalid={!!errors.password}
            className="w-full px-4 py-3 pl-10 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Lock className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember me + Forgot Password */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-gray-600">Remember Me</span>
          </label>
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </a>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Signup */}
      {/* <p className="mt-6 text-sm text-center text-gray-600">
        Don’t have an account?{" "}
        <a href="/signup" className="font-medium text-blue-600 hover:underline">
          Sign Up
        </a>
      </p> */}
    </div>
  );
}
