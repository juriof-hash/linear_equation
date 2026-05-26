import { Problem } from '../lib/math';
import { MathProblem } from './MathProblem';

interface WorksheetProps {
  problems: Problem[];
  startNumber: number;
}

export function Worksheet({ problems, startNumber }: WorksheetProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
      {problems.map((prob, index) => (
        <MathProblem 
          key={index} 
          number={startNumber + index} 
          equation={prob.equation} 
        />
      ))}
    </div>
  );
}
