import { Problem } from '../lib/math';
import { MathProblem } from './MathProblem';

interface WorksheetProps {
  problems: Problem[];
  startNumber: number;
  fontSizeClass?: string;
}

export function Worksheet({ problems, startNumber, fontSizeClass = 'text-2xl' }: WorksheetProps) {
  // Pad the problems array to always have 6 items to ensure uniform 6-grid layout
  const paddedProblems = [...problems];
  while (paddedProblems.length < 6) {
    paddedProblems.push(null as any);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 grid-rows-6 sm:grid-rows-[repeat(3,minmax(0,1fr))] print:grid-rows-[repeat(3,minmax(0,1fr))] gap-6 print:gap-4 w-full h-full sm:min-h-[700px] max-w-4xl mx-auto flex-grow">
      {paddedProblems.map((prob, index) => (
        prob ? (
          <MathProblem 
            key={index} 
            number={startNumber + index} 
            equation={prob.equation} 
            fontSizeClass={fontSizeClass}
          />
        ) : (
          <div key={`empty-${index}`} className="hidden sm:flex print:flex flex-col p-5 bg-transparent rounded-xl border-2 border-transparent transition-all h-full min-h-[200px]">
             {/* Empty placeholder to strictly enforce the 6-grid layout on desktop and print */}
          </div>
        )
      ))}
    </div>
  );
}
