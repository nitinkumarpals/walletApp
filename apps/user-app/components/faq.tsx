"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ: React.FC = () => {
  return (
    <div id="faq" className="py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about NimbleWallet.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-medium">
              How do I add money to my wallet?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              You can add money to your NimbleWallet using credit/debit cards,
              bank transfers, or internet banking. Simply go to the "Add Funds"
              section in your account, select your preferred payment method, and
              follow the instructions.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-medium">
              What are the fees for sending money?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Sending money between NimbleWallet users is completely free. For
              transfers to external bank accounts, there's a small fee of 1%
              (capped at $5). International transfers have varying fees
              depending on the destination country.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-medium">
              How long do transfers take?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Transfers between NimbleWallet users are instant. Transfers to
              external bank accounts typically take 1-3 business days, depending
              on your bank's processing times.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg font-medium">
              Is my money safe in NimbleWallet?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Yes, your money is safe with us. We use bank-level encryption and
              security measures to protect your funds and personal information.
              Additionally, we implement two-factor authentication and biometric
              security to prevent unauthorized access.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-lg font-medium">
              What payment methods are supported?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              NimbleWallet supports major credit and debit cards (Visa,
              Mastercard, American Express), direct bank transfers, and online
              banking systems in most countries.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger className="text-lg font-medium">
              Can I withdraw money from my wallet?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Yes, you can withdraw money from your NimbleWallet to your linked
              bank account at any time. Withdrawals typically take 1-3 business
              days to process.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;