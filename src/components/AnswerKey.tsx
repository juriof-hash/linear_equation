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
      <div className="hidden print:block font-bold text-slate-800 mb-2 font-heading">✨ 정답 확인 ✨</div>
      <div className="print:hidden text-center text-success-600 font-heading font-bold mb-4 text-xl">✨ 정답 확인 ✨</div>
      <div className={`flex flex-wrap justify-center print:justify-start gap-x-6 gap-y-3 text-slate-700 ${fontSizeClass}`}>
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
