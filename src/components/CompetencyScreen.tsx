import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy } from 'lucide-react';
import { supabase, Competency, Question } from '../lib/supabase';
import { QuestionScreen } from './QuestionScreen';

interface CompetencyScreenProps {
  competency: Competency;
  userId: string;
  onBack: () => void;
  onScoreUpdate: (points: number) => void;
}

export function CompetencyScreen({
  competency,
  userId,
  onBack,
  onScoreUpdate,
}: CompetencyScreenProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({ correct: 0, total: 0, points: 0 });

  useEffect(() => {
    loadQuestions();
  }, [competency.id]);

  const loadQuestions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('competency_id', competency.id)
      .order('level', { ascending: true });

    if (error) {
      console.error('Error loading questions:', error);
    } else if (data) {
      setQuestions(data);
    }
    setLoading(false);
  };

  const handleAnswer = async (isCorrect: boolean) => {
    const currentQuestion = questions[currentQuestionIndex];

    await supabase.from('user_progress').insert({
      user_id: userId,
      question_id: currentQuestion.id,
      is_correct: isCorrect,
      attempts: 1,
    });

    setResults((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
      points: prev.points + (isCorrect ? currentQuestion.points : 0),
    }));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      const finalPoints = results.points + (isCorrect ? currentQuestion.points : 0);
      onScoreUpdate(finalPoints);
      setShowResults(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = (results.correct / results.total) * 100;
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div
            className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: competency.color + '20' }}
          >
            <Trophy className="w-12 h-12" style={{ color: competency.color }} />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Completado!</h2>
          <p className="text-gray-600 mb-8">{competency.name}</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-3xl font-bold text-gray-800">{results.correct}</p>
              <p className="text-sm text-gray-600 mt-1">Correctas</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-3xl font-bold" style={{ color: competency.color }}>
                {results.points}
              </p>
              <p className="text-sm text-gray-600 mt-1">Puntos</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Precisión</span>
              <span className="text-lg font-bold" style={{ color: competency.color }}>
                {percentage.toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: competency.color,
                }}
              />
            </div>
          </div>

          <button
            onClick={onBack}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <button onClick={onBack} className="mb-4 text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <p className="text-gray-600">No hay preguntas disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <QuestionScreen
      question={questions[currentQuestionIndex]}
      competency={competency}
      onAnswer={handleAnswer}
      onBack={onBack}
      questionNumber={currentQuestionIndex + 1}
      totalQuestions={questions.length}
    />
  );
}
