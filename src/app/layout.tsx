import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";

import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Providers from "@/components/Providers";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: {
    default: "PaperPod",
    template: `%s - PaperPod`,
  },
  description: "Exploring research papers have never been easier!",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("bg-background font-sans antialiased", fontSans.variable)}
      >
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Toaster richColors closeButton />
            <Analytics />
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
