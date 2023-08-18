"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import React, { useState, useEffect } from "react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider>
      <ThemeProvider attribute="class">{children}</ThemeProvider>;
    </ClerkProvider>
  );
};

export default Providers;
