"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/src/lib/utils";
import { LogOut } from "lucide-react";
import { Icon } from "@iconify/react";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const menuData = [
  {
    name: "Dashboard",
    icon: <Icon icon="solar:home-2-bold-duotone" width={24} />,
    link: "/dashboard",
  },
  {
    name: "Transactions",
    icon: <Icon icon={"solar:card-transfer-bold-duotone"} width={26} />,
    link: "/transactions",
  },
  {
    name: "Transfer",
    icon: <Icon icon={"solar:banknote-2-bold-duotone"} width={26} />,
    link: "/transfer",
    main: true,
    className:
      "inline-flex items-center justify-center w-10 h-10 font-medium bg-wallet-purple rounded-full hover:bg-wallet-dark-purple text-white group-hover:text-gray-300 focus:ring-4 focus:ring-blue-300 focus:outline-none  dark:focus:ring-blue-800 ",
  },

  {
    name: "P2P Transfer",
    icon: <Icon icon={"solar:user-id-bold-duotone"} width={26} />,
    link: "/p2p",
  },
];

const BottomBar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignout = async () => {
    await signOut({ callbackUrl: "/" });
    router.replace("/");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed block lg:hidden z-50 w-[calc(100%-24px)] h-16 max-w-lg -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-4 left-1/2 dark:bg-gray-700 dark:border-gray-600 overflow-hidden">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
        {[
          ...menuData,
          {
            name: "Logout",
            icon: <Icon icon={"solar:logout-3-bold-duotone"} width={24} />,
            isButton: true,
          },
        ].map((item: any) => {
          const isItemActive = isActive(item.link);
          const iconColor = isItemActive
            ? "text-wallet-purple"
            : "text-gray-500 dark:text-gray-400 group-hover:text-wallet-purple dark:group-hover:text-blue-500";

          const sharedClasses =
            "inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group";

          if (item.isButton) {
            return (
              <button
                key={item.name}
                className={sharedClasses}
                onClick={handleSignout}
              >
                <div className="mb-1 text-red-500">{item.icon}</div>
                <span className="sr-only">{item.name}</span>
              </button>
            );
          }

          return (
            <Link href={item.link} key={item.name} className={sharedClasses}>
              <div className={cn("mb-1", item.className || iconColor)}>
                {item.icon}
              </div>
              <span className="sr-only">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default function LayoutUI({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  const router = useRouter();
  const handleSignout = async () => {
    await signOut({ callbackUrl: "/" });
    router.replace("/");
  };

  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="min-h-screen xl:flex">
      <aside
        className="fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        w-[290px]
        -translate-x-full
        lg:translate-x-0"
      >
        <div className="py-8 flex  justify-start">
          <Link className="flex  items-center justify-center" href="/">
            <div className="bg-wallet-dark-purple h-9 w-9 text-white flex items-center justify-center rounded-lg ">
              <Icon icon={"solar:wallet-money-bold"} width={24} />
            </div>

            <span className="ml-2 text-xl font-bold uppercase text-w">
              NimbleWallet
            </span>
          </Link>
        </div>
        <h2 className="mb-4 text-xs uppercase font-semibold flex leading-[20px] text-gray-400 justify-start">
          Main Menu
        </h2>
        <ul className="flex flex-col gap-2">
          {menuData.map((item) => (
            <li key={item.name}>
              <Link
                href={item.link}
                className={cn(
                  "flex items-center gap-3 py-2 px-4 rounded-lg transition cursor-pointer group lg:justify-start",
                  isActive(item.link)
                    ? "bg-wallet-light-purple text-wallet-purple"
                    : "hover:bg-gray-100"
                )}
              >
                <span
                  className={cn(
                    "transition",
                    isActive(item.link)
                      ? "text-wallet-purple"
                      : "text-gray-600 group-hover:text-wallet-purple"
                  )}
                >
                  {item.icon}
                </span>
                <span
                  className={cn(
                    isActive(item.link)
                      ? "text-wallet-purple"
                      : "text-gray-600 group-hover:text-wallet-purple"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex-1 transition-all  duration-300 ease-in-out lg:ml-[290px]">
        <header className="sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
          <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
            <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  {session?.user?.image && (
                    <AvatarImage
                      src={session?.user?.image}
                      alt={session?.user?.name || "User Avatar"}
                    />
                  )}
                  {session?.user?.name && (
                    <AvatarFallback className="bg-purple-200 text-purple-800 text-xl font-semibold">
                      {session?.user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <h3 className="text-md font-semibold text-gray-500 dark:text-gray-300">
                  {session?.user?.name}
                </h3>
              </div>
            </div>
            <div className="hidden items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none">
              <button
                onClick={handleSignout}
                className="inline-flex uppercase items-center justify-center font-medium gap-2 rounded-lg transition  px-4 py-3 text-sm bg-wallet-purple text-white shadow-theme-xs hover:bg-wallet-dark-purple disabled:bg-wallet-light-purple"
              >
                <LogOut style={{ width: 18, height: 18 }} /> Logout
              </button>
            </div>
          </div>
        </header>
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
        <BottomBar />
        <div className="h-20 block lg:hidden"></div>
      </div>
    </div>
  );
}
