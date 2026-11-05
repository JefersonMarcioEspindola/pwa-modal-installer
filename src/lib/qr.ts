/**
 * Gerador de QR Code leve, autocontido e sem dependências externas.
 * Implementa a especificação QR Code (ISO/IEC 18004) para modo de bytes com correção de erro nível M.
 */

// Tabela de capacidade de dados em bytes por versão (Nível M)
// Índices 1 a 10
const CAPACITY_LEVEL_M: readonly number[] = [
  0,
  14, // v1 (21x21)
  26, // v2 (25x25)
  42, // v3 (29x29)
  62, // v4 (33x33)
  84, // v5 (37x37)
  106, // v6 (41x41)
  122, // v7 (45x45)
  152, // v8 (49x49)
  180, // v9 (53x53)
  213, // v10 (57x57)
];

// Total de palavras-código de dados e blocos de correção de erro para Nível M
interface VersionSpec {
  totalCodewords: number;
  dataCodewords: number;
  ecCodewordsPerBlock: number;
  blocksGroup1: number;
  dataCodewordsGroup1: number;
  blocksGroup2: number;
  dataCodewordsGroup2: number;
  alignmentPatterns: readonly number[];
}

const VERSION_SPECS: readonly VersionSpec[] = [
  { totalCodewords: 0, dataCodewords: 0, ecCodewordsPerBlock: 0, blocksGroup1: 0, dataCodewordsGroup1: 0, blocksGroup2: 0, dataCodewordsGroup2: 0, alignmentPatterns: [] },
  // v1
  { totalCodewords: 26, dataCodewords: 16, ecCodewordsPerBlock: 10, blocksGroup1: 1, dataCodewordsGroup1: 16, blocksGroup2: 0, dataCodewordsGroup2: 0, alignmentPatterns: [] },
  // v2
  { totalCodewords: 44, dataCodewords: 28, ecCodewordsPerBlock: 16, blocksGroup1: 1, dataCodewordsGroup1: 28, blocksGroup2: 0, dataCodewordsGroup2: 0, alignmentPatterns: [6, 18] },
  // v3
  { totalCodewords: 70, dataCodewords: 44, ecCodewordsPerBlock: 26, blocksGroup1: 1, dataCodewordsGroup1: 44, blocksGroup2: 0, dataCodewordsGroup2: 0, alignmentPatterns: [6, 22] },
  // v4
  { totalCodewords: 100, dataCodewords: 64, ecCodewordsPerBlock: 18, blocksGroup1: 2, dataCodewordsGroup1: 32, blocksGroup2: 0, dataCodewordsGroup2: 0, alignmentPatterns: [6, 26] },
  // v5
  { totalCodewords: 134, dataCodewords: 86, ecCodewordsPerBlock: 24, blocksGroup1: 2, dataCodewordsGroup1: 43, blocksGroup2: 0, dataCodewordsGroup2: 0, alignmentPatterns: [6, 30] },
  // v6
  { totalCodewords: 172, dataCodewords: 108, ecCodewordsPerBlock: 16, blocksGroup1: 4, dataCodewordsGroup1: 27, blocksGroup2: 0, dataCodewordsGroup2: 0, alignmentPatterns: [6, 34] },
  // v7
  { totalCodewords: 196, dataCodewords: 124, ecCodewordsPerBlock: 18, blocksGroup1: 4, dataCodewordsGroup1: 31, blocksGroup2: 0, dataCodewordsGroup2: 0, alignmentPatterns: [6, 22, 38] },
  // v8
  { totalCodewords: 242, dataCodewords: 154, ecCodewordsPerBlock: 22, blocksGroup1: 2, dataCodewordsGroup1: 38, blocksGroup2: 2, dataCodewordsGroup2: 39, alignmentPatterns: [6, 24, 42] },
  // v9
  { totalCodewords: 292, dataCodewords: 182, ecCodewordsPerBlock: 22, blocksGroup1: 3, dataCodewordsGroup1: 36, blocksGroup2: 2, dataCodewordsGroup2: 37, alignmentPatterns: [6, 26, 46] },
  // v10
  { totalCodewords: 346, dataCodewords: 216, ecCodewordsPerBlock: 26, blocksGroup1: 4, dataCodewordsGroup1: 40, blocksGroup2: 1, dataCodewordsGroup2: 41, alignmentPatterns: [6, 28, 50] },
];

