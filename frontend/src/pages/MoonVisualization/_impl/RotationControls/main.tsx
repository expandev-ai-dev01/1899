import { Label } from '@/core/components/label';
import { RadioGroup, RadioGroupItem } from '@/core/components/radio-group';
import { useMoonVisualizationStore } from '@/domain/moon-phase/_module';
import { Gauge, Zap } from 'lucide-react';

function RotationControls() {
  const { rotationSpeed, setRotationSpeed } = useMoonVisualizationStore();

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-slate-300">Velocidade de Rotação</Label>
        <RadioGroup
          value={rotationSpeed}
          onValueChange={(value) => setRotationSpeed(value as 'slow' | 'fast')}
          className="grid grid-cols-2 gap-4"
        >
          <div>
            <RadioGroupItem value="slow" id="slow" className="peer sr-only" />
            <Label
              htmlFor="slow"
              className="flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 border-slate-700 bg-slate-800/50 p-4 hover:bg-slate-800 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-500/10"
            >
              <Gauge className="mb-2 h-6 w-6 text-slate-400" />
              <span className="text-sm font-medium text-slate-300">Lenta</span>
              <span className="text-xs text-slate-500">1 dia/movimento</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="fast" id="fast" className="peer sr-only" />
            <Label
              htmlFor="fast"
              className="flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 border-slate-700 bg-slate-800/50 p-4 hover:bg-slate-800 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-500/10"
            >
              <Zap className="mb-2 h-6 w-6 text-slate-400" />
              <span className="text-sm font-medium text-slate-300">Rápida</span>
              <span className="text-xs text-slate-500">7 dias/movimento</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
        <p className="text-sm text-slate-400">
          <strong className="text-slate-300">Dica:</strong> Arraste a lua para a esquerda ou direita
          para navegar no tempo. Use a velocidade lenta para precisão ou rápida para explorar
          períodos maiores.
        </p>
      </div>
    </div>
  );
}

export { RotationControls };
