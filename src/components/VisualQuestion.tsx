import { Circle, Square, Triangle } from 'lucide-react';
import { Question } from '../lib/supabase';

interface VisualQuestionProps {
  question: Question;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  showFeedback: boolean;
  isCorrect: boolean | null;
}

export function VisualQuestion({
  question,
  selectedAnswer,
  onSelectAnswer,
  showFeedback,
  isCorrect,
}: VisualQuestionProps) {
  const renderVisualPattern = () => {
    if (question.type === 'pattern' && question.visual_data?.pattern) {
      const { pattern, colors } = question.visual_data;
      return (
        <div className="flex items-center justify-center gap-4 my-6 flex-wrap">
          {pattern.map((shape: string, idx: number) => {
            const color = colors[idx];
            const shapeClass = `w-16 h-16 flex items-center justify-center rounded-lg transition-all ${
              shape === '?'
                ? 'border-4 border-dashed border-gray-400 bg-gray-50'
                : 'shadow-md'
            }`;
            const colorMap: Record<string, string> = {
              blue: 'bg-blue-500',
              red: 'bg-red-500',
              green: 'bg-green-500',
              yellow: 'bg-yellow-500',
            };

            return (
              <div key={idx} className={shapeClass}>
                {shape === 'circle' && (
                  <Circle className={`w-12 h-12 fill-current ${colorMap[color] || 'text-blue-500'}`} />
                )}
                {shape === 'square' && (
                  <Square className={`w-12 h-12 fill-current ${colorMap[color] || 'text-red-500'}`} />
                )}
                {shape === 'triangle' && (
                  <Triangle className={`w-12 h-12 fill-current ${colorMap[color] || 'text-green-500'}`} />
                )}
                {shape === '?' && (
                  <span className="text-4xl font-bold text-gray-400">?</span>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    if (question.type === 'sequence' && question.visual_data?.sequence) {
      return (
        <div className="flex items-center justify-center gap-3 my-6 flex-wrap">
          {question.visual_data.sequence.map((num: number, idx: number) => (
            <div
              key={idx}
              className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg font-bold text-2xl"
            >
              {num}
            </div>
          ))}
          <div className="w-16 h-16 flex items-center justify-center border-4 border-dashed border-blue-400 bg-blue-50 rounded-lg">
            <span className="text-3xl font-bold text-blue-400">?</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {renderVisualPattern()}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isThisCorrect = index === question.correct_answer;

          let buttonClass = 'p-4 rounded-xl border-2 transition-all duration-300 text-left font-medium ';

          if (showFeedback) {
            if (isThisCorrect) {
              buttonClass += 'bg-green-100 border-green-500 text-green-800';
            } else if (isSelected && !isCorrect) {
              buttonClass += 'bg-red-100 border-red-500 text-red-800';
            } else {
              buttonClass += 'bg-gray-100 border-gray-300 text-gray-600';
            }
          } else {
            if (isSelected) {
              buttonClass += 'bg-blue-100 border-blue-500 text-blue-800 shadow-lg scale-105';
            } else {
              buttonClass += 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:scale-102';
            }
          }

          return (
            <button
              key={index}
              onClick={() => !showFeedback && onSelectAnswer(index)}
              disabled={showFeedback}
              className={buttonClass}
            >
              <span className="text-sm font-semibold text-gray-500 mr-2">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div
          className={`mt-6 p-4 rounded-lg ${
            isCorrect
              ? 'bg-green-50 border-2 border-green-500'
              : 'bg-red-50 border-2 border-red-500'
          }`}
        >
          <p
            className={`font-semibold mb-2 ${
              isCorrect ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {isCorrect ? '¡Correcto! 🎉' : 'Incorrecto'}
          </p>
          <p className="text-gray-700 text-sm">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
