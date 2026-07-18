export const dynamic = 'force-dynamic';
import { redirect } from "next/navigation";
import { getServerSession } from "@/features/auth/server-session";
import DashboardShell from "./dashboard-shell";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }

  return <DashboardShell session={session}>{children}</DashboardShell>;
}
