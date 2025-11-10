import { Trophy, Star, Target } from 'lucide-react';
import { Profile } from '../lib/supabase';

interface GameHeaderProps {
  profile: Profile | null;
}

export function GameHeader({ profile }: GameHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 px-4 sm:px-8 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3">
              <Target className="w-8 h-8" />
              Desarrollo Pro
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Mejora tus habilidades profesionales
            </p>
          </div>

          {profile && (
            <div className="flex items-center gap-4 bg-blue-700 bg-opacity-50 px-6 py-3 rounded-xl">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-300" />
                <div className="text-left">
                  <p className="text-xs text-blue-200">Puntos</p>
                  <p className="text-xl font-bold">{profile.total_score}</p>
                </div>
              </div>

              <div className="w-px h-10 bg-blue-500" />

              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-300" />
                <div className="text-left">
                  <p className="text-xs text-blue-200">Nivel</p>
                  <p className="text-xl font-bold">{profile.current_level}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
