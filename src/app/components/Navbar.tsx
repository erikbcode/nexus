import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';
import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';

const Navbar = async () => {
  // const session = await getServerSession(authOptions);
  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-300 dark:border-zinc-800 z-[10] py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        {/* logo */}
        <Link href="/" className="flex gap-2 items-center">
          <p className="hidden text-zinc-700 dark:text-zinc-200 text-3xl font-bold md:block">Nexus</p>
        </Link>
        <div className="flex flex-row gap-4 items-center">
          <ThemeSwitcher />
          <SignedIn>
            <div style={{ fontSize: '2.5rem' }}>
              <UserButton afterSignOutUrl="/welcome"></UserButton>
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-2.5 h-8 font-semibold text-zinc-700 dark:text-zinc-200 text-xl rounded-xl bg-zinc-200 dark:bg-base-800 hover:bg-zinc-300 dark:hover:bg-base-700">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* search bar */}
        {/* <SearchBar /> */}

        {/* actions */}
        {/* {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link href="/sign-in" className={buttonVariants()}>
            Sign In
          </Link>
        )} */}
      </div>
    </div>
  );
};

export default Navbar;
