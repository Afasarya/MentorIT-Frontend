import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { TokenRefreshHandler } from '@/components/auth/TokenRefreshHandler';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MentorIT - Platform Pembelajaran IT",
  description: "Platform pembelajaran IT dengan mentor terbaik untuk mengembangkan skill programming Anda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <TokenRefreshHandler>
            {children}
          </TokenRefreshHandler>
        </AuthProvider>
      </body>
    </html>
  );
}
