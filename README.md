# PWA Modal Installer

> Componente de instalação de Progressive Web App (PWA) no estilo Apple Liquid Glass para Next.js e React. Conta com animação de altura em acordeão via CSS Grid, ícones vetoriais nativos do iOS Safari, captura nativa de `beforeinstallprompt` no Android e QR Code vetorial autocontido no Desktop.

[![Licença MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15%20%7C%2016-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4%20%2F%20v3.4-38bdf8.svg)](https://tailwindcss.com/)

---

## Sumário

- [Visão Geral](#visão-geral)
- [O Problema do PWA no iOS e Android](#o-problema-do-pwa-no-ios-e-android)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Arquitetura de Transição em Acordeão](#arquitetura-de-transição-em-acordeão)
- [Instalação Rápida (Drop-in)](#instalação-rápida-drop-in)
- [Exemplo de Uso no Next.js App Router](#exemplo-de-uso-no-nextjs-app-router)
- [Propriedades do Componente (Props)](#propriedades-do-componente-props)
- [Troca de Logo e Customização Visual](#troca-de-logo-e-customização-visual)
- [Solução para Isolamento de Sessão no iOS](#solução-para-isolamento-de-sessão-no-ios)
- [Perguntas Frequentes (FAQ)](#perguntas-frequentes-faq)
- [Licença](#licença)

---

## Visão Geral

A maioria das bibliotecas de instalação de PWA tenta aplicar uma janela genérica que parece deslocada do sistema operacional do usuário. No iOS Safari, a experiência falha porque a Apple não disponibiliza uma API nativa de instalação programática.

O **PWA Modal Installer** foi desenhado com base nos padrões visuais do iOS (efeito Liquid Glass com specular highlights, translucidez escura e ícones oficiais extraídos da interface do sistema), proporcionando uma experiência indistinguível de um aplicativo nativo.

```
       Dispositivo do Usuário
                 │
      ┌──────────┴──────────┐
      ▼                     ▼
 iOS (Safari)       Android (Chromium)      Desktop (PC/Mac)
      │                     │                     │
  Acordeão com      Evento nativo         Modal centralizado
  ícones Apple      beforeinstallprompt   com QR Code SVG
  e 4 passos        em 1 toque            para escanear
```

---

## O Problema do PWA no iOS e Android

1. **No iOS (Safari):** Não existe o evento `beforeinstallprompt`. A única forma de adicionar à tela inicial é abrindo a folha de compartilhamento (Share Sheet) e selecionando "Adicionar à Tela de Início". Sem instruções visuais claras e ícones idênticos aos do sistema, a taxa de desistência é superior a 80%.
2. **Isolamento de Sessão no iOS:** O Safari e a Web App instalada rodam em contêineres de cookies separados. Se o usuário fizer login no navegador e só depois adicionar o PWA à tela inicial, ele terá que fazer login novamente. A solução recomendada é conduzir o usuário à instalação já na tela de login ou pré-onboarding (`/login?pwa=1`).
3. **No Android:** O navegador Google Chrome suporta `beforeinstallprompt`, permitindo instalar o aplicativo com um único toque, sem necessidade de navegar por menus.

---

## Funcionalidades Principais

- **Visual Apple Liquid Glass:** Efeito Aqua moderno com `backdrop-blur-[28px]`, fundo translúcido `bg-[#1c1e2a]/85` e borda especular suave.
- **Folha Inferior Adaptativa no Celular:** Ancorada na base da tela (`bottom-0`) respeitando a margem segura (`env(safe-area-inset-bottom)`), permitindo que o usuário visualize o contexto da página ao fundo.
- **Transição de Altura sem Layout Shift:** Acordeão fluido animado puramente com CSS Grid (`grid-template-rows: 0fr -> 1fr`) e curva cúbica Apple (`cubic-bezier(0.32, 0.72, 0, 1)`), sem medições pesadas em JavaScript.
- **Ícones Vetoriais Nativos:** Inclui os vetores oficiais do botão Compartilhar do Safari, botão de Três Pontos, Seta de Rolagem e Adicionar à Tela de Início.
- **Android 1-Click Install:** Gancho automático para capturar e disparar o diálogo nativo do sistema quando suportado.
- **Desktop QR Code Zero-Dependency:** Gerador de QR Code vetorial próprio em SVG de 15 KB, sem carregar dependências externas de centenas de kilobytes.
- **Suporte a Rede Local (LAN IP):** Durante o desenvolvimento local (`localhost`), o QR Code gera a URL com o IP da máquina na rede Wi-Fi, permitindo testar diretamente no celular físico.

---

## Arquitetura de Transição em Acordeão

Para evitar saltos visuais bruscos na abertura do passo a passo no iOS, o componente utiliza interpolação de linhas no CSS Grid:

```tsx
<div
  className="grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]"
  style={{ gridTemplateRows: isAccordionOpen ? "1fr" : "0fr" }}
>
  <div className="overflow-hidden">
    {/* Conteúdo dos 4 passos com ícones oficiais */}
  </div>
</div>
```

---

## Instalação Rápida (Drop-in)

Este repositório foi estruturado para que você possa copiar os arquivos essenciais diretamente para dentro da sua aplicação React ou Next.js:

1. Copie o componente:
   - `src/components/pwa-install-modal.tsx` -> para a sua pasta de componentes.
2. Copie os módulos auxiliares:
   - `src/lib/pwa.ts` -> funções de detecção de sistema operacional e gatilhos.
   - `src/lib/qr.ts` -> gerador de QR Code vetorial SVG.
3. Instale os ícones da Lucide (opcional, caso seu projeto já não possua):
   ```bash
   npm install lucide-react
   ```

---

## Exemplo de Uso no Next.js App Router

Adicione o modal no seu `layout.tsx` principal ou na página de autenticação:

```tsx
// src/app/layout.tsx
import { PwaInstallModal } from "@/components/pwa-install-modal";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}

        {/* Modal de Instalação com detecção automática */}
        <PwaInstallModal
          appName="Meu Produto"
          appSubtitle="Aplicativo Oficial"
          accentColor="#2563eb"
        />
      </body>
    </html>
  );
}
```

---

## Propriedades do Componente (Props)

| Propriedade | Tipo | Padrão | Descrição |
|---|---|---|---|
| `appName` | `string` | `"App Web"` | Nome principal exibido no cabeçalho do cartão |
| `appSubtitle` | `string` | `"Aplicativo Oficial"` | Etiqueta / badge ao lado do nome |
| `appDescription` | `string` | Texto padrão | Mensagem explicativa exibida antes do acordeão |
| `appIcon` | `ReactNode` | Ícone padrão | Componente visual ou elemento `<img>` com o logo do app |
| `accentColor` | `string` | `"#2563eb"` | Cor dos botões principais e destaques |
| `forcePlatform` | `"ios" \| "android" \| "desktop"` | `undefined` | Permite forçar um modo para visualização e testes |
| `forceOpen` | `boolean` | `undefined` | Controla externamente se o modal está aberto |
| `onClose` | `() => void` | `undefined` | Callback acionado ao fechar ou confirmar instalação |
| `storageKey` | `string` | `"pwa_modal_dismissed"` | Chave no `localStorage` para memorizar se o usuário dispensou |
| `desktopLanIp` | `string` | `"192.168.15.5"` | IP da máquina local para testes do QR Code via Wi-Fi |
| `showQrOnDesktop`| `boolean` | `true` | Exibe o QR Code ao abrir em computadores |
| `customInstallUrl` | `string` | `undefined` | Sobrescreve a URL destino gerada no QR Code |

---

## Troca de Logo e Customização Visual

Para utilizar a sua própria identidade visual e logotipo:

```tsx
import Image from "next/image";
import { PwaInstallModal } from "@/components/pwa-install-modal";

export function CustomPwaPrompt() {
  return (
    <PwaInstallModal
      appName="Acme Studio"
      appSubtitle="Produtividade"
      accentColor="#10b981"
      appIcon={
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[14px] shadow-md">
          <Image
            src="/icon-192.png"
            alt="Logo Acme"
            fill
            className="object-cover"
          />
        </div>
      }
    />
  );
}
```

---

## Solução para Isolamento de Sessão no iOS

No Safari mobile, o armazenamento de dados (`localStorage`, `sessionStorage` e cookies) é isolado quando a página é salva na tela inicial. 

### Fluxo Recomendado:

```
Link de Convite ou QR Code
            │
            ▼
    /login?pwa=1
            │
            ▼
  Abre Modal no Safari
            │
            ▼
Adiciona à Tela de Início
            │
            ▼
Abre pelo ícone na Tela de Início
            │
            ▼
Faz Login no contêiner permanente do PWA
```

Ao utilizar o parâmetro `?pwa=1`, o componente detecta a intenção e abre o modal instantaneamente na página de login, antes do preenchimento de senhas.

---

## Perguntas Frequentes (FAQ)

### Como testar o fluxo no celular sem subir para produção?
Inicie o servidor de desenvolvimento na sua rede local com o comando `next dev -H 0.0.0.0`. Em seguida, passe o seu IP de rede local na propriedade `desktopLanIp="192.168.X.X"`. O QR Code gerado no desktop apontará diretamente para o seu aparelho móvel conectado à mesma rede Wi-Fi.

### O modal reaparece para quem já instalou?
Não. O componente verifica `window.matchMedia("(display-mode: standalone)").matches` e `navigator.standalone`. Se o aplicativo já estiver em execução na janela independente, o modal é desativado por completo.

### É possível disparar o modal por um botão qualquer da página?
Sim. Basta passar `forceOpen={true}` controlado pelo estado do seu botão, ou disparar um evento customizado na janela:

```tsx
function abrirInstalador() {
  window.dispatchEvent(new CustomEvent("pwa:open-install"));
}
```

---

## Licença

Distribuído sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
