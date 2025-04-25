"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2, Ship } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axios";
import Cookies from "js-cookie";
import Image from "next/image";
// import shipDuniyaLogo from "/shipDuniyaIcon.jpg";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError, // ✅ Add setError to handle API errors
    formState: { errors },
  } = useForm({
    mode: "onBlur", // ✅ Shows validation errors on blur
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/login", {
        email: data.email,
        password: data.password,
      });

      if (response.status === 200 && response.data) {
        const { role, token } = response.data;
        Cookies.set("token", token, { expires: 1 / 24 });

        // ✅ Redirect based on role
        const rolePaths = {
          user: "/user/dashboard",
          admin: "/admin/dashboard",
          superadmin: "/superadmin/dashboard",
          support: "/support/dashboard",
        };

        router.push(rolePaths[role] || "/");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";

      // ✅ Set form errors so they show up in UI
      setError("email", { type: "server", message: errorMessage });
      setError("password", { type: "server", message: errorMessage });

      console.error("Login failed:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginBackground min-h-screen w-full flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-black-800/90"></div>

      <Card className="relative z-10 w-full max-w-md bg-white shadow-lg backdrop-blur-lg p-6 rounded-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <Image src="/shipDuniyaIcon.jpg" width={50} height={50} alt="ShipDuniya Logo" unoptimized />
            <CardTitle
              className="text-2xl font-bold cursor-pointer"
              onClick={() => router.push("/")}
            >
              Ship <span className="text-red-700">D</span>uniya
            </CardTitle>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Log in to your account and manage your shipments
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <Button
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  variant="ghost"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              className="h-8 bg-primary text-white"
              type="submit"
              variant="default"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </form>

          {/* Links */}
          <div className="flex justify-between mt-4 text-center text-sm">
            <button
              type="button"
              className="text-blue-500 text-sm hover:underline"
              onClick={() => router.push("/forgot-password")}
            >
              Forgot Password?
            </button>
            <button>
              <Link href="/signup">
                Don't have an account?{" "}
                <span className="text-blue-800">Sign up</span>
              </Link>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
