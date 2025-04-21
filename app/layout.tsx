import { Suspense } from "react"
import GlobalLoading from "./global-loading" // already a client component
import { ThemeProvider } from "next-themes"
import { Toast } from "@/components/ui/toast"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Suspense fallback={null}>
            <GlobalLoading />
          </Suspense>
          {children}
          <Toast id={""} />
        </ThemeProvider>
      </body>
    </html>
  )
}
