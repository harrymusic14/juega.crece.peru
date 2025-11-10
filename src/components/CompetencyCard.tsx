import * as Icons from 'lucide-react';
import { Competency } from '../lib/supabase';

interface CompetencyCardProps {
  competency: Competency;
  progress: number;
  onClick: () => void;
  isLocked?: boolean;
}

export function CompetencyCard({ competency, progress, onClick, isLocked = false }: CompetencyCardProps) {
  const IconComponent = (Icons as any)[competency.icon] || Icons.Brain;

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left w-full ${
        isLocked
          ? 'bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed'
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-xl hover:scale-105 cursor-pointer'
      }`}
      style={{
        borderLeftColor: !isLocked ? competency.color : undefined,
        borderLeftWidth: !isLocked ? '6px' : undefined,
      }}
    >
      {isLocked && (
        <div className="absolute top-4 right-4">
          <Icons.Lock className="w-6 h-6 text-gray-400" />
        </div>
      )}

      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-md"
        style={{ backgroundColor: competency.color + '20' }}
      >
        <IconComponent className="w-8 h-8" style={{ color: competency.color }} />
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-2">{competency.name}</h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{competency.description}</p>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-medium">Progreso</span>
          <span className="font-bold" style={{ color: competency.color }}>
            {progress}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              backgroundColor: competency.color,
            }}
          />
        </div>
      </div>
    </button>
  );
}
