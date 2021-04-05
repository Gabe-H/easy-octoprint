interface GCodeAnalysis {
    estimatedPrintTime: number;
    filament: Filament;
}

interface FileAndPath {
  name: string;
  path: string;
}

interface GCodeFile {
    date: number;
    name: string;
    path: string;
    type: string;
    size: number;
    refs: Refs;
}

interface OctoPiInstance {
  url: string;
  apiKey: string;
  name: string;
}

interface OctoResponse {
  files?: (FilesEntity)[] | null;
  free: number;
  total: number;
}
interface FilesEntity {
  children?: (null)[] | null;
  display: string;
  name: string;
  origin: string;
  path: string;
  refs: Refs;
  size: number;
  type: string;
  typePath?: (string)[] | null;
  date?: number | null;
  gcodeAnalysis?: GcodeAnalysis | null;
  hash?: string | null;
}
interface Refs {
  resource: string;
  download?: string | null;
}
interface GcodeAnalysis {
  dimensions: Dimensions;
  estimatedPrintTime: number;
  filament: Filament;
  printingArea: PrintingArea;
}
interface Dimensions {
  depth: number;
  height: number;
  width: number;
}
interface Filament {
  tool0: Tool0;
}
interface Tool0 {
  length: number;
  volume: number;
}
interface PrintingArea {
  maxX: number;
  maxY: number;
  maxZ: number;
  minX: number;
  minY: number;
  minZ: number;
}


declare module '*.module.css';
