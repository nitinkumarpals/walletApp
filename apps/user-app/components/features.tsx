"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Send,
  ArrowDownToLine,
  CreditCard,
  BarChart3,
  ShieldCheck,
  Banknote,
} from "lucide-react";
import Image from 'next/image';

const Features: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div id="features" className="py-32 px-4 md:px-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(108,92,231,0.15),transparent)]"></div>
      <div className="absolute -right-[300px] -top-[100px] w-[600px] h-[600px] bg-wallet-green/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -left-[300px] -bottom-[100px] w-[600px] h-[600px] bg-wallet-blue/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="px-4 py-2 rounded-full bg-wallet-blue/10 text-wallet-blue text-sm font-medium inline-block mb-6">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 max-w-3xl mx-auto">
            Everything you need for{" "}
            <span className="gradient-text">modern banking</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful tools to send, receive, and manage your money with
            unprecedented speed and security.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <FeatureCard
            icon={<Send />}
            title="Instant Transfers"
            description="Send money anywhere in the world instantly with minimal fees. Track your transfers in real-time."
            color="purple"
          />

          <FeatureCard
            icon={<ArrowDownToLine />}
            title="Easy Deposits"
            description="Add funds to your wallet through multiple payment methods. Instant processing for urgent needs."
            color="blue"
          />

          <FeatureCard
            icon={<CreditCard />}
            title="Virtual Cards"
            description="Create unlimited virtual cards for online shopping with custom spending limits and security controls."
            color="green"
          />

          <FeatureCard
            icon={<Banknote />}
            title="Multi-Currency"
            description="Hold and exchange multiple currencies with competitive rates and no hidden fees."
            color="orange"
          />

          <FeatureCard
            icon={<BarChart3 />}
            title="Smart Analytics"
            description="Track your spending habits with AI-powered insights and set customizable budget goals."
            color="yellow"
          />

          <FeatureCard
            icon={<ShieldCheck />}
            title="Advanced Security"
            description="Rest easy with biometric authentication, encryption, and real-time fraud monitoring."
            color="pink"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-32 relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-wallet-blue via-wallet-purple to-wallet-pink rounded-3xl opacity-20 blur-xl"></div>
          <div className="relative neo-card">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              <div className="lg:w-1/2">
                <h3 className="text-3xl font-bold mb-6">
                  Building the future of digital finance
                </h3>
                <p className="text-lg text-gray-600 mb-8">
                  Our platform combines cutting-edge technology with
                  user-centered design to create the most intuitive financial
                  experience possible.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <p className="text-4xl font-bold gradient-text mb-2">
                      99.99%
                    </p>
                    <p className="text-gray-600">Uptime reliability</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold gradient-text mb-2">
                      256-bit
                    </p>
                    <p className="text-gray-600">Bank-level encryption</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold gradient-text mb-2">$0</p>
                    <p className="text-gray-600">Account maintenance fees</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold gradient-text mb-2">
                      24/7
                    </p>
                    <p className="text-gray-600">Customer support</p>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2 relative">
                <div className="aspect-[4/3] rounded-xl overflow-hidden">
                  <Image
                    src="/images/book.avif"
                    alt="Mobile app interface"
                    className="w-full h-full object-cover"
                    width={800}
                    height={600}
                  />
                </div>

                <div className="absolute -top-6 -left-6 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-wallet-green/10 rounded-xl flex items-center justify-center">
                      <CheckCircleIcon className="h-6 w-6 text-wallet-green" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Transaction Approved
                      </p>
                      <p className="text-xs text-gray-500">Just now</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-wallet-blue/10 rounded-xl flex items-center justify-center">
                      <ChartIcon className="h-6 w-6 text-wallet-blue" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Spending Analytics</p>
                      <p className="text-xs text-gray-500">Updated</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "purple" | "blue" | "green" | "orange" | "yellow" | "pink";
}> = ({ icon, title, description, color }) => {
  const colorClasses = {
    purple: "bg-wallet-purple text-white",
    blue: "bg-wallet-blue text-white",
    green: "bg-wallet-green text-white",
    orange: "bg-wallet-orange text-white",
    yellow: "bg-wallet-yellow text-gray-900",
    pink: "bg-wallet-pink text-white",
  };

  const backgroundClasses = {
    purple: "bg-wallet-purple/5 border-wallet-purple/10",
    blue: "bg-wallet-blue/5 border-wallet-blue/10",
    green: "bg-wallet-green/5 border-wallet-green/10",
    orange: "bg-wallet-orange/5 border-wallet-orange/10",
    yellow: "bg-wallet-yellow/5 border-wallet-yellow/10",
    pink: "bg-wallet-pink/5 border-wallet-pink/10",
  };

  const textClasses = {
    purple: "text-wallet-purple",
    blue: "text-wallet-blue",
    green: "text-wallet-green",
    orange: "text-wallet-orange",
    yellow: "text-wallet-yellow",
    pink: "text-wallet-pink",
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
      }}
      className={`p-8 rounded-3xl border ${backgroundClasses[color]} hover:shadow-lg transition-all duration-300`}
    >
      <div
        className={`h-16 w-16 rounded-2xl ${colorClasses[color]} flex items-center justify-center mb-6`}
      >
        <div className="h-8 w-8">{icon}</div>
      </div>
      <h3 className={`text-2xl font-semibold mb-3 ${textClasses[color]}`}>
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
};

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ChartIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

export default Features;
