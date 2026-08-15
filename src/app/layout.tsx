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
    default: "Masaram Gondi Script Dictionary",
    template: "%s · Masaram Gondi Script Dictionary",
  },
  description:
    "Masaram Gondi Script Dictionary — search Gondi words in Masaram Gondi script, Devanagari pronunciation, Hindi and English; translate, convert and learn the script. Preserving Our Language • Our Identity.",
  applicationName: "Masaram Gondi Script Dictionary",
  manifest: "/manifest.json",
  authors: [{ name: "Saiyyam Ji" }, { name: "Rajendra Saiyyam" }],
  keywords: [
    "Masaram Gondi",
    "Masaram Gondi Script",
    "Gondi Hindi English Dictionary",
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
  themeColor: "#123C2A",
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
