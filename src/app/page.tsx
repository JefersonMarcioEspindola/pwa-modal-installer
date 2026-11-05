"use client";

import { useEffect, useState } from "react";
import {
  CheckIcon,
  CopyIcon,
  GithubIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  TerminalIcon,
} from "../components/icons";
import { PwaInstallModal } from "../components/pwa-install-modal";
import type { DevicePlatform } from "../lib/pwa";

export default function Home() {
  const [activePlatform, setActivePlatform] = useState<DevicePlatform | null>(null);
  const [isAccordionOpenPreview, setIsAccordionOpenPreview] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const preview = params.get("preview");
    if (preview === "ios") {
      setActivePlatform("ios");
      setIsAccordionOpenPreview(false);
    } else if (preview === "ios-steps") {
      setActivePlatform("ios");
      setIsAccordionOpenPreview(true);
    } else if (preview === "android") {
      setActivePlatform("android");
      setIsAccordionOpenPreview(false);
    } else if (preview === "desktop") {
      setActivePlatform("desktop");
      setIsAccordionOpenPreview(false);
    }
  }, []);

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      // ignore
    }
  };

  const usageSnippet = `// src/app/layout.tsx (ou onde preferir)
import { PwaInstallModal } from "@/components/pwa-install-modal";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <PwaInstallModal
          appName="Meu Aplicativo"
          appSubtitle="Aplicativo Oficial"
        />
      </body>
    </html>
  );
}`;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fbfbfd] text-slate-900">
      {/* Elementos sutis de fundo para demonstrar a translucidez do vidro */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-sky-100/70 via-indigo-100/50 to-purple-100/40 blur-3xl"
      />

      {/* Cabeçalho Minimalista Estilo Apple */}
      <header className="sticky top-0 z-40 border-b border-black/[0.05] bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white shadow-xs">
              <SmartphoneIcon size={16} />
            </div>
            <span className="text-sm font-semibold tracking-tight text-slate-900">
              PWA Modal Installer
            </span>
            <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-[10px] font-medium text-slate-600">
              Apple Style
            </span>
          </div>

          <a
            href="https://github.com/JefersonMarcioEspindola/pwa-modal-installer"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-black/[0.03] px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-black/[0.07]"
          >
            <GithubIcon size={13} />
            <span>GitHub</span>
          </a>
        </div>
      </header>

      {/* Seção Hero Clean */}
      <div className="mx-auto max-w-4xl px-4 pt-16 pb-12 text-center sm:pt-24 sm:pb-16">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/80 px-3.5 py-1 text-xs font-medium text-slate-600 shadow-xs backdrop-blur-md">
          <span>Desenvolvido para gerar confiança e alta conversão</span>
        </div>

        <h1 className="mx-auto max-w-2xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl sm:leading-[1.1]">
          O modal de PWA que parece nativo da Apple.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
          A ideia não é ser invasivo. É parecer uma extensão do próprio iOS na tela,
          com efeito de vidro Liquid Glass, transição em acordeão e sem atrito para o usuário.
        </p>

        {/* Botões de Demonstração Interativa (Pills translúcidas no estilo Liquid Glass claro) */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setActivePlatform("ios");
              setIsAccordionOpenPreview(false);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/90 px-5 py-3 text-sm font-medium text-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all duration-150 hover:bg-white hover:shadow-[0_8px_25px_rgba(0,0,0,0.07)] active:scale-[0.98]"
          >
            <span>📱 Simular iPhone (iOS Safari)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActivePlatform("android");
              setIsAccordionOpenPreview(false);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/90 px-5 py-3 text-sm font-medium text-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all duration-150 hover:bg-white hover:shadow-[0_8px_25px_rgba(0,0,0,0.07)] active:scale-[0.98]"
          >
            <span>🤖 Simular Android (Google Chrome)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActivePlatform("desktop");
              setIsAccordionOpenPreview(false);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/90 px-5 py-3 text-sm font-medium text-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all duration-150 hover:bg-white hover:shadow-[0_8px_25px_rgba(0,0,0,0.07)] active:scale-[0.98]"
          >
            <span>💻 Simular Desktop (QR Code)</span>
          </button>
        </div>
      </div>

      {/* Cartões Clean (Imitação de Liquid Glass Claro) */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-black/[0.06] bg-white/60 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] backdrop-blur-xl">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <SmartphoneIcon size={18} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              Confiança Imediata
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Não parece um banner intrusivo da web. Reproduz fielmente a estética do iOS com folha inferior e ícones do sistema.
            </p>
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-white/60 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] backdrop-blur-xl">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <ShieldCheckIcon size={18} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              Zero Login Duplicado
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              No iOS os cookies da web instalada são isolados. Ao conduzir para o PWA antes da autenticação, o login é feito uma única vez.
            </p>
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-white/60 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] backdrop-blur-xl">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <QrCodeIcon size={18} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              QR Code Autocontido
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Gera QR Code vetorial em SVG de 15 KB sem bibliotecas externas pesadas, com link de transição suave para celular.
            </p>
          </div>
        </div>
      </div>

      {/* Bloco de Código Clean */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-3xl border border-black/[0.06] bg-white/70 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.03)] backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <TerminalIcon size={14} className="text-slate-600" />
              <span>Como usar no Next.js (App Router)</span>
            </div>

            <button
              type="button"
              onClick={() => copyToClipboard(usageSnippet, "code")}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-50"
            >
              {copiedCode === "code" ? <CheckIcon size={12} className="text-emerald-600" /> : <CopyIcon size={12} />}
              <span>{copiedCode === "code" ? "Copiado!" : "Copiar"}</span>
            </button>
          </div>

          <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs font-mono text-slate-200 leading-relaxed">
            <code>{usageSnippet}</code>
          </pre>
        </div>
      </div>

      {/* Rodapé Minimalista */}
      <footer className="mt-16 border-t border-black/[0.05] py-8 text-center text-xs text-slate-400">
        <p>PWA Modal Installer · Código aberto sob licença MIT.</p>
        <p className="mt-1">Inspirado nos padrões de design e acabamento da Apple.</p>
      </footer>

      {/* Modal Interativo de Demonstração */}
      {activePlatform && (
        <PwaInstallModal
          appName="Meu Aplicativo"
          appSubtitle="Aplicativo Oficial"
          forcePlatform={activePlatform}
          forceOpen={true}
          initialAccordionOpen={isAccordionOpenPreview}
          onClose={() => {
            setActivePlatform(null);
            setIsAccordionOpenPreview(false);
          }}
        />
      )}
    </main>
  );
}
