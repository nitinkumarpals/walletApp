import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import ClientForm from "@/src/components/ClientForm";

export default function LandingPage() {
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
                <ClientForm />
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
