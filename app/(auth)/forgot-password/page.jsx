'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Eye, EyeOff, Loader2, Ship } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axios';

export default function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [mobileOTP, setMobileOTP] = useState('');
  const [isMobileOtpSent, setIsMobileOtpSent] = useState(false);
  const [isMobileOtpVerified, setIsMobileOtpVerified] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm();

  const watchPassword = useWatch({ control, name: 'password' });

  const handleSendMobileOTP = async () => {
    const phone = watch("phone");
    if (!phone) {
      setMessage('Please enter your phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/send-phone-otp", { phone });
      if (response.status === 200) {
        setIsMobileOtpSent(true);
        setOtpSent(true);
        setMessage('OTP sent successfully!');
      }
    } catch (error) {
      console.error("Error sending mobile OTP:", error);
      setMessage(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMobileOTP = async () => {
    const phone = watch("phone");
    if (!mobileOTP) {
      setMessage('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/verify-phone-otp", {
        phone,
        otp: mobileOTP,
      });
      if (response.status === 200) {
        setIsMobileOtpVerified(true);
        setOtpVerified(true);
        setMessage('OTP verified successfully!');
      }
    } catch (error) {
      console.error("Error verifying mobile OTP:", error);
      setMessage(error.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!isMobileOtpVerified) {
      setMessage('Please verify OTP before resetting your password.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const response = await axiosInstance.post('/users/forget-password', {
        phone: data.phone,
        password: data.password,
      });

      if (response.status === 200) {
        setMessage('Password reset successfully! Redirecting...');
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginBackground min-h-screen w-full flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-black-800/90"></div>
      <Card className="relative z-10 w-full max-w-md bg-white shadow-lg p-6 rounded-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <Ship className="h-6 w-6" />
            <CardTitle
              className="text-2xl font-bold cursor-pointer"
              onClick={() => router.push('/')}
            >
              Ship Duniya
            </CardTitle>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Reset your password securely
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Phone & Send OTP */}
            <div className="space-y-2">
              <Label htmlFor="phone">Mobile Number</Label>
              <div className="flex flex-row gap-2 items-center">
                <Input
                  id="phone"
                  placeholder="Enter 10-digit mobile number"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit mobile number',
                    },
                  })}
                  disabled={isMobileOtpSent}
                />
                <Button
                  className="h-8 bg-primary text-white"
                  onClick={handleSendMobileOTP}
                  disabled={isMobileOtpSent || loading}
                  type="button"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send OTP'}
                </Button>
              </div>
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>

            {/* OTP & Verify OTP */}
            {isMobileOtpSent && (
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <div className="flex gap-2">
                  <Input
                    id="otp"
                    placeholder="Enter 6-digit OTP"
                    value={mobileOTP}
                    onChange={(e) => setMobileOTP(e.target.value)}
                    disabled={isMobileOtpVerified}
                  />
                  <Button
                    className="h-8 bg-primary text-white"
                    onClick={handleVerifyMobileOTP}
                    disabled={isMobileOtpVerified || loading}
                    type="button"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify OTP'}
                  </Button>
                </div>
              </div>
            )}

            {/* New Password */}
            {isMobileOtpVerified && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Must be at least 8 characters' },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                          message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
                        },
                      })}
                    />
                    <Button
                      className="absolute right-2 top-2 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                      variant="ghost"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === watchPassword || 'Passwords do not match',
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </>
            )}

            {/* Submit */}
            {isMobileOtpVerified && (
              <Button className="h-8 bg-primary text-white w-full" type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Reset Password'}
              </Button>
            )}
          </form>

          {message && (
            <p className={`mt-4 text-center text-sm ${
              message.includes('successfully') ? 'text-green-600' : 'text-red-600'
            }`}>
              {message}
            </p>
          )}

          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              className="text-blue-500 hover:text-blue-700 cursor-pointer"
              onClick={() => router.push('/login')}
            >
              Back to Login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
