"use client";

import { useEffect, useState } from "react";
import {
  Smartphone,
  Check,
  Copy,
  ExternalLink,
  QrCode,
  ShieldCheck,
  Sliders,
  Terminal,
} from "lucide-react";
import { PwaInstallModal } from "../components/pwa-install-modal";
import type { DevicePlatform } from "../lib/pwa";

function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function Home() {
  const [activePlatform, setActivePlatform] = useState<DevicePlatform | null>(null);
  const [isAccordionOpenPreview, setIsAccordionOpenPreview] = useState(false);
  const [appName, setAppName] = useState("Meu Aplicativo");
  const [appSubtitle, setAppSubtitle] = useState("App Web");
  const [accentColor, setAccentColor] = useState("#2563eb");
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
          appSubtitle="App Web"
          accentColor="#2563eb"
        />
      </body>
    </html>
  );
}`;

  return (
    <main className="min-h-screen bg-[#0b0c10] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Banner & Header */}
      <header className="border-b border-white/10 bg-[#12141c]/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Smartphone size={20} />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
                PWA Modal Installer
                <span className="text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                  v1.0.0
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Liquid Glass PWA install prompt para Next.js e React
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/JefersonMarcioEspindola/pwa-modal-installer"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-medium px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors"
            >
              <GithubIcon size={14} />
              <span>Ver no GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 pt-12 pb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400 mb-6">
          <Smartphone size={14} />
          <span>Experiência nativa no Safari iOS e Chrome Android</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight sm:leading-tight">
          O modal de instalação de PWA que se adapta como app nativo.
        </h2>

        <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Estilo Apple Liquid Glass com efeito de vidro translúcido, transição em acordeão via CSS Grid,
          vetores oficiais da Apple para o Safari no iOS, instalação em 1 toque no Android e QR Code desktop.
        </p>

        {/* Live Simulator Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setActivePlatform("ios")}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm shadow-lg shadow-blue-500/20 transition-transform active:scale-[0.98]"
          >
            <span>📱 Testar visual no iPhone (iOS Safari)</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePlatform("android")}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm border border-white/10 transition-transform active:scale-[0.98]"
          >
            <span>🤖 Testar visual no Android (Google Chrome)</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePlatform("desktop")}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm border border-white/10 transition-transform active:scale-[0.98]"
          >
            <span>💻 Testar visual no Desktop (QR Code)</span>
          </button>
        </div>
      </div>

      {/* Customizer Panel */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="rounded-2xl border border-white/10 bg-[#141622]/80 p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            <Sliders size={14} className="text-blue-400" />
            <span>Personalização ao vivo</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Nome do Aplicativo
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/40 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Subtítulo / Categoria
              </label>
              <input
                type="text"
                value={appSubtitle}
                onChange={(e) => setAppSubtitle(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/40 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Cor de Destaque (Accent)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded border border-white/10 bg-transparent p-0"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white uppercase focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          Por que este componente resolve os maiores desafios de PWA?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="h-8 w-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
              <Smartphone size={18} />
            </div>
            <h4 className="text-sm font-semibold text-white">Apple Safari sem API nativa</h4>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              O Safari não suporta <code className="text-blue-300">beforeinstallprompt</code>. O modal guia o usuário
              com ícones vetoriais idênticos ao iOS, reduzindo o atrito para adicionar à tela inicial.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
              <ShieldCheck size={18} />
            </div>
            <h4 className="text-sm font-semibold text-white">Solução para Isolamento de Sessão</h4>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              No iOS, a sessão do navegador não é compartilhada com o app instalado. Ao levar o usuário para instalar
              antes de logar (<code className="text-indigo-300">/login?pwa=1</code>), ele só faz login uma vez.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="h-8 w-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
              <QrCode size={18} />
            </div>
            <h4 className="text-sm font-semibold text-white">QR Code Desktop Zero-Dependency</h4>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              Gerador de QR Code vetorial (SVG) autocontido e ultra-leve sem bibliotecas externas pesadas, com detecção
              automática de IP da rede local para testes pelo Wi-Fi.
            </p>
          </div>
        </div>
      </div>

      {/* Code Snippet Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-blue-400" />
            <h3 className="text-sm font-semibold text-white">
              Como adicionar no seu projeto Next.js (App Router)
            </h3>
          </div>

          <button
            type="button"
            onClick={() => copyToClipboard(usageSnippet, "usage")}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg transition-colors"
          >
            {copiedCode === "usage" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copiedCode === "usage" ? "Copiado!" : "Copiar código"}</span>
          </button>
        </div>

        <pre className="overflow-x-auto rounded-xl border border-white/10 bg-[#0d0f17] p-4 text-xs font-mono text-slate-300 leading-relaxed">
          <code>{usageSnippet}</code>
        </pre>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16 py-8 text-center text-xs text-slate-500">
        <p>PWA Modal Installer · Código aberto sob licença MIT.</p>
        <p className="mt-1">Compatível com React 19, Next.js 15 e Tailwind CSS.</p>
      </footer>

      {/* Modal Interativo de Demonstração */}
      {activePlatform && (
        <PwaInstallModal
          appName={appName}
          appSubtitle={appSubtitle}
          accentColor={accentColor}
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
