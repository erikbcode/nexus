import Link from 'next/link';
import ThemeSwitcher from './ui/ThemeSwitcher';
import { buttonVariants } from './ui/Button';
import { getAuthSession } from '@/lib/auth';
import UserAccountNav from './UserAccountNav';

const Navbar = async () => {
  const session = await getAuthSession();
  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 dark:bg-zinc-900 z-[10] py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between">
        {/* logo */}
        <Link href="/" className="flex gap-2 items-center">
          <p className="text-zinc-700 dark:text-zinc-200 text-2xl font-semibold">Nexus</p>
        </Link>
        <div className="text-lg text-zinc-700 dark:text-zinc-200">Search Bar</div>
        <div className="flex flex-row gap-4 items-center">
          <ThemeSwitcher />
          {session ? (
            <>
              {' '}
              <UserAccountNav
                user={{ id: session.user.id, name: session.user.name || null, image: session.user.image || null }}
              />
            </>
          ) : (
            <Link href="/sign-in" className={buttonVariants()}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;