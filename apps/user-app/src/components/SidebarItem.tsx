"use client";
import { usePathname, useRouter } from "next/navigation";
export const SidebarItem = ({
  href,
  title,
  icon,
}: {
  href: string;
  title: string;
  icon: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const selected = pathname === href;
  return (
    <div
      className={`flex cursor-pointer ${selected ? "text-[#6a51a6]" : "text-slate-500"} p-2 pl-8`}
      onClick={() => {
        router.push(href);
      }}
    >
      <div className="pr-2"> {icon} </div>
      <div className={`${selected ? "text-[#6a51a6]" : "text-slate-500"}`}>
        {title}
      </div>
    </div>
  );
};
