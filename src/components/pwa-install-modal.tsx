"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  Check,
  Copy,
  Download,
  Smartphone,
  X,
} from "lucide-react";
import {
  detectBrowser,
  detectPlatform,
  getNetworkInstallUrl,
  isPwaTriggerUrl,
  PWA_STORAGE_KEY,
  type BrowserKind,
  type DevicePlatform,
} from "../lib/pwa";
import { generateQrSvg } from "../lib/qr";

/* ==========================================================================
   ÍCONES VETORIAIS NATIVOS DA APPLE (OFICIAIS)
   Idênticos ao Safari / iOS nativo (Share Sheet, Add to Home, View More, Dots, Back).
   ========================================================================== */

export function AppleShareIcon({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={(size * 26.475) / 17.695}
      viewBox="0 0 17.695 26.475"
      className={className}
      aria-hidden="true"
    >
      <g fill="currentColor">
        <path d="M17.334 10.762v9.746c0 2.012-1.025 3.027-3.066 3.027H3.066C1.026 23.535 0 22.52 0 20.508v-9.746C0 8.75 1.025 7.734 3.066 7.734h2.94v1.573h-2.92c-.977 0-1.514.527-1.514 1.543v9.57c0 1.015.537 1.543 1.514 1.543h11.152c.967 0 1.524-.527 1.524-1.543v-9.57c0-1.016-.557-1.543-1.524-1.543h-2.91V7.734h2.94c2.04 0 3.066 1.016 3.066 3.028Z" />
        <path d="M8.662 15.889c.42 0 .781-.352.781-.762V5.097l-.058-1.464.654.693 1.484 1.582a.698.698 0 0 0 .528.235c.4 0 .713-.293.713-.694 0-.205-.088-.361-.235-.508l-3.3-3.183c-.196-.196-.362-.264-.567-.264-.195 0-.361.069-.566.264L4.795 4.94a.681.681 0 0 0-.225.508c0 .4.293.694.703.694.186 0 .4-.079.538-.235l1.474-1.582.664-.693-.058 1.465v10.029c0 .41.351.762.771.762Z" />
      </g>
    </svg>
  );
}

export function AppleAddIcon({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 25 25"
      className={className}
      aria-hidden="true"
    >
      <g fill="currentColor">
        <path d="m23.40492,1.60784c-1.32504,-1.32504 -3.19052,-1.56912 -5.59644,-1.56912l-10.65243,0c-2.33622,0 -4.2017,0.24408 -5.5267,1.56912c-1.32504,1.34243 -1.56911,3.17306 -1.56911,5.50924l0,10.5827c0,2.40596 0.22665,4.254 1.55165,5.57902c1.34246,1.32501 3.19052,1.5691 5.59647,1.5691l10.60013,0c2.40592,0 4.2714,-0.24408 5.59644,-1.5691c1.325,-1.34245 1.55166,-3.17306 1.55166,-5.57902l0,-10.51293c0,-2.40596 -0.22666,-4.25401 -1.55166,-5.57901zm-0.38355,5.21289l0,11.24518c0,1.51681 -0.20924,2.94643 -1.02865,3.78327c-0.83683,0.83685 -2.30134,1.0635 -3.81815,1.0635l-11.33234,0c-1.51681,0 -2.96386,-0.22665 -3.80073,-1.0635c-0.83683,-0.83684 -1.04607,-2.26646 -1.04607,-3.78327l0,-11.19288c0,-1.5517 0.20924,-3.01617 1.02865,-3.85304c0.83687,-0.83683 2.31876,-1.04607 3.87042,-1.04607l11.28007,0c1.51681,0 2.98132,0.22666 3.81815,1.06353c0.81941,0.81941 1.02865,2.26645 1.02865,3.78327zm-10.53039,12.08205c0.64506,0 1.02861,-0.43586 1.02861,-1.13326l0,-4.34117l4.53294,0c0.66252,0 1.13326,-0.36613 1.13326,-0.99376c0,-0.64506 -0.43586,-1.02861 -1.13326,-1.02861l-4.53294,0l0,-4.53294c0,-0.6974 -0.38355,-1.13326 -1.02861,-1.13326c-0.62763,0 -0.99376,0.45332 -0.99376,1.13326l0,4.53294l-4.51552,0c-0.69737,0 -1.15069,0.38355 -1.15069,1.02861c0,0.62763 0.48817,0.99376 1.15069,0.99376l4.51552,0l0,4.34117c0,0.66252 0.36613,1.13326 0.99376,1.13326z" />
      </g>
    </svg>
  );
}

export function AppleChevronIcon({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={(size * 10.395) / 16.961}
      viewBox="0 0 16.961 10.395"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M8.485 10.395a.87.87 0 0 0 .657-.286l7.556-7.735a.88.88 0 0 0 .263-.628c0-.507-.381-.899-.889-.899a.97.97 0 0 0-.64.26L7.958 8.74h1.045L1.527 1.106A.92.92 0 0 0 .899.847c-.51 0-.899.392-.899.9 0 .25.102.464.265.63L7.83 10.11q.268.284.655.284"
      />
    </svg>
  );
}

