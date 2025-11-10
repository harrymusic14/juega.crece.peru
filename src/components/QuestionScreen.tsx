import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { Question, Competency } from '../lib/supabase';
import { VisualQuestion } from './VisualQuestion';

interface QuestionScreenProps {
  question: Question;
  competency: Competency;
  onAnswer: (isCorrect: boolean) => void;
  onBack: () => void;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionScreen({
  question,
  competency,
  onAnswer,
  onBack,
  questionNumber,
  totalQuestions,
}: QuestionScreenProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === question.correct_answer;
    setIsCorrect(correct);
    setShowFeedback(true);

    setTimeout(() => {
      onAnswer(correct);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsCorrect(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: competency.color + '20' }}
              >
                <span className="text-2xl font-bold" style={{ color: competency.color }}>
                  {questionNumber}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{competency.name}</h2>
                <p className="text-sm text-gray-500">
                  Pregunta {questionNumber} de {totalQuestions}
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Nivel {question.level}</span>
            </div>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${(questionNumber / totalQuestions) * 100}%`,
                backgroundColor: competency.color,
              }}
            />
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {question.question_text}
          </h3>

          <VisualQuestion
            question={question}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={setSelectedAnswer}
            showFeedback={showFeedback}
            isCorrect={isCorrect}
          />

          {!showFeedback && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className={`px-8 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 ${
                  selectedAnswer === null
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl hover:scale-105'
                }`}
              >
                Confirmar Respuesta
              </button>
            </div>
          )}

          {showFeedback && (
            <div className="flex justify-center mt-8">
              <div
                className={`flex items-center gap-3 px-6 py-4 rounded-xl text-white font-bold text-lg ${
                  isCorrect ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    +{question.points} puntos
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6" />
                    Inténtalo de nuevo
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
