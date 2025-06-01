"use client";

import { usePathname } from "next/navigation";
import { Layouts } from "./Layouts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");
  const isNotFoundPage = pathname === "/not-found" || pathname === "/404";

  const queryClient = new QueryClient();

  if (isAuthPage || isNotFoundPage) {
    return <>{children}</>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Layouts>{children}</Layouts>
    </QueryClientProvider>
  )
}
