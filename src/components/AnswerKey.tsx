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
    <div className="w-full max-w-4xl mx-auto mt-12 p-8 bg-success-100 rounded-2xl border-4 border-success-500 print:bg-transparent print:border-2 print:border-slate-800 print:mt-8 print-avoid-break">
      <h2 className="text-3xl text-success-600 font-heading mb-6 text-center print:text-slate-800">
        ✨ 딩동댕! 정답 확인 ✨
      </h2>
      <div className={`grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 text-slate-700 ${fontSizeClass}`}>
        {problems.map((prob, index) => {
          const ansString = `x = ${formatFraction(prob.answer.num, prob.answer.den)}`;
          return (
            <div key={index} className="flex items-center gap-3">
              <span className="font-bold text-success-600 print:text-slate-800 bg-white print:bg-transparent px-2 py-1 rounded-md min-w-[3rem] text-center">
                {startNumber + index}.
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
