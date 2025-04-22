import type { ReactNode } from "react";
import type { Metadata } from "next";
//import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toast } from "@/components/ui/toast";
import { GlobalLoading } from "./global-loading";
import { Suspense } from "react";

//const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "G-Construction Management System",
  description: "A web-based civil contractor management system",
  generator: "v0.dev",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Suspense fallback={<GlobalLoading />}>
            {children}
          </Suspense>
          <Toast id="" />
        </ThemeProvider>
      </body>
    </html>
  );
}
