'use client';

import { ThemeProvider } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { NextUIProvider } from '@nextui-org/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <NextUIProvider>
          <ThemeProvider attribute="class">{children}</ThemeProvider>
        </NextUIProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Providers;
