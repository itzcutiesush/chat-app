"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { createContext, ReactNode } from "react";
import { getQueryClient } from "@/lib/queryClient";

type GeneralProviderProps = {
  children: ReactNode;
};

export const GeneralContext = createContext(null);

export default function GeneralProvider({ children }: GeneralProviderProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <GeneralContext.Provider value={null}>{children}</GeneralContext.Provider>
    </QueryClientProvider>
  );
}
