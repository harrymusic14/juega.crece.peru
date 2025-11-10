import { useState, useEffect } from 'react';
import { supabase, Competency, Profile } from './lib/supabase';
import { AuthScreen } from './components/AuthScreen';
import { GameHeader } from './components/GameHeader';
import { CompetencyCard } from './components/CompetencyCard';
import { CompetencyScreen } from './components/CompetencyScreen';
import { LogOut } from 'lucide-react';

type Screen = 'auth' | 'menu' | 'competency';

function App() {
  const [screen, setScreen] = useState<Screen>('auth');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [selectedCompetency, setSelectedCompetency] = useState<Competency | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (screen === 'menu' && user) {
      loadData();
    }
  }, [screen, user]);

  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      setUser(session.user);
      setScreen('menu');
    } else {
      setScreen('auth');
    }
    setLoading(false);
  };

  const loadData = async () => {
    if (!user) return;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileData) {
      setProfile(profileData);
    }

    const { data: competenciesData } = await supabase
      .from('competencies')
      .select('*')
      .order('name');

    if (competenciesData) {
      setCompetencies(competenciesData);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setScreen('auth');
  };

  const handleCompetencyClick = (competency: Competency) => {
    setSelectedCompetency(competency);
    setScreen('competency');
  };

  const handleBackToMenu = () => {
    setSelectedCompetency(null);
    setScreen('menu');
    loadData();
  };

  const handleScoreUpdate = async (points: number) => {
    if (!profile) return;

    const newScore = profile.total_score + points;
    const newLevel = Math.floor(newScore / 100) + 1;

    const { error } = await supabase
      .from('profiles')
      .update({
        total_score: newScore,
        current_level: newLevel,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id);

    if (!error) {
      setProfile({
        ...profile,
        total_score: newScore,
        current_level: newLevel,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  if (screen === 'auth') {
    return <AuthScreen onAuthSuccess={checkSession} />;
  }

  if (screen === 'competency' && selectedCompetency) {
    return (
      <CompetencyScreen
        competency={selectedCompetency}
        userId={user.id}
        onBack={handleBackToMenu}
        onScoreUpdate={handleScoreUpdate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <GameHeader profile={profile} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Competencias Profesionales</h2>
            <p className="text-gray-600 mt-2">
              Selecciona una competencia para comenzar tu entrenamiento
            </p>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 hover:shadow-md transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competencies.map((competency) => (
            <CompetencyCard
              key={competency.id}
              competency={competency}
              progress={Math.floor(Math.random() * 60) + 20}
              onClick={() => handleCompetencyClick(competency)}
            />
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">¿Cómo funciona?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Elige una competencia</h4>
              <p className="text-sm text-gray-600">
                Selecciona el área que deseas desarrollar
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-green-600">2</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Resuelve desafíos</h4>
              <p className="text-sm text-gray-600">
                Responde preguntas de razonamiento y lógica
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-yellow-600">3</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Gana puntos</h4>
              <p className="text-sm text-gray-600">
                Acumula puntos y desbloquea niveles
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
