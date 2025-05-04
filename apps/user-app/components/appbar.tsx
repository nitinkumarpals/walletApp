import Link from 'next/link';
import { Button } from './ui/button';
import { Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AppbarProps {
  user?: {
    name?: string | null;
  };
  onSignin: () => Promise<void>;
  onSignout: () => Promise<void>;
}

export const Appbar = ({ user, onSignin, onSignout }: AppbarProps) => {
  const router = useRouter();

  return (
    <></>
    // <header className="sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
    //   <Link className="flex items-center justify-center" href="/">
    //     <Wallet className="h-6 w-6 text-blue-600" />
    //     <span className="ml-2 text-lg font-bold text-blue-800">WalletApp</span>
    //   </Link>
    //   <div className="flex gap-2">
    //     {user ? (
    //       <Button
    //         onClick={onSignout}
    //         variant="outline"
    //         className="text-blue-700 hover:text-blue-900 hover:bg-blue-100"
    //       >
    //         Logout
    //       </Button>
    //     ) : (
    //       <>
    //         <Button
    //           onClick={() => router.push('/login')}
    //           variant="outline"
    //           className="text-blue-700 hover:text-blue-900 hover:bg-blue-100"
    //         >
    //           Login
    //         </Button>
    //       </>
    //     )}
    //   </div>
    // </header>
  );
};
