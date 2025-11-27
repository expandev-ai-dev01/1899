import { Button } from '@/core/components/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/core/components/card';
import { useNavigation } from '@/core/hooks/useNavigation';
import { Moon, Sparkles, Calendar } from 'lucide-react';

function HomePage() {
  const { navigate } = useNavigation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 text-center">
      <div className="space-y-4">
        <div className="flex justify-center">
          <Moon className="h-24 w-24 text-slate-300" />
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl">Moon Tracker</h1>
        <p className="text-xl text-slate-400">Explore as fases lunares em 3D</p>
      </div>

      <div className="grid max-w-4xl gap-6 px-4 md:grid-cols-3">
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <CardHeader>
            <Sparkles className="mb-2 h-8 w-8 text-yellow-400" />
            <CardTitle className="text-white">Visualização 3D</CardTitle>
            <CardDescription className="text-slate-400">
              Veja a lua em tempo real com renderização tridimensional realista
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <CardHeader>
            <Calendar className="mb-2 h-8 w-8 text-blue-400" />
            <CardTitle className="text-white">Navegação Temporal</CardTitle>
            <CardDescription className="text-slate-400">
              Viaje no tempo para ver como a lua estava ou estará em qualquer data
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <CardHeader>
            <Moon className="mb-2 h-8 w-8 text-purple-400" />
            <CardTitle className="text-white">Informações Detalhadas</CardTitle>
            <CardDescription className="text-slate-400">
              Acesse dados precisos sobre iluminação, fase e idade lunar
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Button
        size="lg"
        onClick={() => navigate('/moon')}
        className="bg-blue-600 text-lg hover:bg-blue-700"
      >
        <Moon className="mr-2 h-5 w-5" />
        Explorar Visualização 3D
      </Button>
    </div>
  );
}

export { HomePage };
