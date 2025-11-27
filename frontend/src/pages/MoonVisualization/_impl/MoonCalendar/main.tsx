import { useState, useMemo } from 'react';
import { Calendar } from '@/core/components/calendar';
import { Button } from '@/core/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { useMoonVisualizationStore, useMoonPhaseRange } from '@/domain/moon-phase/_module';
import { formatDateForAPI } from '@/domain/moon-phase/utils';
import { endOfMonth, startOfMonth, isSameDay, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
import { MoonIcon } from './MoonIcon';
import type { MoonCalendarProps } from './types';
import { cn } from '@/core/lib/utils';

export function MoonCalendar({ className }: MoonCalendarProps) {
  const { selectedDate, setSelectedDate, resetToToday } = useMoonVisualizationStore();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Calculate range for API
  // We fetch the whole month plus a bit of buffer if needed, but start/end of month is enough for the grid cells that matter
  const startDate = useMemo(() => formatDateForAPI(startOfMonth(currentMonth)), [currentMonth]);
  const endDate = useMemo(() => formatDateForAPI(endOfMonth(currentMonth)), [currentMonth]);

  const { data: moonDataRange, isLoading } = useMoonPhaseRange({
    startDate,
    endDate,
  });

  // Limits: +/- 50 years
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 50, 0, 1);
  const maxDate = new Date(today.getFullYear() + 50, 11, 31);

  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
  };

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleReset = () => {
    resetToToday();
    setCurrentMonth(new Date());
  };

  // Custom Day Component to render Moon Icon
  const CustomDay = (props: any) => {
    const { day, modifiers, ...buttonProps } = props;
    const { date, displayMonth } = day;

    // Only render content for days in the current month to avoid confusion or fetch issues
    // (React Day Picker shows outside days by default, but we might not have data for them if we only fetch current month)
    // We can either fetch more data or just hide icons for outside days.
    // Let's hide icons for outside days for cleaner look, or check if we have data.

    const dateStr = formatDateForAPI(date);
    const dayData = moonDataRange?.find((d) => d.date === dateStr);

    const isSelected = isSameDay(date, selectedDate);
    const isToday = isSameDay(date, new Date());
    const isCurrentMonth = isSameMonth(date, displayMonth);

    if (!isCurrentMonth) return <div className="size-full opacity-20" />;

    return (
      <button
        {...buttonProps}
        className={cn(
          'size-full group relative flex items-center justify-center p-1 transition-all',
          isSelected && 'bg-accent/20 rounded-md',
          isToday && !isSelected && 'bg-primary/10 rounded-md'
        )}
      >
        {dayData ? (
          <div className="size-full relative flex flex-col items-center justify-center gap-1">
            <MoonIcon
              phaseValue={dayData.phaseValue}
              className={cn(
                'size-6 transition-transform duration-200 group-hover:scale-110',
                isSelected && 'scale-110 drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]'
              )}
            />
            {/* Spec says: "sem a exibição de números de dia". But we need to know the day? 
                 "Cada célula... deve exibir exclusivamente um ícone visual... sem rótulos de texto" 
                 Usually calendars have numbers. If strictly no numbers, user has to guess. 
                 Let's assume "sem rótulos de texto" means no phase name, but maybe day number is allowed? 
                 AC-002 says: "sem a exibição de números de dia". 
                 Okay, strictly NO numbers. 
             */}
          </div>
        ) : (
          isLoading && <div className="size-4 animate-pulse rounded-full bg-slate-800" />
        )}

        {/* Highlight indicator for Today if no number is shown */}
        {isToday && <div className="absolute bottom-1 h-1 w-1 rounded-full bg-blue-500" />}
      </button>
    );
  };

  return (
    <Card className={cn('border-slate-800 bg-slate-900/50 shadow-xl backdrop-blur-sm', className)}>
      <CardHeader className="border-b border-slate-800">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <CalendarIcon className="h-5 w-5" />
            Calendário Lunar
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 text-slate-400 hover:text-white"
          >
            <RotateCcw className="mr-2 h-3 w-3" />
            Hoje
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            month={currentMonth}
            onMonthChange={handleMonthChange}
            fromDate={minDate}
            toDate={maxDate}
            locale={ptBR}
            className="p-0"
            classNames={{
              month: 'space-y-4',
              caption: 'flex justify-center pt-1 relative items-center mb-4',
              caption_label: 'text-sm font-medium text-white',
              nav: 'space-x-1 flex items-center',
              nav_button: cn(
                'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white hover:bg-slate-800 rounded-md transition-colors'
              ),
              nav_button_previous: 'absolute left-1',
              nav_button_next: 'absolute right-1',
              table: 'w-full border-collapse space-y-1',
              head_row: 'flex',
              head_cell: 'text-slate-500 rounded-md w-9 font-normal text-[0.8rem] uppercase flex-1',
              row: 'flex w-full mt-2 gap-1',
              cell: 'h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
              day: cn(
                'h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-800 rounded-md transition-colors text-transparent'
              ),
              day_selected:
                'bg-slate-800 text-white hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white',
              day_today: 'bg-slate-800/50 text-accent-foreground',
              day_outside:
                'text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
              day_disabled: 'text-muted-foreground opacity-50',
              day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
              day_hidden: 'invisible',
            }}
            components={{
              DayButton: CustomDay,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
