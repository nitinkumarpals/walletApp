import { SidebarItem } from "../../components/SidebarItem";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import LayoutUI from "./layout-ui";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  return <LayoutUI session={session}>{children}</LayoutUI>;
}
