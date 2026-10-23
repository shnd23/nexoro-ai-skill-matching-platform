import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Nexero: Find Your Perfect Gig ",
  description:
    "A two-sided gig marketplace where you post what you need and get matched with people whose skills fit. Powered by AI matching.",
  keywords: ["gig", "marketplace", "freelance", "matching", "skills"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>

        <script src="https://accounts.google.com/gsi/client" async defer />
      </head>
      <body className={cn(inter.variable, outfit.variable, "font-sans antialiased min-h-screen bg-[#f7f4f0] text-zinc-900")}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen relative z-10">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster theme="light" className="z-50" />
        </AuthProvider>
      </body>
    </html>
  );
}
