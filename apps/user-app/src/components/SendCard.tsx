"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { sendFormSchema } from "@repo/schemas/sendFormSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { p2pTransfer } from "../lib/actions/p2pTransfer";
import { Loader2, Send } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function SendCard() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof sendFormSchema>>({
    resolver: zodResolver(sendFormSchema),
    defaultValues: {
      email: "",
      amount: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof sendFormSchema>) => {
    setIsLoading(true);
    try {
      const result = await p2pTransfer(
        values.email,
        Math.floor(Number(values.amount) * 100)
      );
      if (result && result.message) {
        if (result.message === "Transfer successful") {
          toast({
            title: "Success",
            description: result.message,
          });
          form.reset();
        } else if (result.message.startsWith("Error:")) {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Unexpected Error",
            description: result.message,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send money. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center mr-24 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Send Money
          </CardTitle>
          <CardDescription className="text-center">
            Transfer funds securely to another user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          ₹
                        </span>
                        <Input
                          placeholder="0.00"
                          {...field}
                          type="number"
                          step="0.01"
                          min="0"
                          className="pl-7 w-full"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter the amount you want to send
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  className="w-[48%]"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="w-[48%]">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-sm text-center text-gray-500">
          Secure transactions powered by WalletApp
        </CardFooter>
      </Card>
    </div>
  );
}