// Tabelas do corpo de Galois GF(256) com polinômio primitivo 0x11D (285)
const EXP_TABLE = new Uint8Array(512);
const LOG_TABLE = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = x;
    EXP_TABLE[i + 255] = x;
    LOG_TABLE[x] = i;
    x <<= 1;
    if (x >= 256) x ^= 0x11d;
  }
})();

function gfMul(x: number, y: number): number {
  if (x === 0 || y === 0) return 0;
  return EXP_TABLE[LOG_TABLE[x]! + LOG_TABLE[y]!]!;
}

function rsGeneratorPoly(degree: number): Uint8Array {
  let g = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const next = new Uint8Array(g.length + 1);
    const root = EXP_TABLE[i]!;
    for (let j = 0; j < g.length; j++) {
      next[j] = (next[j] ?? 0) ^ gfMul(g[j]!, root);
      next[j + 1] = (next[j + 1] ?? 0) ^ g[j]!;
    }
    g = next;
  }
  return g;
}

function rsCalculateEcc(data: Uint8Array, eccCount: number): Uint8Array {
  const gen = rsGeneratorPoly(eccCount);
  const remainder = new Uint8Array(eccCount);
  for (let i = 0; i < data.length; i++) {
    const factor = data[i]! ^ remainder[0]!;
    for (let j = 0; j < eccCount - 1; j++) {
      remainder[j] = remainder[j + 1]! ^ gfMul(gen[eccCount - j]!, factor);
    }
    remainder[eccCount - 1] = gfMul(gen[0]!, factor);
  }
  return remainder;
}

class BitBuffer {
  buffer: number[] = [];
  length = 0;

  put(num: number, length: number): void {
    for (let i = 0; i < length; i++) {
      this.putBit(((num >>> (length - i - 1)) & 1) === 1);
    }
  }

  putBit(bit: boolean): void {
    const bufIndex = Math.floor(this.length / 8);
    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0);
    }
    if (bit) {
      this.buffer[bufIndex]! |= 0x80 >>> (this.length % 8);
    }
    this.length++;
  }
}

/**
 * Codifica o texto em bytes UTF-8 e encapsula no modo Byte do QR Code.
 */
function encodeData(text: string, version: number): Uint8Array {
  const encoder = new TextEncoder();
  const textBytes = encoder.encode(text);
  const spec = VERSION_SPECS[version]!;
  const bitBuf = new BitBuffer();

  // Modo byte: 0100
  bitBuf.put(0b0100, 4);
  // Tamanho dos dados: 8 bits para v1-9, 16 bits para v10+
  const countBits = version < 10 ? 8 : 16;
  bitBuf.put(textBytes.length, countBits);

  // Bytes do texto
  for (let i = 0; i < textBytes.length; i++) {
    bitBuf.put(textBytes[i]!, 8);
  }

  // Terminador de 4 zeros (se couber)
  const totalDataBits = spec.dataCodewords * 8;
  const remaining = totalDataBits - bitBuf.length;
  const termLen = Math.min(4, Math.max(0, remaining));
  bitBuf.put(0, termLen);

  // Alinhamento para múltiplo de 8
  if (bitBuf.length % 8 !== 0) {
    bitBuf.put(0, 8 - (bitBuf.length % 8));
  }

  // Preenchimento com 0xEC e 0x11 até a capacidade total
  const pad = [0xec, 0x11];
  let padIdx = 0;
  while (bitBuf.length < totalDataBits) {
    bitBuf.put(pad[padIdx % 2]!, 8);
    padIdx++;
  }

  return new Uint8Array(bitBuf.buffer.slice(0, spec.dataCodewords));
}

