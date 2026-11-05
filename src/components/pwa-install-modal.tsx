"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  Bell,
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
   ÍCONES VETORIAIS NATIVOS DA APPLE
   Idênticos ao Safari / iOS nativo (Share Sheet, Add to Home, View More, Dots).
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

export function AppleSafariIcon({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={(size * 19.932) / 20.283}
      viewBox="0 0 20.283 19.932"
      className={className}
      aria-hidden="true"
    >
      <g fill="currentColor">
        <path d="M9.96 19.922c5.45 0 9.962-4.522 9.962-9.961C19.922 4.51 15.4 0 9.952 0 4.511 0 0 4.512 0 9.96c0 5.44 4.521 9.962 9.96 9.962m0-1.66A8.26 8.26 0 0 1 1.67 9.96c0-4.61 3.672-8.3 8.281-8.3 4.61 0 8.31 3.69 8.31 8.3s-3.69 8.3-8.3 8.3Z" />
        <path d="m5.87 14.883 5.605-2.735a1.47 1.47 0 0 0 .683-.673l2.725-5.596c.312-.664-.166-1.182-.85-.84L8.447 7.764c-.302.136-.508.341-.674.673L5.03 14.043c-.312.645.196 1.152.84.84m4.09-3.72A1.19 1.19 0 0 1 8.77 9.97c0-.664.527-1.201 1.19-1.201a1.2 1.2 0 0 1 1.202 1.2c0 .655-.537 1.192-1.201 1.192Z" />
      </g>
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
  accentColor?: string;
  forcePlatform?: DevicePlatform;
  forceOpen?: boolean;
  onClose?: () => void;
  storageKey?: string;
  desktopLanIp?: string;
  showQrOnDesktop?: boolean;
  customInstallUrl?: string;
}

export function PwaInstallModal({
  appName = "App Web",
  appSubtitle = "Aplicativo Oficial",
  appDescription = "Este site possui funcionalidade de aplicativo. Adicione à Tela de Início para uma melhor experiência, tela cheia sem barras e notificações.",
  appIcon,
  accentColor = "#2563eb",
  forcePlatform,
  forceOpen,
  onClose,
  storageKey = PWA_STORAGE_KEY,
  desktopLanIp = "192.168.15.5",
  showQrOnDesktop = true,
  customInstallUrl,
}: PwaInstallModalProps) {
  const [platform, setPlatform] = useState<DevicePlatform>("desktop");
  const [browser, setBrowser] = useState<BrowserKind>("other");
  const [isOpen, setIsOpen] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [canInstallNatively, setCanInstallNatively] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [hostOrigin, setHostOrigin] = useState("");
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | "unsupported"
  >("unsupported");

  // Listener para capturar o evento nativo beforeinstallprompt do Android/Chromium
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      globalDeferredPrompt = e as BeforeInstallPromptEvent;
      setCanInstallNatively(true);
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

    if (typeof Notification !== "undefined") {
      setNotificationPermission(Notification.permission);
    }

    const isDismissed = localStorage.getItem(storageKey) === "true";
    const hasTriggerParam = isPwaTriggerUrl(window.location.search);

    // Avalia abertura inicial
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
      // Ignora restrições de localStorage em modo anônimo
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
      // Se não houver prompt nativo pronto, abre acordeão com instruções manuais
      setIsAccordionOpen(true);
    }
  };

  const handleRequestNotification = async () => {
    if (typeof Notification === "undefined") return;
    try {
      const res = await Notification.requestPermission();
      setNotificationPermission(res);
    } catch (err) {
      console.error("Erro ao solicitar permissão de notificação:", err);
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
      // Falha silenciosa
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

      {/* Cartão estilo Liquid Glass */}
      <div
        className="relative w-full max-w-[430px] overflow-hidden rounded-[26px] border border-white/10 bg-[#1c1e2a]/85 p-5 text-white shadow-[0_16px_48px_-8px_rgba(0,0,0,0.65),inset_0_1px_1px_0_rgba(255,255,255,0.22)] backdrop-blur-[28px] transition-all duration-300 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]"
      >
        {/* Cabeçalho do App */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {appIcon ? (
              appIcon
            ) : (
              <div
                style={{ backgroundColor: accentColor }}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] text-white shadow-md shadow-blue-500/20"
              >
                <Smartphone size={24} />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-base font-semibold tracking-tight text-white">
                  {appName}
                </h2>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-white/70">
                  {appSubtitle}
                </span>
              </div>
              <p className="truncate text-xs text-white/50">
                {hostOrigin ? hostOrigin.replace(/^https?:\/\//, "") : "app web"}
              </p>
            </div>
          </div>

          {/* Botão Fechar discreto */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Fechar instalador"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="my-3.5 h-px bg-white/10" />

        {/* ====================================================================
            FLUXO IOS / APPLE (Liquid Glass Accordion)
            ==================================================================== */}
        {platform === "ios" && (
          <div>
            <p className="text-xs leading-relaxed text-white/80">
              {appDescription}
            </p>

            {/* Acordeão Apple com transição fluida de altura via CSS Grid */}
            <div
              className="grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{
                gridTemplateRows: isAccordionOpen ? "1fr" : "0fr",
              }}
            >
              <div className="overflow-hidden">
                <div className="mt-3.5 space-y-2 border-t border-white/10 pt-3">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-white/60">
                    <span>Instruções no Safari iOS</span>
                    <button
                      type="button"
                      onClick={() => setIsAccordionOpen(false)}
                      className="inline-flex items-center gap-1 text-xs font-semibold normal-case text-blue-400 hover:text-blue-300"
                    >
                      <AppleBackIcon size={11} />
                      <span>Voltar</span>
                    </button>
                  </div>

                  <div className="space-y-2 pt-1">
                    {/* Passo 1: Menu de 3 pontos para navegadores terceiros */}
                    <div className="flex items-center gap-3 rounded-xl bg-white/5 p-2.5 transition-colors">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                        <AppleDotsIcon size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-white">
                          1. Toque no menu se não vir o Compartilhar
                        </p>
                        <p className="text-[11px] text-white/50">
                          No Chrome, Edge ou redes sociais toque nos três pontinhos.
                        </p>
                      </div>
                    </div>

                    {/* Passo 2: Compartilhar */}
                    <div className="flex items-center gap-3 rounded-xl bg-white/5 p-2.5 transition-colors">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                        <AppleShareIcon size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-white">
                          2. Toque em Compartilhar
                        </p>
                        <p className="text-[11px] text-white/50">
                          Na barra inferior do Safari ou no menu aberto.
                        </p>
                      </div>
                    </div>

                    {/* Passo 3: Rolar opções */}
                    <div className="flex items-center gap-3 rounded-xl bg-white/5 p-2.5 transition-colors">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                        <AppleChevronIcon size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-white">
                          3. Role para baixo na folha de opções
                        </p>
                        <p className="text-[11px] text-white/50">
                          Role as ações do sistema até localizar a opção abaixo.
                        </p>
                      </div>
                    </div>

                    {/* Passo 4: Adicionar à Tela de Início */}
                    <div className="flex items-center gap-3 rounded-xl bg-white/5 p-2.5 transition-colors">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                        <AppleAddIcon size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-white">
                          4. Adicionar à Tela de Início
                        </p>
                        <p className="text-[11px] text-white/50">
                          Toque e depois confirme em &quot;Adicionar&quot; no canto superior direito.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Botões de Ação do Acordeão Aberto */}
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-500/90 py-2.5 text-xs font-semibold text-white transition-transform active:scale-[0.98]"
                    >
                      <Check size={14} />
                      <span>Já adicionei à tela</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-medium text-white/70 hover:bg-white/15"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Botão Primário quando o Acordeão está fechado */}
            {!isAccordionOpen && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setIsAccordionOpen(true)}
                  style={{ backgroundColor: accentColor }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-transform active:scale-[0.98]"
                >
                  <span>Adicionar à Tela de Início</span>
                  <AppleAddIcon size={16} />
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
            <p className="text-xs leading-relaxed text-white/80">
              {appDescription}
            </p>

            {installedSuccess ? (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/20 p-3 text-xs font-medium text-emerald-300">
                <Check size={16} />
                <span>Aplicativo instalado com sucesso!</span>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={handleNativeInstall}
                  style={{ backgroundColor: accentColor }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-transform active:scale-[0.98]"
                >
                  <Download size={16} />
                  <span>Instalar aplicativo</span>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium">
                    1 toque
                  </span>
                </button>

                {/* Alternativa se o navegador não emitir beforeinstallprompt */}
                {isAccordionOpen && (
                  <div className="mt-3 space-y-2 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/70">
                    <p className="font-semibold text-white">Instalação manual no Chrome:</p>
                    <ol className="list-decimal space-y-1 pl-4 text-[11px]">
                      <li>Toque no menu de três pontos verticais (⋮) no canto superior direito.</li>
                      <li>Toque na opção &quot;Instalar aplicativo&quot; ou &quot;Adicionar à tela inicial&quot;.</li>
                      <li>Confirme em &quot;Instalar&quot;.</li>
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ====================================================================
            FLUXO DESKTOP (Centralizado com QR Code)
            ==================================================================== */}
        {platform === "desktop" && (
          <div>
            <p className="text-xs leading-relaxed text-white/80">
              Aponte a câmera do seu smartphone (iPhone ou Android) para o QR Code abaixo para abrir e instalar o aplicativo na tela inicial do celular.
            </p>

            {showQrOnDesktop && (
              <div className="my-4 flex flex-col items-center justify-center">
                <div
                  className="rounded-2xl bg-white p-3 shadow-lg"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white/80 hover:bg-white/20"
                  >
                    {copiedLink ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedLink ? "Link copiado!" : "Copiar link de instalação"}</span>
                  </button>
                </div>
              </div>
            )}

            <div className="rounded-xl bg-white/5 p-2.5 text-center text-[11px] text-white/60">
              No iPhone abra com o Safari; no Android utilize o Google Chrome.
            </div>

            <div className="mt-3">
              <button
                type="button"
                onClick={handleClose}
                className="w-full rounded-xl bg-white/10 py-2.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/20"
              >
                Continuar no navegador do computador
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
