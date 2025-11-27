import { Moon, Sparkles, Calendar, TrendingUp } from 'lucide-react';
import { Progress } from '@/core/components/progress';
import { Separator } from '@/core/components/separator';
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

      {/* Age */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-medium text-slate-300">Idade da Lua</span>
        </div>
        <span className="text-lg font-bold text-white">{moonData.age.toFixed(1)} dias</span>
      </div>

      {/* Phase Value */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-medium text-slate-300">Valor da Fase</span>
        </div>
        <span className="text-lg font-bold text-white">{moonData.phaseValue.toFixed(3)}</span>
      </div>

      <Separator className="bg-slate-700" />

      {/* Additional Info */}
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
