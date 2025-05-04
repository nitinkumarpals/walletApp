"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Fingerprint,
  Database,
  LockKeyhole,
  AlertCircle,
  Eye,
} from "lucide-react";

const Security: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div
      id="security"
      className="py-32 px-4 md:px-8 relative overflow-hidden bg-gradient-to-b from-transparent via-wallet-purple/5 to-transparent"
    >
      {/* Background Elements */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-[10%] top-[20%] h-[800px] w-[800px] rounded-full bg-wallet-blue opacity-5 blur-3xl"></div>
        <div className="absolute right-[20%] bottom-[10%] h-[600px] w-[600px] rounded-full bg-wallet-purple opacity-5 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="px-4 py-2 rounded-full bg-wallet-purple/10 text-wallet-purple text-sm font-medium inline-block mb-6">
              Security First
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Your money, <span className="gradient-text">protected</span>
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              NimbleWallet employs military-grade security protocols to ensure
              your assets and personal information remain secure. Our
              multi-layered approach provides protection at every level.
            </p>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <SecurityFeature
                icon={<Shield className="h-6 w-6" />}
                title="End-to-End Encryption"
                description="Your data is encrypted in transit and at rest"
              />

              <SecurityFeature
                icon={<Fingerprint className="h-6 w-6" />}
                title="Biometric Authentication"
                description="Use your fingerprint or face ID for access"
              />

              <SecurityFeature
                icon={<Database className="h-6 w-6" />}
                title="Secure Data Storage"
                description="Distributed systems prevent single points of failure"
              />

              <SecurityFeature
                icon={<LockKeyhole className="h-6 w-6" />}
                title="Two-Factor Authentication"
                description="Additional layer of security for sensitive actions"
              />

              <SecurityFeature
                icon={<AlertCircle className="h-6 w-6" />}
                title="Fraud Monitoring"
                description="AI-powered anomaly detection for suspicious activity"
              />

              <SecurityFeature
                icon={<Eye className="h-6 w-6" />}
                title="Privacy Controls"
                description="Granular control over your data visibility"
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute -inset-px bg-gradient-to-r from-wallet-purple via-wallet-blue to-wallet-pink rounded-full opacity-30 blur"></div>
            <div className="relative rounded-full aspect-square flex items-center justify-center bg-white dark:bg-gray-900 overflow-hidden shadow-2xl">
              <div className="absolute w-[150%] h-[150%] animate-spin-slow">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-wallet-purple/10 via-wallet-blue/10 to-transparent"></div>
                <div className="absolute top-[25%] left-[25%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-wallet-blue/20 via-wallet-green/20 to-transparent transform rotate-45"></div>
              </div>

              <div className="relative z-10 h-[70%] w-[70%] rounded-full border-4 border-white dark:border-gray-800 bg-gradient-to-br from-wallet-purple/5 to-wallet-blue/5 p-8 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <div className="relative h-20 w-20 mx-auto mb-4">
                    <div className="absolute inset-0 bg-wallet-purple/20 rounded-full blur-md animate-pulse-glow"></div>
                    <div className="relative h-full w-full flex items-center justify-center">
                      <ShieldLockIcon className="h-12 w-12 text-wallet-purple" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 gradient-text">
                    Bank-Level Security
                  </h3>
                  <p className="text-sm text-gray-600 max-w-[220px] mx-auto">
                    Protected by advanced encryption standards and continuous
                    security monitoring
                  </p>
                </div>
              </div>
            </div>

            <div
              className="absolute top-[10%] -right-6 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-xl animate-float"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-wallet-green/10 rounded-xl flex items-center justify-center">
                  <Shield className="h-5 w-5 text-wallet-green" />
                </div>
                <p className="text-sm font-medium">Threat Blocked</p>
              </div>
            </div>

            <div
              className="absolute bottom-[10%] -left-6 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-xl animate-float"
              style={{ animationDelay: "1.5s" }}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-wallet-blue/10 rounded-xl flex items-center justify-center">
                  <LockKeyhole className="h-5 w-5 text-wallet-blue" />
                </div>
                <p className="text-sm font-medium">2FA Verified</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const SecurityFeature: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
      className="flex items-start gap-4"
    >
      <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-wallet-purple/10 flex items-center justify-center text-wallet-purple">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

const ShieldLockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 17a2 2 0 100-4 2 2 0 000 4z" />
    <path d="M12 12V8" />
  </svg>
);

export default Security;