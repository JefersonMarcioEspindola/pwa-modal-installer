import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PWA Modal Installer · Apple Liquid Glass Prompt for Next.js & React",
  description:
    "Apple Liquid Glass PWA install prompt for Next.js and React with accordion height transition, iOS Safari instructions, Android 1-click install, and Desktop QR code.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-[#0b0c10] text-slate-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
