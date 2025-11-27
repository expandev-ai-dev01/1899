import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Button } from '@/core/components/button';
import { Alert, AlertDescription, AlertTitle } from '@/core/components/alert';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { DatePicker } from '@/core/components/date-picker';
import { RotateCcw, Gauge, Info } from 'lucide-react';
import { useMoonPhase, useMoonVisualizationStore } from '@/domain/moon-phase/_module';
import { formatDateForAPI } from '@/domain/moon-phase/utils';
import { MoonCanvas } from './_impl/MoonCanvas';
import { DateArc } from './_impl/DateArc';
import { RotationControls } from './_impl/RotationControls';
import { MoonInfo } from './_impl/MoonInfo';
import { MoonCalendar } from './_impl/MoonCalendar';

function MoonVisualizationPage() {
  const { selectedDate, setSelectedDate, rotationSpeed, resetToToday } =
    useMoonVisualizationStore();

  const {
    data: moonData,
    isLoading,
    isError,
    error,
  } = useMoonPhase({
    date: formatDateForAPI(selectedDate),
  });

  useEffect(() => {
    document.title = 'Moon Tracker - Visualização 3D';
  }, []);

  // Calculate date limits (±50 years)
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 50, 0, 1);
  const maxDate = new Date(today.getFullYear() + 50, 11, 31);

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <Info className="h-4 w-4" />
          <AlertTitle>Erro ao carregar dados</AlertTitle>
          <AlertDescription>
            {error?.message || 'Não foi possível carregar os dados da lua. Tente novamente.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Moon Tracker
          </h1>
          <p className="text-slate-400">Visualização 3D das Fases Lunares</p>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Left Column - 3D Visualization & Calendar */}
          <div className="space-y-6">
            {/* Moon Canvas Card */}
            <Card className="border-slate-800 bg-slate-900/50 shadow-2xl backdrop-blur-sm">
              <CardHeader className="border-b border-slate-800">
                <div className="flex items-center justify-between gap-4">
                  <DatePicker
                    date={selectedDate}
                    onDateChange={(date) => date && setSelectedDate(date)}
                    fromDate={minDate}
                    toDate={maxDate}
                    formatStr="dd/MM/yyyy"
                    className="w-[240px] border-slate-700 bg-slate-800/50 text-white hover:bg-slate-800 hover:text-white"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetToToday}
                      className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Hoje
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative aspect-square w-full">
                  {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                      <LoadingSpinner className="h-12 w-12 text-slate-400" />
                    </div>
                  ) : (
                    <>
                      <MoonCanvas moonData={moonData} />
                      <DateArc />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Calendar Component */}
            <MoonCalendar />

            {/* Rotation Controls */}
            <Card className="border-slate-800 bg-slate-900/50 shadow-xl backdrop-blur-sm">
              <CardHeader className="border-b border-slate-800">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Gauge className="h-5 w-5" />
                  Controles de Rotação
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <RotationControls />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Moon Information */}
          <div>
            <Card className="sticky top-6 border-slate-800 bg-slate-900/50 shadow-xl backdrop-blur-sm">
              <CardHeader className="border-b border-slate-800">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Info className="h-5 w-5" />
                  Informações da Fase Lunar
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner className="h-8 w-8 text-slate-400" />
                  </div>
                ) : (
                  moonData && <MoonInfo moonData={moonData} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Speed Indicator */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm text-slate-300">
            <Gauge className="h-4 w-4" />
            <span>
              Velocidade:{' '}
              <strong className="text-white">
                {rotationSpeed === 'slow' ? 'Lenta (1 dia)' : 'Rápida (7 dias)'}
              </strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { MoonVisualizationPage };
