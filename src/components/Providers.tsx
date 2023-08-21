'use client';

import { ThemeProvider } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class">{children}</ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Providers;
