import { Problem, formatFraction } from '../lib/math';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface AnswerKeyProps {
  problems: Problem[];
  startNumber: number;
  fontSizeClass?: string;
}

export function AnswerKey({ problems, startNumber, fontSizeClass = 'text-lg' }: AnswerKeyProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-6 p-4 bg-success-50 rounded-xl border-2 border-success-200 print:bg-transparent print:border-none print:p-0 print:mt-2 print-avoid-break">
      <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 print:grid-cols-6 gap-x-4 gap-y-4 text-slate-700 ${fontSizeClass}`}>
        {problems.map((prob, index) => {
          const ansString = `${formatFraction(prob.answer.num, prob.answer.den)}`;
          return (
            <div key={index} className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="font-bold text-success-600 print:text-slate-800">
                [{startNumber + index}]
              </span>
              <span>
                <InlineMath math={ansString} />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
