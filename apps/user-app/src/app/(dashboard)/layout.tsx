export const dynamic = 'force-dynamic';
import { redirect } from "next/navigation";
import { getServerSession } from "@/src/lib/getServerSession";
import LayoutUI from "./layout-ui";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }

  return <LayoutUI session={session}>{children}</LayoutUI>;
}
