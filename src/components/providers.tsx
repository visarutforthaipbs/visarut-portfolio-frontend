"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/lib/theme";
import { EmotionCacheProvider } from "./EmotionCacheProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <EmotionCacheProvider>
      <ChakraProvider value={system}>{children}</ChakraProvider>
    </EmotionCacheProvider>
  );
}
