import "./globals.css";
import { Navigation } from "@/components/navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/layout/ScrollProgress";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

export const metadata = {
  title: "Md Ali Azgor — Creative Developer & UI/UX Designer",
  description:
    "Experimental portfolio of Md Ali Azgor. CSE student, UI/UX designer, and creative frontend engineer exploring the intersection of digital design and intelligent software.",
  keywords: [
    "Md Ali Azgor",
    "Ali Azgor",
    "Creative Developer",
    "UI/UX Designer",
    "Frontend Engineer",
    "IIUC",
    "Portfolio",
    "Next.js",
    "React",
  ],
  authors: [{ name: "Md Ali Azgor" }],
  creator: "Md Ali Azgor",
  metadataBase: new URL("https://aliazgor.me"),
  openGraph: {
    title: "Md Ali Azgor — Creative Developer & UI/UX Designer",
    description:
      "Future / Form — An Experimental Digital Portfolio by Md Ali Azgor. CSE student, UI/UX designer, and creative frontend engineer.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Md Ali Azgor — Creative Developer & UI/UX Designer",
    description:
      "Future / Form — An Experimental Digital Portfolio by Md Ali Azgor.",
  },
};

export const viewport = {
  themeColor: "#08090B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="scroll-smooth font-sans"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-obsidian text-softwhite antialiased selection:bg-orange selection:text-obsidian min-h-screen flex flex-col justify-between"
      >
        <SmoothScroll>
          <ScrollProgress />
          <Navigation />
          <div className="flex-1">{children}</div>
          <Footer />
          <ProgressiveBlur position="bottom" />
        </SmoothScroll>
      </body>
    </html>
  );
}
