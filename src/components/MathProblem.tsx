import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

interface MathProblemProps {
  equation: string;
  number: number;
}

export function MathProblem({ equation, number }: MathProblemProps) {
  return (
    <div className="flex items-start gap-4 p-4 min-h-[120px] bg-white rounded-xl border-2 border-brand-100 shadow-sm print:border-slate-300 print:shadow-none print-avoid-break transition-all hover:border-brand-500 hover:shadow-md">
      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-brand-100 text-brand-600 font-heading text-xl font-bold print:bg-transparent print:text-slate-800 print:border-2 print:border-slate-800">
        {number}
      </div>
      <div className="flex-grow pt-1 text-2xl tracking-wider text-slate-800">
        <InlineMath math={equation} />
      </div>
    </div>
  );
}