/**
 * Divide em blocos, calcula Reed-Solomon e intercala palavras-código.
 */
function interleaveBlocks(data: Uint8Array, spec: VersionSpec): Uint8Array {
  const dataBlocks: Uint8Array[] = [];
  const eccBlocks: Uint8Array[] = [];
  let offset = 0;

  for (let b = 0; b < spec.blocksGroup1; b++) {
    const chunk = data.slice(offset, offset + spec.dataCodewordsGroup1);
    offset += spec.dataCodewordsGroup1;
    dataBlocks.push(chunk);
    eccBlocks.push(rsCalculateEcc(chunk, spec.ecCodewordsPerBlock));
  }

  for (let b = 0; b < spec.blocksGroup2; b++) {
    const chunk = data.slice(offset, offset + spec.dataCodewordsGroup2);
    offset += spec.dataCodewordsGroup2;
    dataBlocks.push(chunk);
    eccBlocks.push(rsCalculateEcc(chunk, spec.ecCodewordsPerBlock));
  }

  const result = new Uint8Array(spec.totalCodewords);
  let resIdx = 0;

  // Intercala palavras de dados
  const maxDataLen = Math.max(spec.dataCodewordsGroup1, spec.dataCodewordsGroup2);
  for (let i = 0; i < maxDataLen; i++) {
    for (let b = 0; b < dataBlocks.length; b++) {
      if (i < dataBlocks[b]!.length) {
        result[resIdx++] = dataBlocks[b]![i]!;
      }
    }
  }

  // Intercala palavras de correção de erro
  for (let i = 0; i < spec.ecCodewordsPerBlock; i++) {
    for (let b = 0; b < eccBlocks.length; b++) {
      result[resIdx++] = eccBlocks[b]![i]!;
    }
  }

  return result;
}

/**
 * Gera a matriz 2D de módulos booleanos (true = preto, false = branco).
 */
