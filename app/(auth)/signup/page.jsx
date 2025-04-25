"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axios";
import Image from "next/image";

export default function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const fileUrl = "/tnc_ShipDuniya.docx";
  const fileName = "/terms_and_conditions.docx";

  // OTP states for email and mobile
  const [emailOTP, setEmailOTP] = useState("");
  const [mobileOTP, setMobileOTP] = useState("");
  const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
  const [isMobileOtpSent, setIsMobileOtpSent] = useState(false);
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [mobileOtpVerified, setMobileOtpVerified] = useState(false);

  // Add new state variables to track verified values
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [verifiedPhone, setVerifiedPhone] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  // Require OTP verification for both email and mobile before sign-up
  const allFieldsFilled =
    watch("name") &&
    watch("email") &&
    watch("password") &&
    watch("confirmPassword") &&
    watch("mobile") &&
    isChecked &&
    emailOtpVerified &&
    mobileOtpVerified;

  const onSubmit = async (data) => {
    const body ={...data, terms: isChecked, phone: watch("mobile") }
    console.log({ body });
    try {
      const response = await axiosInstance.post("/users/register", body);
      if (response.status === 201) {
        alert("User registered successfully");
      }
      console.log("User registered successfully:", response.data);
      router.push("/login");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  // const handleDownload = () => {
  //   const link = document.createElement("a");
  //   link.href = fileUrl;
  //   link.download = fileName || fileUrl.split("/").pop();
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  // Email OTP functions
  const handleSendEmailOTP = async () => {
    try {
      const response = await axiosInstance.post("/users/send-email-otp", { email: watch("email").trim() });
      if (response.status === 200) {
        setIsEmailOtpSent(true);
      }
    } catch (error) {
      console.error("Error sending email OTP:", error);
      alert("Failed to send OTP to email.");
    }
  };

  const handleVerifyEmailOTP = async () => {
    try {
      const response = await axiosInstance.post("/users/verify-email-otp", {
        email: watch("email").trim(),
        otp: emailOTP,
      });
      if (response.status === 200) {
        setEmailOtpVerified(true);
        setVerifiedEmail(watch("email").trim()); // Store the verified email
      } else {
        alert("Incorrect OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying email OTP:", error);
      alert("Failed to verify email OTP.");
    }
  };

  // Mobile OTP functions
  const handleSendMobileOTP = async () => {
    const phone = watch("mobile");
    try {
      const response = await axiosInstance.post("/users/send-phone-otp", { phone: phone });
      if (response.status === 200) {
        setIsMobileOtpSent(true);
      }
    } catch (error) {
      console.error("Error sending mobile OTP:", error);
      alert("Failed to send OTP to mobile.");
    }
  };

  const handleVerifyMobileOTP = async () => {
    const phone = watch("mobile");
    try {
      const response = await axiosInstance.post("/users/verify-phone-otp", {
        phone: phone,
        otp: mobileOTP,
      });
      if (response.status === 200) {
        setMobileOtpVerified(true);
        setVerifiedPhone(phone); // Store the verified phone number
      } else {
        alert("Incorrect OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying mobile OTP:", error);
      alert("Failed to verify mobile OTP.");
    }
  };

  // Add watchers for email and mobile changes
  useEffect(() => {
    const currentEmail = watch("email")?.trim();
    if (currentEmail && currentEmail !== verifiedEmail) {
      setIsEmailOtpSent(false);
      setEmailOtpVerified(false);
      setEmailOTP("");
    }
  }, [watch("email")]);

  useEffect(() => {
    const currentPhone = watch("mobile");
    if (currentPhone && currentPhone !== verifiedPhone) {
      setIsMobileOtpSent(false);
      setMobileOtpVerified(false);
      setMobileOTP("");
    }
  }, [watch("mobile")]);

  return (
    <div className="loginBackground min-h-screen w-full flex items-center justify-center p-4 relative">
      <Card className="relative z-10 w-full max-w-md bg-white shadow-lg p-6 rounded-xl">
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
            Create an account and start shipping smarter
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Choose a username"
                {...register("name", {
                  required: "Username is required",
                  minLength: {
                    value: 4,
                    message: "Username must be at least 4 characters",
                  },
                })}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email Input and OTP */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex gap-2 items-end">
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
                <Button
                  onClick={handleSendEmailOTP}
                  disabled={!watch("email") || (isEmailOtpSent && watch("email").trim() === verifiedEmail)}
                  type="button"
                >
                  {isEmailOtpSent && watch("email").trim() === verifiedEmail ? "OTP Sent" : "Send OTP"}
                </Button>
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
              {isEmailOtpSent && !emailOtpVerified && (
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Enter Email OTP"
                    value={emailOTP}
                    onChange={(e) => setEmailOTP(e.target.value)}
                  />
                  <Button onClick={handleVerifyEmailOTP}>Verify OTP</Button>
                </div>
              )}
              {emailOtpVerified && (
                <p className="text-sm text-green-600 mt-1">Email Verified</p>
              )}
            </div>

            {/* Mobile Input and OTP */}
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="Enter your mobile number"
                {...register("mobile", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid mobile number, must be 10 digits",
                  },
                })}
              />
              {errors.mobile && (
                <p className="text-sm text-red-500">{errors.mobile.message}</p>
              )}
              <div className="flex gap-2 mt-2">
                <Button
                  onClick={handleSendMobileOTP}
                  disabled={!watch("mobile") || (isMobileOtpSent && watch("mobile") === verifiedPhone)}
                >
                  {isMobileOtpSent && watch("mobile") === verifiedPhone ? "OTP Sent" : "Send OTP"}
                </Button>
              </div>
              {isMobileOtpSent && !mobileOtpVerified && (
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Enter Mobile OTP"
                    value={mobileOTP}
                    onChange={(e) => setMobileOTP(e.target.value)}
                  />
                  <Button onClick={handleVerifyMobileOTP}>Verify OTP</Button>
                </div>
              )}
              {mobileOtpVerified && (
                <p className="text-sm text-green-600 mt-1">Mobile Verified</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message:
                        "Password must include an uppercase letter, a lowercase letter, a number, and a special character",
                    },
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

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                className="w-4 h-4 cursor-pointer"
              />
              <Label htmlFor="terms" className="text-sm">
                I accept the{" "}
                <span
                  onClick={() => router.push("/terms")}
                  className="text-blue-800 cursor-pointer"
                >
                  terms and conditions
                </span>
              </Label>
            </div>

            <Button
              className="h-8 bg-primary text-white"
              type="submit"
              disabled={!allFieldsFilled}
            >
              Sign up
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-800 text-semibold">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
