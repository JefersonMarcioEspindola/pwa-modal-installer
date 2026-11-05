import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PWA Modal Installer · Apple Native Style PWA Prompt for Next.js & React",
  description:
    "Componente de instalação de PWA no padrão nativo da Apple com design Liquid Glass, transição fluida em acordeão e alta taxa de conversão sem ser intrusivo.",
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
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#fbfbfd] text-slate-900 antialiased font-sans selection:bg-slate-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
