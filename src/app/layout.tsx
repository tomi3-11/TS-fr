import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// 1. BRANDING METADATA
export const metadata: Metadata = {
  title: {
    template: "%s | Tech MSpace",
    default: "Tech MSpace - Developer Collaboration Platform",
  },
  description: "Join the ultimate community for developers. Collaborate on projects, propose solutions, and vote on the future of tech.",
  keywords: ["Developers", "Collaboration", "Open Source", "Tech Community", "Coding"],
  authors: [{ name: "Tech MSpace Team" }],
  icons: {
    icon: "/icon", // This will point to our dynamic icon.tsx
    apple: "/apple-icon", // This points to apple-icon.tsx
  },
};

// 2. THEME COLOR (Mobile Browser Bars)
export const viewport: Viewport = {
  themeColor: "#020617", // slate-950
  width: "device-width",
  initialScale: 1,
};

const googleAnalyticsID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
           {children}
        </AuthProvider>

        { googleAnalyticsID && <GoogleAnalytics gaId={googleAnalyticsID} />}
      </body>
    </html>
  );
}