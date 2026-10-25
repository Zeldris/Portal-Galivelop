import {
  AudioLines, BarChart3, BookOpen, CodeXml, Cpu, Crown, Dices, Gauge, Globe, Highlighter, Image, Languages, Map,
  ShieldCheck, Sparkles, Swords, Users, type LucideIcon,
} from 'lucide-react';

// Iconos que pueden usar las características de un proyecto (campo "icono" del .json) y los de «Próximamente».
const ICONOS: Record<string, LucideIcon> = {
  audio: AudioLines,
  book: BookOpen,
  chart: BarChart3,
  code: CodeXml,
  cpu: Cpu,
  crown: Crown,
  dices: Dices,
  gauge: Gauge,
  globe: Globe,
  highlighter: Highlighter,
  image: Image,
  languages: Languages,
  map: Map,
  shield: ShieldCheck,
  sparkles: Sparkles,
  swords: Swords,
  users: Users,
};

export const NOMBRES_ICONOS = Object.keys(ICONOS);

export function Icono({ nombre, tamano = 22 }: { nombre: string; tamano?: number }) {
  const Componente = ICONOS[nombre] ?? Sparkles;
  return <Componente size={tamano} strokeWidth={1.75} aria-hidden="true" />;
}
