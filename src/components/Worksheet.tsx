import { Problem } from '../lib/math';
import { MathProblem } from './MathProblem';

interface WorksheetProps {
  problems: Problem[];
  startNumber: number;
  fontSizeClass?: string;
}

export function Worksheet({ problems, startNumber, fontSizeClass = 'text-2xl' }: WorksheetProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 sm:grid-rows-3 print:grid-rows-3 gap-6 print:gap-4 w-full h-auto sm:h-[800px] print:h-full max-w-4xl mx-auto">
      {problems.map((prob, index) => (
        <MathProblem 
          key={index} 
          number={startNumber + index} 
          equation={prob.equation} 
          fontSizeClass={fontSizeClass}
        />
      ))}
    </div>
  );
}
