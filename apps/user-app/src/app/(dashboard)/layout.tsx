import { SidebarItem } from '../../components/SidebarItem';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import LayoutUI from './layout-ui';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/');
  }

  return (
    // <div className="flex flex-col lg:flex-row min-h-screen">
    //   <div className="lg:w-72 border-b lg:border-r border-slate-400 lg:min-h-screen">
    //     <div className="p-2 flex flex-row lg:flex-col items-center justify-center lg:justify-start lg:items-stretch overflow-x-auto lg:overflow-x-visible h-full lg:mr-4 lg:pt-28">
    //       <SidebarItem
    //         href="/dashboard"
    //         title="Dashboard"
    //         icon={<HomeIcon />}
    //       />
    //       <SidebarItem
    //         href="/transfer"
    //         title="Transfer"
    //         icon={<TransferIcon />}
    //       />
    //       <SidebarItem
    //         href="/transactions"
    //         title="Transactions"
    //         icon={<TransactionsIcon />}
    //       />
    //       <SidebarItem
    //         href="/p2p"
    //         title="P2P Transfer"
    //         icon={<P2pTransferIcon />}
    //       />
    //     </div>
    //   </div>
    //   <div className="flex-grow p-4 lg:p-8">{children}</div>
    // </div>

    <LayoutUI session={session}>{children}</LayoutUI>
  );
}
