'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from '@heroicons/react/20/solid';

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      className={`w-12 h-12 rounded-full flex items-center justify-center bg-zinc-200 hover:bg-zinc-300 dark:bg-base-800 dark:hover:bg-base-700`}
      onClick={toggleTheme}
    >
      {theme === 'light' ? (
        <MoonIcon className={`text-zinc-700 w-8 h-8`} />
      ) : (
        <SunIcon className={`text-zinc-200 w-8 h-8`} />
      )}
    </button>
  );
}

export default ThemeSwitcher;
