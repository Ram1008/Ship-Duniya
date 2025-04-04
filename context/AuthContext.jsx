"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axios";
import { useToast } from "@/hooks/use-toast";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        // Set the token in axios headers
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Get user data from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        setLoading(false);
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;
      
      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      // Set axios default header
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      setUser(user);
      toast({
        title: "Login successful",
        description: "Welcome back!",
        variant: "success",
      });
      
      router.push("/user/dashboard");
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Please check your credentials and try again",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axiosInstance.defaults.headers.common["Authorization"];
    setUser(null);
    router.push("/login");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
      variant: "default",
    });
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/register", userData);
      
      toast({
        title: "Registration successful",
        description: "Please login with your credentials",
        variant: "success",
      });
      
      router.push("/login");
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "Please try again",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 