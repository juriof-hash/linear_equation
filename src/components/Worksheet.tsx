import { Problem } from '../lib/math';
import { MathProblem } from './MathProblem';

interface WorksheetProps {
  problems: Problem[];
  startNumber: number;
  fontSizeClass?: string;
}

export function Worksheet({ problems, startNumber, fontSizeClass = 'text-2xl' }: WorksheetProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
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
