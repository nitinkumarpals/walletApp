import Link from "next/link";
import { Button } from "./ui/button";
import { Wallet } from "lucide-react";

interface AppbarProps {
  user?: {
    name?: string | null;
  };
  onSignin: () => Promise<void>;
  onSignout: () => Promise<void>;
}

export const Appbar = ({
  user,
  onSignin,
  onSignout,
}: AppbarProps) => {
  return (
    <header className="flex justify-between items-center border-b border-blue-200 px-4 py-3">
      <Link className="flex items-center justify-center" href="/">
        <Wallet className="h-6 w-6 text-blue-600" />
        <span className="ml-2 text-lg font-bold text-blue-800">WalletApp</span>
      </Link>
      <div className="flex gap-2"> 
        {user ? (
          <Button
            onClick={onSignout}
            variant="outline"
            className="text-blue-700 hover:text-blue-900 hover:bg-blue-100"
          >
            Logout
          </Button>
        ) : (
          <>
            <Button
              onClick={onSignin}
              variant="outline"
              className="text-blue-700 hover:text-blue-900 hover:bg-blue-100"
            >
              Login
            </Button>
          </>
        )}
      </div>
    </header>
  );
};
