"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  AppleAddIcon,
  AppleBackIcon,
  AppleChevronIcon,
  AppleDotsIcon,
  AppleShareIcon,
  CheckIcon,
  CloseIcon,
  CopyIcon,
  DownloadIcon,
  SmartphoneIcon,
} from "./icons";
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
                <SmartphoneIcon size={24} />
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
            <CloseIcon size={16} />
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
                  className="flex w-full items-center justify-center gap-2.5 px-4 py-3.5 text-center text-[15px] font-medium text-white transition-colors hover:bg-white/[0.06] active:bg-white/[0.12]"
                >
                  <AppleAddIcon size={20} />
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
                <CheckIcon size={16} />
                <span>Aplicativo instalado com sucesso!</span>
              </div>
            ) : (
              <div className="mt-5 overflow-hidden rounded-[18px] border border-white/5 bg-white/[0.08] backdrop-blur-md">
                <button
                  type="button"
                  onClick={handleNativeInstall}
                  className="flex w-full items-center justify-center gap-2.5 px-4 py-3.5 text-center text-[15px] font-medium text-white transition-colors hover:bg-white/[0.06] active:bg-white/[0.12]"
                >
                  <DownloadIcon size={20} />
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
                  {copiedLink ? <CheckIcon size={12} className="text-white" /> : <CopyIcon size={12} />}
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
