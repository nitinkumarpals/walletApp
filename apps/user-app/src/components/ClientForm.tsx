"use client";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
type FormData = {
  name: string;
  email: string;
  password: string;
  number: string;
};

export default function ClientForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    if (isLogin) {
      try {
        const result = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        console.log(result);

        if (result?.error) {
          if (result.error === "CredentialsSignin") {
            toast({
              title: "Login Failed",
              description: "Incorrect username or password",
              variant: "destructive",
            });
          } else if (result.error === "User password is null") {
            toast({
              title: "Error",
              description:
                "No password found. Please set a password or use Google to sign in.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Error",
              description: result.error,
              variant: "destructive",
            });
          }
        }

        if (result?.url) {
          toast({
            title: "Success",
            description: "Login Successful",
            variant: "default",
          });
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error("An error occurred during the sign-in process", error);
        toast({
          title: "Error",
          description:
            "Something went wrong while trying to log in. Please try again.",
          variant: "destructive",
        });
      }
      finally {
        setIsLoading(false);
      }
    } else {
      // Handle custom signup
      try {
        const response = await axios.post("/api/sign-up", data);
        console.log("full response: " + response);
        if (response.data.success) {
          toast({
            title: "Success",
            description: "Signup successful",
            variant: "default",
          });
          setIsLogin(true);
        }
      } catch (error) {
        console.error("Signup error:", error);
        if (axios.isAxiosError(error) && error.response) {
          toast({
            title: "Error",
            description: `${error.response.data?.message || "Something went wrong!"}`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "An unexpected error occurred",
            variant: "destructive",
          });
        }
      }
      finally{
        setIsLoading(false);
      }
    }
  };

  const handleGoogleAuth = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <>
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-700">Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-blue-300 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {!isLogin && (
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-700">
                    Phone Number (optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-blue-300 focus:border-blue-500"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-700">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    className="border-blue-300 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-700">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="border-blue-300 focus:border-blue-500"
                    {...field}
                    name="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : (
              <>{isLogin ? "Login" : "Sign Up"}</>
            )}
          </Button>
        </form>
      </Form>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-blue-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-blue-600">Or</span>
        </div>
      </div>
      <Button onClick={handleGoogleAuth} variant="outline" className="w-full">
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
        Continue with Google
      </Button>
      <div className="text-center text-sm text-blue-600 mt-4">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="font-medium text-blue-700 hover:underline"
        >
          {isLogin ? "Sign up here" : "Login here"}
        </button>
      </div>
    </>
  );
}
