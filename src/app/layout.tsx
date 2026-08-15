import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const gondi = localFont({
  src: "../../public/fonts/NotoSansMasaramGondi-Regular.ttf",
  variable: "--font-gondi",
  display: "swap",
});

const deva = localFont({
  src: "./fonts/NotoSansDevanagari-Regular.ttf",
  variable: "--font-deva",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Masaram Gondi Language Platform",
    template: "%s · Masaram Gondi Language Platform",
  },
  description:
    "Masaram Gondi Language Platform — dictionary, script converter, grammar and keyboard. Search Gondi words in Masaram Gondi script, Devanagari pronunciation, Hindi and English. Built from the uploaded गोंडी करीयाट source.",
  applicationName: "Masaram Gondi Language Platform",
  manifest: "/manifest.json",
  authors: [{ name: "Saiyyam Ji" }, { name: "Rajendra Saiyyam" }],
  keywords: [
    "Masaram Gondi",
    "Gondi dictionary",
    "Gondi converter",
    "Gondi grammar",
    "गोंडी",
    "मसराम गोंडी",
    "Unicode 11D00",
  ],
  appleWebApp: { capable: true, title: "Masaram Gondi", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#142418",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi" className={`${gondi.variable} ${deva.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