export function generateQrMatrix(text: string): boolean[][] {
  const encoder = new TextEncoder();
  const textLen = encoder.encode(text).length;

  // Escolhe a menor versão compatível
  let version = 1;
  while (version <= 10 && (CAPACITY_LEVEL_M[version] ?? 0) < textLen) {
    version++;
  }
  if (version > 10) {
    version = 10;
  }

  const spec = VERSION_SPECS[version]!;
  const size = version * 4 + 17;
  const modules: (boolean | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
  const isFunction: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const setModule = (r: number, c: number, val: boolean, fn = true) => {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      modules[r]![c] = val;
      if (fn) isFunction[r]![c] = true;
    }
  };

  // 1. Padrões localizadores (Finder patterns 7x7 nos três cantos)
  const drawFinder = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const inBounds = row + r >= 0 && row + r < size && col + c >= 0 && col + c < size;
        if (!inBounds) continue;
        const isBlack = (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
                        (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
                        (r >= 2 && r <= 4 && c >= 2 && c <= 4);
        setModule(row + r, col + c, isBlack);
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // 2. Padrões de alinhamento (para versão >= 2)
  if (spec.alignmentPatterns.length > 0) {
    const coords = spec.alignmentPatterns;
    for (let i = 0; i < coords.length; i++) {
      for (let j = 0; j < coords.length; j++) {
        const r = coords[i]!;
        const c = coords[j]!;
        // Pula os que colidem com os localizadores
        if ((i === 0 && j === 0) || (i === 0 && j === coords.length - 1) || (i === coords.length - 1 && j === 0)) {
          continue;
        }
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const isBlack = Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0);
            setModule(r + dr, c + dc, isBlack);
          }
        }
      }
    }
  }

  // 3. Padrões de temporização (Timing patterns)
  for (let i = 8; i < size - 8; i++) {
    const val = i % 2 === 0;
    if (modules[6]![i] === null) setModule(6, i, val);
    if (modules[i]![6] === null) setModule(i, 6, val);
  }

  // 4. Módulo escuro permanente
  setModule(size - 8, 8, true);

  // 5. Reserva de formato (15 bits ao redor dos finders)
  for (let i = 0; i < 9; i++) {
    if (modules[8]![i] === null) setModule(8, i, false);
    if (modules[i]![8] === null) setModule(i, 8, false);
  }
  for (let i = 0; i < 8; i++) {
    if (modules[8]![size - 1 - i] === null) setModule(8, size - 1 - i, false);
    if (modules[size - 1 - i]![8] === null) setModule(size - 1 - i, 8, false);
  }

  // Codifica dados e gera palavras-código
  const data = encodeData(text, version);
  const codewords = interleaveBlocks(data, spec);

  // Converte palavras-código em fluxo de bits
  const bits: boolean[] = [];
  for (let i = 0; i < codewords.length; i++) {
    for (let b = 7; b >= 0; b--) {
      bits.push(((codewords[i]! >>> b) & 1) === 1);
    }
  }

  // Coloca bits na matriz em zigue-zague
  let bitIdx = 0;
  let dir = -1; // subindo
  let c = size - 1;
  while (c > 0) {
    if (c === 6) c--; // pula coluna de timing
    const rStart = dir === -1 ? size - 1 : 0;
    const rEnd = dir === -1 ? -1 : size;
    for (let r = rStart; r !== rEnd; r += dir) {
      for (let colOffset = 0; colOffset < 2; colOffset++) {
        const curCol = c - colOffset;
        if (!isFunction[r]![curCol]) {
          const bitVal = bitIdx < bits.length ? bits[bitIdx++]! : false;
          // Aplica máscara padrão (padrão 0: (r + c) % 2 === 0)
          const mask = (r + curCol) % 2 === 0;
          modules[r]![curCol] = bitVal !== mask;
        }
      }
    }
    dir = -dir;
    c -= 2;
  }

  // Escreve bits de formato para Nível M com máscara 0
  // Para Nível M (00) e máscara 0 (000): sequência BCH format bits é 101010000010010
  const FORMAT_BITS = [true, false, true, false, true, false, false, false, false, false, true, false, false, true, false];
  // Padrão horizontal superior esquerdo
  const formatPosTopLeft = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
    [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
  ];
  for (let i = 0; i < 15; i++) {
    const [r, col] = formatPosTopLeft[i]!;
    modules[r!]![col!] = FORMAT_BITS[i]!;
  }
  // Padrão nos cantos inferiores/direitos
  const formatPosSplit = [
    [size - 1, 8], [size - 2, 8], [size - 3, 8], [size - 4, 8], [size - 5, 8], [size - 6, 8], [size - 7, 8],
    [8, size - 8], [8, size - 7], [8, size - 6], [8, size - 5], [8, size - 4], [8, size - 3], [8, size - 2], [8, size - 1],
  ];
  for (let i = 0; i < 15; i++) {
    const [r, col] = formatPosSplit[i]!;
    modules[r!]![col!] = FORMAT_BITS[i]!;
  }

  return modules.map((row) => row.map((m) => !!m));
}

/**
 * Gera um SVG renderizável do QR Code.
 */
export function generateQrSvg(text: string, size = 180): string {
  const matrix = generateQrMatrix(text);
  const count = matrix.length;
  const margin = 2;
  const viewBoxSize = count + margin * 2;

  let pathData = "";
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (matrix[r]?.[c]) {
        pathData += `M${c + margin},${r + margin}h1v1h-1z `;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" width="${size}" height="${size}" shape-rendering="crispEdges">
    <rect width="${viewBoxSize}" height="${viewBoxSize}" fill="#ffffff" rx="1" />
    <path d="${pathData.trim()}" fill="#111214" />
  </svg>`;
}
