import { useEffect, useState } from 'react';
import { useMoonVisualizationStore, useDateArc } from '@/domain/moon-phase/_module';
import { formatDateForAPI, formatDateForDisplay } from '@/domain/moon-phase/utils';
import { cn } from '@/core/lib/utils';

function DateArc() {
  const { selectedDate, dateArcInterval } = useMoonVisualizationStore();
  const { generateArc } = useDateArc();
  const [dates, setDates] = useState<string[]>([]);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await generateArc({
          centerDate: formatDateForAPI(selectedDate),
          intervalDays: dateArcInterval,
          totalDates: 12,
        });
        setDates(response.dates);
      } catch (error) {
        console.error('Error generating date arc:', error);
      }
    };

    fetchDates();
  }, [selectedDate, dateArcInterval, generateArc]);

  const radius = 45; // percentage
  const centerX = 50;
  const centerY = 50;

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg className="h-full w-full" viewBox="0 0 100 100">
        {dates.map((date, index) => {
          const angle = (index / dates.length) * 2 * Math.PI - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);

          const isSelected = formatDateForDisplay(date) === formatDateForDisplay(selectedDate);

          return (
            <g key={date}>
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className={cn(
                  'select-none text-[3px] font-medium transition-all duration-200',
                  isSelected
                    ? 'fill-white text-[4px] font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                    : 'fill-slate-400'
                )}
              >
                {formatDateForDisplay(date)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export { DateArc };
