"use client";
import React from "react";

const PaymentMethods: React.FC = () => {
  return (
    <div id="how-it-works" className="py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Add money your way
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            NimbleWallet supports multiple payment methods for your convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-12">
            <PaymentMethod
              title="Credit & Debit Cards"
              description="Link your Visa, Mastercard, or American Express card to add funds instantly."
              icon="credit-card"
            />

            <PaymentMethod
              title="Bank Transfers"
              description="Connect your bank account for direct transfers with no additional fees."
              icon="bank"
            />

            <PaymentMethod
              title="Internet Banking"
              description="Use your online banking portal to securely transfer funds to your wallet."
              icon="globe"
            />
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-wallet-purple to-wallet-dark-purple rounded-xl opacity-30 blur-xl"></div>
            <div className="relative bg-white p-6 rounded-xl shadow-lg">
              <div className="border-b pb-4 mb-4">
                <h3 className="text-2xl font-bold">Add Funds</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Amount</p>
                  <div className="text-2xl font-bold flex items-center">
                    <span>$</span>
                    <span className="ml-1">1,000.00</span>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-500 rounded-md flex items-center justify-center text-white mr-3">
                        <CreditCardIcon />
                      </div>
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-xs text-gray-500">Expires 12/25</p>
                      </div>
                    </div>
                    <div className="h-5 w-5 rounded-full border-2 border-wallet-purple flex items-center justify-center">
                      <div className="h-3 w-3 bg-wallet-purple rounded-full"></div>
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 bg-wallet-purple hover:bg-wallet-dark-purple text-white rounded-lg font-medium transition-colors">
                  Add Funds
                </button>

                <div className="text-center text-xs text-gray-500">
                  <p>Funds are usually available instantly after adding.</p>
                  <p>Some bank transfers may take 1-3 business days.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentMethod: React.FC<{
  title: string;
  description: string;
  icon: string;
}> = ({ title, description, icon }) => {
  return (
    <div className="flex items-start">
      <div className="h-14 w-14 bg-wallet-light-purple/50 rounded-full flex items-center justify-center mr-5">
        {icon === "credit-card" && <CreditCardIcon />}
        {icon === "bank" && <BankIcon />}
        {icon === "globe" && <GlobeIcon />}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const CreditCardIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-wallet-purple"
  >
    <rect
      x="2"
      y="5"
      width="20"
      height="14"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M2 10H22" stroke="currentColor" strokeWidth="2" />
    <path d="M6 15H10" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const BankIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-wallet-purple"
  >
    <path
      d="M2 9L12 3L22 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="4" y="9" width="16" height="2" fill="currentColor" />
    <path
      d="M4 21H20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M6 11V19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M10 11V19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M14 11V19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M18 11V19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const GlobeIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-wallet-purple"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 2C14.6522 2 17.1957 3.05357 19.0711 4.92893C20.9464 6.8043 22 9.34784 22 12C22 14.6522 20.9464 17.1957 19.0711 19.0711C17.1957 20.9464 14.6522 22 12 22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M2 12H22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 2V22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default PaymentMethods;
