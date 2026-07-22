"use client";
import { authApi } from "@/lib/api/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type FormData = {
  name: string;
  email: string;
  password: string;
  number: string;
};

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      number: undefined,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    if (isLogin) {
      try {
        const result = await authApi.login(data.email, data.password);
        if (result.success) {
          toast({
            title: "Success",
            description: "Login Successful",
          });
          router.push("/dashboard");
          router.refresh();
        }
      } catch (error) {
        toast({
          title: "Login Failed",
          description: "Incorrect email or password",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const result = await authApi.signUp({
          name: data.name,
          email: data.email,
          password: data.password,
          number: data.number || undefined,
        });
        if (result.success) {
          toast({
            title: "Success",
            description: "Signup successful",
          });
          router.push("/dashboard");
          router.refresh();
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Signup failed",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleAuth = () => {
    window.location.assign(authApi.googleLoginUrl());
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 -z-10 dotgrid opacity-50" />
      <div className="absolute inset-x-0 top-0 h-[500px] blur-3xl -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--ion)/0.18),transparent_60%)]" />

      <div className="max-w-md mx-auto pt-10 pb-24 px-4">
        <Link href="/" className="inline-flex items-center gap-2 label-mono mb-10 hover:text-lime">
          <ArrowLeft className="h-3.5 w-3.5" /> back to home
        </Link>

        <div className="mb-8">
          <div className="mono text-lg mb-2">nimble<span className="text-lime">/</span></div>
          <div className="label-mono mb-6">{"// "}{isLogin ? "sign in" : "create account"}</div>
          <h1 className="mono text-3xl md:text-4xl leading-[1] tracking-tight">
            {isLogin ? "welcome back." : "let&apos;s get you set up."}
          </h1>
          <p className="text-muted-foreground mt-3 text-sm">
            {isLogin ? "Sign in to your Nimble account." : "Two minutes. No card required."}
          </p>
        </div>

        <div className="tile p-7">

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {!isLogin && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="label-mono">username</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-surface-2 border-border h-11 mono" />
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
                      <FormLabel className="label-mono">phone (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-surface-2 border-border h-11 mono" />
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
                    <FormLabel className="label-mono">email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        className="bg-surface-2 border-border h-11 mono"
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
                    <FormLabel className="label-mono">password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="bg-surface-2 border-border h-11 mono"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-full bg-lime text-background hover:brightness-110 mono"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    loading…
                  </div>
                ) : (
                  <>{isLogin ? "sign in →" : "create account →"}</>
                )}
              </Button>
            </form>
          </Form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-2 label-mono">or</span>
            </div>
          </div>
          
          <Button onClick={handleGoogleAuth} variant="outline" className="w-full h-11 rounded-full bg-surface-2 border-border hover:border-lime/60 mono text-foreground relative z-10">
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
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
            continue with google
          </Button>
          
          <div className="text-center label-mono mt-6 relative z-10">
            {isLogin ? "no account yet?" : "already onboard?"}{" "}
            <button
              onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); }}
              className="text-lime hover:underline mono"
            >
              {isLogin ? "sign up →" : "sign in →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
