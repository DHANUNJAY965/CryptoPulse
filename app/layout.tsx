import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ClientSessionProvider } from "@/components/ClientSessionProvider";
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CryptoPulse',
  description: 'Smarter Alerts for Smarter Investors',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientSessionProvider>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        </ClientSessionProvider>
      </body>
    </html>
  );
}