export function AppleDotsIcon({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <circle cx="5" cy="12" r="2.2" fill="currentColor" />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      <circle cx="19" cy="12" r="2.2" fill="currentColor" />
    </svg>
  );
}

export function AppleBackIcon({ className, size = 13 }: { className?: string; size?: number }) {
  return (
    <svg
      width={(size * 12.038) / 16.957}
      height={size}
      viewBox="0 0 12.038 16.957"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M0 8.472c0 .245.1.46.278.647l7.739 7.564c.163.174.39.261.64.261.505 0 .889-.379.889-.889a.91.91 0 0 0-.26-.636L2.19 8.472l7.097-6.947a.93.93 0 0 0 .259-.636.87.87 0 0 0-.89-.889.86.86 0 0 0-.64.261L.279 7.826A.92.92 0 0 0 0 8.472"
      />
    </svg>
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;

export interface PwaInstallModalProps {
  appName?: string;
  appSubtitle?: string;
  appDescription?: string;
  appIcon?: ReactNode;
  forcePlatform?: DevicePlatform;
  forceOpen?: boolean;
  initialAccordionOpen?: boolean;
  onClose?: () => void;
  storageKey?: string;
  desktopLanIp?: string;
  showQrOnDesktop?: boolean;
  customInstallUrl?: string;
}

export function PwaInstallModal({
  appName = "Web Application",
  appSubtitle = "Installation component",
  appDescription = "Este site possui funcionalidade de aplicativo. Adicione à Tela de Início para uma melhor experiência e fácil acesso.",
  appIcon,
  forcePlatform,
  forceOpen,
  initialAccordionOpen = false,
  onClose,
  storageKey = PWA_STORAGE_KEY,
  desktopLanIp = "192.168.15.5",
  showQrOnDesktop = true,
  customInstallUrl,
}: PwaInstallModalProps) {
  const [platform, setPlatform] = useState<DevicePlatform>("desktop");
  const [browser, setBrowser] = useState<BrowserKind>("other");
  const [isOpen, setIsOpen] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(initialAccordionOpen);
  const [installedSuccess, setInstalledSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [hostOrigin, setHostOrigin] = useState("");

  // Captura o evento nativo beforeinstallprompt do Android/Chromium
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      globalDeferredPrompt = e as BeforeInstallPromptEvent;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  // Detecção de ambiente no cliente
  useEffect(() => {
    const ua = navigator.userAgent || "";
    const touchPoints = navigator.maxTouchPoints || 0;
    const detectedPlat = forcePlatform || detectPlatform(ua, touchPoints);
    const detectedBrowser = detectBrowser(ua);

    setPlatform(detectedPlat);
    setBrowser(detectedBrowser);
    setHostOrigin(window.location.origin);

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;

    const isDismissed = localStorage.getItem(storageKey) === "true";
    const hasTriggerParam = isPwaTriggerUrl(window.location.search);

    if (forceOpen !== undefined) {
      setIsOpen(forceOpen);
    } else if (!isStandalone) {
      if (hasTriggerParam) {
        setIsOpen(true);
      } else if (!isDismissed && (detectedPlat === "ios" || detectedPlat === "android")) {
        setIsOpen(true);
      }
    }
  }, [forcePlatform, forceOpen, storageKey]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsAccordionOpen(false);
    try {
      localStorage.setItem(storageKey, "true");
    } catch {
      // Modo anônimo / restrições
    }
    if (onClose) onClose();
  }, [onClose, storageKey]);

  const handleNativeInstall = async () => {
    if (globalDeferredPrompt) {
      try {
        await globalDeferredPrompt.prompt();
        const choice = await globalDeferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          setInstalledSuccess(true);
          setTimeout(() => {
            handleClose();
          }, 1800);
        }
      } catch (err) {
        console.error("Falha ao abrir diálogo nativo:", err);
      }
    } else {
      setIsAccordionOpen(true);
    }
  };

  const qrUrl = customInstallUrl || getNetworkInstallUrl(hostOrigin, desktopLanIp);
  const qrSvg = generateQrSvg(qrUrl, 160);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Silencioso
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Instalar aplicativo ${appName}`}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs p-3 transition-opacity duration-200 sm:items-center sm:p-4"
    >
      {/* Backdrop com fechamento ao clicar fora */}
      <div
        className="absolute inset-0 -z-10"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Cartão Apple Liquid Glass autêntico */}
      <div
        className="relative w-full max-w-[420px] overflow-hidden rounded-[28px] border border-white/15 bg-[#1e202e]/85 p-5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.22)] backdrop-blur-[32px] transition-all duration-300 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]"
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {appIcon ? (
              appIcon
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-gradient-to-tr from-sky-400 to-blue-600 text-white shadow-md">
                <Smartphone size={24} />
              </div>
            )}
            <div className="min-w-0">
              <h2 className="truncate text-[16px] font-semibold tracking-tight text-white">
                {appName}
              </h2>
              <p className="truncate text-xs text-white/50">
                {appSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Fechar instalador"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="my-4 h-px bg-white/10" />

        {/* ====================================================================
            FLUXO IOS / APPLE (Liquid Glass Fiel ao Design Nativo da Apple)
            ==================================================================== */}
        {platform === "ios" && (
          <div>
            <p className="text-[13px] leading-relaxed text-white/80">
              {appDescription}
            </p>

            {/* Acordeão com transição fluida de altura via CSS Grid */}
            <div
              className="grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{
                gridTemplateRows: isAccordionOpen ? "1fr" : "0fr",
              }}
            >
              <div className="overflow-hidden">
                <div className="pt-4 space-y-3.5">
                  {/* Passo 1 */}
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white shadow-inner">
                      <AppleDotsIcon size={20} />
                    </div>
                    <p className="text-[13px] font-medium text-white/90">
                      Toque no menu se não vir o Compartilhar
                    </p>
                  </div>

                  {/* Passo 2 */}
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white shadow-inner">
                      <AppleShareIcon size={19} />
                    </div>
                    <p className="text-[13px] font-medium text-white/90">
                      Toque em Compartilhar na barra de navegação
                    </p>
                  </div>

                  {/* Passo 3 */}
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white shadow-inner">
                      <AppleChevronIcon size={16} />
                    </div>
                    <p className="text-[13px] font-medium text-white/90">
                      Role e toque em &quot;Ver mais&quot;
                    </p>
                  </div>

                  {/* Passo 4 */}
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white shadow-inner">
                      <AppleAddIcon size={19} />
                    </div>
                    <p className="text-[13px] font-medium text-white/90">
                      Toque em &quot;Adicionar à Tela de Início&quot;
                    </p>
                  </div>

                  {/* Botão Voltar Apple nativo */}
                  <button
                    type="button"
                    onClick={() => setIsAccordionOpen(false)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/5 bg-white/[0.08] py-3 text-[14px] font-medium text-white transition-colors hover:bg-white/[0.12] active:bg-white/[0.16]"
                  >
                    <AppleBackIcon size={11} />
                    <span>Voltar</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Botão Inset Grouped Action Sheet oficial da Apple */}
            {!isAccordionOpen && (
              <div className="mt-5 overflow-hidden rounded-[18px] border border-white/5 bg-white/[0.08] backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setIsAccordionOpen(true)}
                  className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left text-[15px] font-medium text-white transition-colors hover:bg-white/[0.06] active:bg-white/[0.12]"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center text-white">
                    <AppleAddIcon size={20} />
                  </div>
                  <span>Adicionar à Tela de Início</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ====================================================================
            FLUXO ANDROID / CHROMIUM
            ==================================================================== */}
        {platform === "android" && (
          <div>
            <p className="text-[13px] leading-relaxed text-white/80">
              {appDescription}
            </p>

            {installedSuccess ? (
              <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-white/10 p-3.5 text-xs font-medium text-white">
                <Check size={16} />
                <span>Aplicativo instalado com sucesso!</span>
              </div>
            ) : (
              <div className="mt-5 overflow-hidden rounded-[18px] border border-white/5 bg-white/[0.08] backdrop-blur-md">
                <button
                  type="button"
                  onClick={handleNativeInstall}
                  className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left text-[15px] font-medium text-white transition-colors hover:bg-white/[0.06] active:bg-white/[0.12]"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center text-white">
                    <Download size={20} />
                  </div>
                  <span>Instalar aplicativo</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ====================================================================
            FLUXO DESKTOP (Centralizado com QR Code)
            ==================================================================== */}
        {platform === "desktop" && (
          <div>
            <p className="text-[13px] leading-relaxed text-white/80">
              Aponte a câmera do seu smartphone (iPhone ou Android) para o QR Code abaixo para abrir e instalar na tela inicial do celular.
            </p>

            {showQrOnDesktop && (
              <div className="my-5 flex flex-col items-center justify-center">
                <div
                  className="rounded-2xl bg-white p-3 shadow-lg"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="mt-3.5 inline-flex items-center gap-1.5 rounded-full border border-white/5 bg-white/10 px-3.5 py-1.5 text-[11px] font-medium text-white/80 transition-colors hover:bg-white/20"
                >
                  {copiedLink ? <Check size={12} className="text-white" /> : <Copy size={12} />}
                  <span>{copiedLink ? "Link copiado!" : "Copiar link de instalação"}</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="mt-2 flex w-full items-center justify-center rounded-2xl border border-white/5 bg-white/[0.08] py-3 text-[14px] font-medium text-white transition-colors hover:bg-white/[0.12] active:bg-white/[0.16]"
            >
              <span>Continuar no computador</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
