/**
 * Utilitários para detecção de plataforma, navegador e avaliação do ciclo
 * de exibição do modal de instalação de Progressive Web App (PWA).
 */

export type DevicePlatform = "ios" | "android" | "desktop";
export type BrowserKind = "safari" | "chrome" | "samsung" | "firefox" | "edge" | "other";

export const DEFAULT_DEV_LAN_IP = "192.168.15.5";
export const PWA_STORAGE_KEY = "pwa_modal_dismissed";

/**
 * Detecta se o dispositivo é iOS, Android ou Desktop.
 * Trata casos especiais como iPadOS moderno (que se identifica como Macintosh com touch).
 */
export function detectPlatform(userAgent?: string, maxTouchPoints = 0): DevicePlatform {
  if (!userAgent) return "desktop";
  const ua = userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(ua)) {
    return "ios";
  }

  // iPadOS no Safari 13+ envia Macintosh no userAgent mas possui touch
  if (ua.includes("macintosh") && maxTouchPoints > 1) {
    return "ios";
  }

  if (/android/.test(ua)) {
    return "android";
  }

  return "desktop";
}

/**
 * Detecta o navegador utilizado para direcionar as instruções corretas.
 */
export function detectBrowser(userAgent?: string): BrowserKind {
  if (!userAgent) return "other";
  const ua = userAgent.toLowerCase();

  if (/edg\//.test(ua)) return "edge";
  if (/samsungbrowser/.test(ua)) return "samsung";
  if (/firefox|fxios/.test(ua)) return "firefox";
  if (/crios|chrome/.test(ua)) return "chrome";
  if (/safari/.test(ua) && !/chrome|crios/.test(ua)) return "safari";

  return "other";
}

export function isAppleDevice(platform: DevicePlatform): boolean {
  return platform === "ios";
}

/**
 * Verifica se a URL atual contém gatilhos diretos para abertura do modal.
 */
export function isPwaTriggerUrl(search: string): boolean {
  if (!search) return false;
  const s = search.toLowerCase();
  return (
    s.includes("pwa=1") ||
    s.includes("pwa_install=1") ||
    s.includes("utm_source=pwa_installer")
  );
}

/**
 * Monta URL com trigger de instalação e suporte a IP de rede local para testes via celular.
 */
export function getNetworkInstallUrl(origin: string, lanIp = DEFAULT_DEV_LAN_IP): string {
  if (!origin) return `http://${lanIp}:3000/?pwa=1`;
  const isLocal = origin.includes("localhost") || origin.includes("127.0.0.1");
  const base = isLocal ? `http://${lanIp}:3000` : origin;
  return `${base}/?pwa=1&utm_source=pwa_installer`;
}

export type PwaTriggerSource =
  | "url_trigger"
  | "post_auth"
  | "user_action"
  | "banner_click";

export interface PwaDisplayEvaluation {
  shouldDisplay: boolean;
  reason: string;
  autoOpenModal: boolean;
}

export interface PwaContextState {
  isStandalone: boolean;
  isDismissed: boolean;
  platform: DevicePlatform;
  searchParams?: string;
  source?: PwaTriggerSource;
  isPostAuth?: boolean;
}

/**
 * Avalia se o modal deve ser exibido com base no contexto do usuário.
 *
 * 1. Standalone (já instalado): NUNCA exibe nada.
 * 2. Ação direta do usuário (clique em botão): SEMPRE exibe.
 * 3. Gatilho via URL (?pwa=1): SEMPRE exibe (útil para QR Code e onboarding).
 * 4. Dispensado anteriormente: não reabre de forma invasiva.
 * 5. Primeiro acesso mobile pós-autenticação: recomenda instalação.
 */
export function evaluatePwaDisplay(ctx: PwaContextState): PwaDisplayEvaluation {
  if (ctx.isStandalone) {
    return {
      shouldDisplay: false,
      reason: "already_installed",
      autoOpenModal: false,
    };
  }

  if (ctx.source === "user_action" || ctx.source === "banner_click") {
    return {
      shouldDisplay: true,
      reason: "user_intent",
      autoOpenModal: true,
    };
  }

  if (ctx.searchParams && isPwaTriggerUrl(ctx.searchParams)) {
    return {
      shouldDisplay: true,
      reason: "url_trigger",
      autoOpenModal: true,
    };
  }

  if (ctx.isDismissed) {
    return {
      shouldDisplay: false,
      reason: "previously_dismissed",
      autoOpenModal: false,
    };
  }

  if (ctx.isPostAuth && (ctx.platform === "ios" || ctx.platform === "android")) {
    return {
      shouldDisplay: true,
      reason: "first_mobile_session",
      autoOpenModal: true,
    };
  }

  return {
    shouldDisplay: false,
    reason: "no_active_trigger",
    autoOpenModal: false,
  };
}
