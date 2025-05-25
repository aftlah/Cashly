"use client";

import { usePathname } from "next/navigation";
import { Layouts } from "./Layouts";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");
  const isNotFoundPage = pathname === "/not-found" || pathname === "/404";

  if (isAuthPage || isNotFoundPage) {
    return <>{children}</>;
  }

  return <Layouts showWelcome>{children}</Layouts>;
}
