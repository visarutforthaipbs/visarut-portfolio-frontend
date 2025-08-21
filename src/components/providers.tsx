"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/lib/theme";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}
