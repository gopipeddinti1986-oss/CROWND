import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { ThemeProvider, ThemeScript } from "@/components/theme/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SkipLink } from "@/components/layout/skip-link";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "CROWND — Performance-Based Creator Commerce",
    template: "%s | CROWND",
  },
  description:
    "From Followers to Real Results. The performance-first platform connecting brands with micro-creators through verified, post-delivery attribution.",
  openGraph: {
    title: "CROWND — Performance-Based Creator Commerce",
    description: "From Followers to Real Results. Transparent earnings, zero upfront waste.",
    url: "/",
    siteName: "CROWND",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${newsreader.variable} ${sourceSans.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="selection:bg-accent/20 min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <ToastProvider>
            <SkipLink />
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
