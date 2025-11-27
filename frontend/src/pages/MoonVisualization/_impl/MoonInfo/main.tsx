import {
  Moon,
  Sparkles,
  Calendar,
  TrendingUp,
  Sunrise,
  Sunset,
  Clock,
  Ruler,
  ArrowRight,
} from 'lucide-react';
import { Progress } from '@/core/components/progress';
import { Separator } from '@/core/components/separator';
import { formatDateForDisplay } from '@/domain/moon-phase/utils';
import type { MoonInfoProps } from './types';

function MoonInfo({ moonData }: MoonInfoProps) {
  const getPhaseIcon = () => {
    const phase = moonData.phaseName.toLowerCase();
    if (phase.includes('nova')) return '🌑';
    if (phase.includes('crescente')) return '🌒';
    if (phase.includes('cheia')) return '🌕';
    if (phase.includes('minguante')) return '🌘';
    return '🌓';
  };

  return (
    <div className="space-y-6">
      {/* Phase Name */}
      <div className="text-center">
        <div className="mb-3 text-6xl">{getPhaseIcon()}</div>
        <h3 className="text-2xl font-bold text-white">{moonData.phaseName}</h3>
      </div>

      <Separator className="bg-slate-700" />

      {/* Illumination */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-slate-300">Iluminação</span>
          </div>
          <span className="text-lg font-bold text-white">{moonData.illumination.toFixed(1)}%</span>
        </div>
        <Progress value={moonData.illumination} className="h-2" />
      </div>

      <Separator className="bg-slate-700" />

      {/* Sun Cycle (Rise/Set) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1 rounded-md border border-slate-700 bg-slate-800/30 p-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Sunrise className="h-4 w-4 text-orange-400" />
            <span className="text-xs font-medium">Nascer</span>
          </div>
          <span className="text-lg font-bold text-white">
            {moonData.moonRise || 'Indisponível'}
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-md border border-slate-700 bg-slate-800/30 p-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Sunset className="h-4 w-4 text-orange-400" />
            <span className="text-xs font-medium">Ocaso</span>
          </div>
          <span className="text-lg font-bold text-white">{moonData.moonSet || 'Indisponível'}</span>
        </div>
      </div>

      {/* Next Phase */}
      {moonData.nextPhaseName && moonData.nextPhaseDate && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium text-slate-300">Próxima Fase</span>
          </div>
          <div className="flex items-center justify-between rounded-md border border-slate-700 bg-slate-800/30 p-3">
            <span className="font-medium text-white">{moonData.nextPhaseName}</span>
            <span className="text-sm text-slate-400">
              {formatDateForDisplay(moonData.nextPhaseDate)}
            </span>
          </div>
        </div>
      )}

      <Separator className="bg-slate-700" />

      {/* Detailed Metrics */}
      <div className="grid gap-3">
        {/* Age */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-slate-300">Idade da Lua</span>
          </div>
          <span className="text-sm font-bold text-white">{moonData.age.toFixed(1)} dias</span>
        </div>

        {/* Phase Value */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-slate-300">Valor da Fase</span>
          </div>
          <span className="text-sm font-bold text-white">{moonData.phaseValue.toFixed(3)}</span>
        </div>

        {/* Distance */}
        {moonData.distance && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-red-400" />
              <span className="text-sm font-medium text-slate-300">Distância</span>
            </div>
            <span className="text-sm font-bold text-white">
              {moonData.distance.toLocaleString('pt-BR')} km
            </span>
          </div>
        )}

        {/* Duration */}
        {moonData.phaseDuration && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              <span className="text-sm font-medium text-slate-300">Duração da Fase</span>
            </div>
            <span className="text-sm font-bold text-white">{moonData.phaseDuration}</span>
          </div>
        )}
      </div>

      <Separator className="bg-slate-700" />

      {/* Description */}
      <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Moon className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-300">Sobre esta fase</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-400">
          {moonData.phaseName.toLowerCase().includes('nova') &&
            'A Lua Nova ocorre quando a Lua está entre a Terra e o Sol, tornando-se invisível no céu noturno.'}
          {moonData.phaseName.toLowerCase().includes('crescente') &&
            'Durante a fase crescente, a iluminação da Lua aumenta gradualmente, criando uma forma de "C" invertido.'}
          {moonData.phaseName.toLowerCase().includes('cheia') &&
            'A Lua Cheia acontece quando a Terra está entre o Sol e a Lua, iluminando completamente sua face visível.'}
          {moonData.phaseName.toLowerCase().includes('minguante') &&
            'Na fase minguante, a iluminação da Lua diminui progressivamente, formando um "C" no céu.'}
          {!moonData.phaseName.toLowerCase().includes('nova') &&
            !moonData.phaseName.toLowerCase().includes('crescente') &&
            !moonData.phaseName.toLowerCase().includes('cheia') &&
            !moonData.phaseName.toLowerCase().includes('minguante') &&
            'Esta é uma fase intermediária do ciclo lunar, com características únicas de iluminação.'}
        </p>
      </div>
    </div>
  );
}

export { MoonInfo };
