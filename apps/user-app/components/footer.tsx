"use client";
import React from "react";
import { Wallet } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-wallet-dark-gray text-white py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Wallet size={24} className="text-wallet-purple" />
              <span className="font-bold text-xl">NimbleWallet</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Simple, secure money management for everyone.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="#security">Security</FooterLink>
              <FooterLink href="#faq">FAQ</FooterLink>
              <FooterLink href="#">Pricing</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
              <FooterLink href="#">Acceptable Use</FooterLink>
              <FooterLink href="#">Cookie Policy</FooterLink>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} NimbleWallet. All rights reserved.
          </p>

          <div className="flex space-x-6">
            <SocialLink href="https://x.com/nitinkumarpals" icon="twitter" />
            <SocialLink
              href="https://github.com/nitinkumarpals/walletApp"
              icon="github"
            />
            <SocialLink
              href="https://www.linkedin.com/in/nitinkumarpals/"
              icon="linkedin"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <li>
    <a
      href={href}
      className="text-gray-400 hover:text-wallet-purple transition-colors"
    >
      {children}
    </a>
  </li>
);

const SocialLink: React.FC<{ href: string; icon: string }> = ({
  href,
  icon,
}) => {
  return (
    <a
      href={href}
      className="text-gray-400 hover:text-wallet-purple transition-colors"
      aria-label={`Follow us on ${icon}`}
    >
      {icon === "twitter" && (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23 3.00005C22.0424 3.67552 20.9821 4.19216 19.86 4.53005C19.2577 3.83756 18.4573 3.34674 17.567 3.12397C16.6767 2.90121 15.7395 2.95724 14.8821 3.2845C14.0247 3.61176 13.2884 4.19445 12.773 4.95376C12.2575 5.71308 11.9877 6.61238 12 7.53005V8.53005C10.2426 8.57561 8.50127 8.18586 6.93101 7.39549C5.36074 6.60513 4.01032 5.43868 3 4.00005C3 4.00005 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.50005C20.9991 7.2215 20.9723 6.94364 20.92 6.67005C21.9406 5.66354 22.6608 4.39276 23 3.00005Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {icon === "github" && (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 16.42 5.07 20.17 9.26 21.5C9.81 21.58 10 21.27 10 21V18.88C6.73 19.54 6.14 17.34 6.14 17.34C5.68 16.05 5 15.7 5 15.7C4.09 15.07 5.07 15.09 5.07 15.09C6.07 15.17 6.58 16.13 6.58 16.13C7.46 17.64 8.91 17.2 9.5 16.91C9.58 16.24 9.84 15.77 10.13 15.5C7.73 15.22 5.25 14.29 5.25 10.78C5.25 9.77 5.63 8.97 6.24 8.36C6.15 8.09 5.82 6.96 6.33 5.43C6.33 5.43 7.1 5.17 10 6.89C10.94 6.63 11.97 6.5 13 6.5C14.03 6.5 15.06 6.63 16 6.89C18.9 5.17 19.67 5.43 19.67 5.43C20.18 6.96 19.85 8.09 19.76 8.36C20.37 8.97 20.75 9.77 20.75 10.78C20.75 14.3 18.27 15.22 15.87 15.5C16.26 15.87 16.61 16.58 16.61 17.64V21C16.61 21.27 16.8 21.59 17.35 21.5C21.53 20.17 24.6 16.42 24.6 12C24.6 6.48 20.12 2 14.6 2H12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {icon === "linkedin" && (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 9H2V21H6V9Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </a>
  );
};

export default Footer;
