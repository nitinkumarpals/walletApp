"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { LogOut, Home, Activity, Plus, Send, Settings, CreditCard } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { API_BASE_URL, API_PATHS } from "@/lib/api/config";

const menuData = [
  {
    name: "overview",
    icon: Home,
    link: "/dashboard",
  },
  {
    name: "transactions",
    icon: Activity,
    link: "/activity",
  },
  {
    name: "add money",
    icon: Plus,
    link: "/add-money",
  },
  {
    name: "send money",
    icon: Send,
    link: "/send",
  },
  {
    name: "cards",
    icon: CreditCard,
    link: "/cards",
  },
];

const BottomBar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignout = async () => {
    try {
      await fetch(`${API_BASE_URL}${API_PATHS.logout}`, { method: "POST", credentials: "include" });
      router.replace("/");
    } catch (err) {
      console.error(err);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed block lg:hidden z-50 w-[calc(100%-24px)] h-16 max-w-lg -translate-x-1/2 bg-surface/80 backdrop-blur-xl border border-border rounded-full bottom-4 left-1/2 overflow-hidden">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
        {[
          ...menuData,
          {
            name: "logout",
            icon: LogOut,
            isButton: true,
          },
        ].map((item: any) => {
          const isItemActive = item.link ? isActive(item.link) : false;
          const IconComponent = item.icon;

          const iconColor = isItemActive
            ? "text-lime"
            : "text-muted-foreground group-hover:text-foreground";

          const sharedClasses = "inline-flex flex-col items-center justify-center px-5 hover:bg-surface-2 transition-colors group";

          if (item.isButton) {
            return (
              <button
                key={item.name}
                className={sharedClasses}
                onClick={handleSignout}
              >
                <div className="mb-1 text-destructive/80 group-hover:text-destructive">
                  <IconComponent className="h-5 w-5" />
                </div>
                <span className="sr-only">{item.name}</span>
              </button>
            );
          }

          return (
            <Link href={item.link} key={item.name} className={sharedClasses}>
              <div className={cn("mb-1", iconColor)}>
                <IconComponent className="h-5 w-5" />
              </div>
              <span className="sr-only">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default function DashboardShell({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  const router = useRouter();
  const handleSignout = async () => {
    try {
      await fetch(`${API_BASE_URL}${API_PATHS.logout}`, { method: "POST", credentials: "include" });
      router.replace("/");
    } catch (err) {
      console.error(err);
    }
  };

  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="min-h-screen bg-background text-foreground xl:flex selection:bg-lime/20 selection:text-lime relative overflow-hidden">
      <div className="absolute inset-0 -z-10 dotgrid opacity-50 pointer-events-none" />
      <aside
        className="fixed mt-16 flex flex-col lg:mt-0 top-0 px-6 left-0 bg-background/50 backdrop-blur-xl border-r border-border h-screen transition-all duration-300 ease-in-out z-50 
        w-[280px]
        -translate-x-full
        lg:translate-x-0"
      >
        <div className="py-8 flex justify-start">
          <Link className="flex items-center gap-2 mono text-foreground" href="/dashboard">
            <span className="inline-block h-2 w-2 rounded-full bg-lime animate-ticker" />
            <span className="text-xl font-medium tracking-tight">nimble<span className="text-lime">/</span></span>
          </Link>
        </div>
        
        <h2 className="mb-4 mt-4 label-mono text-muted-foreground flex justify-start">
          // navigation
        </h2>
        
        <ul className="flex flex-col gap-1.5 flex-1">
          {menuData.map((item) => {
            const IconComp = item.icon;
            const active = isActive(item.link);
            return (
              <li key={item.name}>
                <Link
                  href={item.link}
                  className={cn(
                    "relative flex items-center gap-3 py-3 px-4 rounded-lg transition-colors cursor-pointer group lg:justify-start mono text-sm",
                    active
                      ? "bg-surface-2 text-foreground"
                      : "text-muted-foreground hover:bg-surface-2/50 hover:text-foreground"
                  )}
                >
                  {active && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-lime rounded-r-md" />
                  )}
                  <IconComp className={cn("h-4 w-4", active ? "text-lime" : "text-muted-foreground group-hover:text-foreground")} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mb-8 mt-auto flex flex-col gap-3 px-4">
           <div className="flex items-center gap-2 mono text-[10px] text-muted-foreground uppercase tracking-widest">
             <span className="inline-block h-1.5 w-1.5 rounded-full bg-lime" />
             all systems operational
           </div>
           <div className="mono text-[10px] text-muted-foreground tracking-widest">
             V2.6 · SEPT 2026
           </div>
        </div>
      </aside>

      <div className="flex-1 transition-all duration-300 ease-in-out lg:ml-[280px]">
        {/* Mobile Header */}
        <header className="sticky top-0 flex w-full bg-background/80 backdrop-blur-xl border-b border-border z-[40] lg:hidden">
          <div className="flex items-center justify-between w-full px-5 py-4">
             <Link className="flex items-center gap-2 mono text-foreground" href="/dashboard">
                <span className="inline-block h-2 w-2 rounded-full bg-lime animate-ticker" />
                <span className="text-lg font-medium tracking-tight">nimble<span className="text-lime">/</span></span>
             </Link>
             <div className="flex items-center gap-3">
               <Link href="/settings" className="flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-foreground transition-colors">
                 <Settings className="h-5 w-5" />
               </Link>
               <Avatar className="h-8 w-8 border border-border">
                  {session?.user?.name && (
                    <AvatarFallback className="bg-surface-2 text-foreground text-xs mono">
                      {session?.user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
             </div>
          </div>
        </header>
        
        <main className="p-4 mx-auto max-w-6xl md:p-8 lg:p-10 min-h-[calc(100vh-64px)] pb-24 lg:pb-10">
          {/* Desktop Top Bar */}
          <header className="hidden lg:flex items-center justify-between mb-10 pb-5 border-b border-border">
            <div className="label-mono uppercase tracking-widest text-muted-foreground">
              NIMBLE / {pathname.replace("/", "") || "DASHBOARD"}
            </div>
            <div className="flex items-center gap-3">
              <Link href="/settings" className="flex items-center justify-center h-8 w-8 rounded-full border border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors">
                <Settings className="h-4 w-4" />
              </Link>
              <button
                onClick={handleSignout}
                className="flex items-center gap-2 py-1.5 px-4 rounded-full border border-lime/40 bg-transparent text-lime hover:bg-lime hover:text-background transition-all mono text-xs group"
              >
                <LogOut className="h-3.5 w-3.5 group-hover:text-background" /> log out
              </button>
            </div>
          </header>
          
          {children}
        </main>
        
        <BottomBar />
      </div>
    </div>
  );
}
