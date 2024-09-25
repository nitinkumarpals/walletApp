"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Wallet,
  ArrowRightLeft,
  History,
  DollarSign,
  ChevronRight,
  Shield,
  Globe,
  Smartphone,
} from "lucide-react";

type FormData = {
  username: string;
  number?: string;
  email: string;
  password: string;
};

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter text-blue-900 sm:text-5xl xl:text-6xl/none">
                    Your Smart Digital Wallet
                  </h1>
                  <p className="max-w-[600px] text-blue-700 md:text-xl">
                    Manage your money, make transfers, and track your
                    transactions all in one secure place.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-blue-600 text-white hover:bg-blue-700">
                    Get Started
                  </Button>
                  <Button
                    variant="outline"
                    className="border-blue-600 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4 bg-white rounded-xl p-8 shadow-lg">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-blue-900">
                    {isLogin ? "Login to Your Account" : "Create Your Account"}
                  </h2>
                  <p className="text-blue-600">
                    {isLogin
                      ? "Welcome back!"
                      : "Start managing your finances in minutes"}
                  </p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-blue-700">
                        Username
                      </Label>
                      <Input
                        id="username"
                        {...register("username", {
                          required: "Username is required",
                        })}
                        className="border-blue-300 focus:border-blue-500"
                      />
                      {errors.username && (
                        <p className="text-red-500 text-sm">
                          {errors.username.message}
                        </p>
                      )}
                    </div>
                  )}
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="number" className="text-blue-700">
                        Phone Number (Optional)
                      </Label>
                      <Input
                        id="number"
                        type="tel"
                        {...register("number")}
                        className="border-blue-300 focus:border-blue-500"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-blue-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Invalid email address",
                        },
                      })}
                      className="border-blue-300 focus:border-blue-500"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-blue-700">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                      })}
                      className="border-blue-300 focus:border-blue-500"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {isLogin ? "Login" : "Sign Up"}
                  </Button>
                </form>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-blue-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-blue-600">
                      Or continue with
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Google
                </Button>
                <div className="text-center text-sm text-blue-600">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="font-medium text-blue-700 hover:underline"
                  >
                    {isLogin ? "Sign up here" : "Login here"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-blue-900">
              How It Works
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="bg-blue-600 text-white rounded-full p-3 w-12 h-12 flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold text-blue-900">Sign Up</h3>
                <p className="text-blue-700">Create your account in minutes</p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="bg-blue-600 text-white rounded-full p-3 w-12 h-12 flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold text-blue-900">Add Funds</h3>
                <p className="text-blue-700">Link your bank or add money</p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="bg-blue-600 text-white rounded-full p-3 w-12 h-12 flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold text-blue-900">Start Using</h3>
                <p className="text-blue-700">
                  Send, receive, and manage your money
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 px-10 md:gap-16 md:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-blue-600 px-3 py-1 text-sm text-white font-semibold">
                  Security
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-blue-900">
                  Your Security is Our Top Priority
                </h2>
                <p className="max-w-[600px] text-blue-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We use state-of-the-art encryption and security measures to
                  ensure your money and data are always protected.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <Shield className="h-32 w-32 text-blue-600" />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-blue-900">
              Why Choose WalletApp?
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 p-6 rounded-lg bg-white border border-blue-200">
                <Globe className="h-12 w-12 text-blue-600" />
                <h3 className="text-xl font-bold text-blue-900">
                  Global Accessibility
                </h3>
                <p className="text-blue-700 text-center">
                  Access your money from anywhere in the world
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-6 rounded-lg bg-white border border-blue-200">
                <Shield className="h-12 w-12 text-blue-600" />
                <h3 className="text-xl font-bold text-blue-900">
                  Enhanced Security
                </h3>
                <p className="text-blue-700 text-center">
                  Advanced encryption and fraud protection
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-6 rounded-lg bg-white border border-blue-200">
                <Smartphone className="h-12 w-12 text-blue-600" />
                <h3 className="text-xl font-bold text-blue-900">
                  Mobile-First Design
                </h3>
                <p className="text-blue-700 text-center">
                  Optimized for seamless mobile experience
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-white border-t border-blue-200">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <Wallet className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold text-blue-900">WalletApp</span>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-blue-600">
              © 2024 WalletApp. All rights reserved.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link
              className="text-sm text-blue-600 hover:text-blue-800"
              href="#"
            >
              Terms of Service
            </Link>
            <Link
              className="text-sm text-blue-600 hover:text-blue-800"
              href="#"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
