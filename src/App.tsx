import { useState, useEffect } from 'react';
import { Problem, ProblemType, problemGenerators } from './lib/math';
import { Worksheet } from './components/Worksheet';
import { AnswerKey } from './components/AnswerKey';
import { Printer, RefreshCcw, Settings, Minus, Plus, Loader2 } from 'lucide-react';

const PROBLEMS_PER_PAGE = 6;

const FONT_SIZES = [
  { label: '10pt', problem: 'text-[10pt]', answer: 'text-[8pt]' },
  { label: '12pt', problem: 'text-[12pt]', answer: 'text-[10pt]' },
  { label: '14pt', problem: 'text-[14pt]', answer: 'text-[12pt]' }
];

export default function App() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [types, setTypes] = useState<Record<ProblemType, boolean>>({
    integer: true,
    parentheses: false,
    fractionCoeff: false,
    fractionTerm: false,
  });
  
  const [startNum, setStartNum] = useState<number>(1);
  const [endNum, setEndNum] = useState<number>(12);
  const [showSettings, setShowSettings] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [fontSizeIndex, setFontSizeIndex] = useState(1);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState({ current: 0, total: 0, estimatedTimeMs: 0 });

  const totalPages = Math.ceil(problems.length / PROBLEMS_PER_PAGE);
  const currentPageProblems = problems.slice(
    (currentPage - 1) * PROBLEMS_PER_PAGE,
    currentPage * PROBLEMS_PER_PAGE
  );

  const handleGenerate = async () => {
    if (startNum > endNum) {
      alert('시작 번호는 끝 번호보다 작거나 같아야 해요!');
      return;
    }
    const selectedTypes = Object.entries(types)
      .filter(([_, isSelected]) => isSelected)
      .map(([type]) => type as ProblemType);
      
    if (selectedTypes.length === 0) {
      alert('어떤 문제를 풀지 선택해주세요!');
      return;
    }
    
    const count = endNum - startNum + 1;
    
    setIsGenerating(true);
    setGenerateProgress({ current: 0, total: count, estimatedTimeMs: 0 });

    const newProblems: Problem[] = [];
    const chunkSize = 2; 
    let generatedCount = 0;
    const startTime = performance.now();
    
    const generateChunk = () => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          for (let i = 0; i < chunkSize && generatedCount < count; i++) {
            const type = selectedTypes[Math.floor(Math.random() * selectedTypes.length)];
            newProblems.push(problemGenerators[type]());
            generatedCount++;
          }
          const elapsed = performance.now() - startTime;
          const estimatedTotal = (elapsed / generatedCount) * count;
          const remaining = estimatedTotal - elapsed;
          
          setGenerateProgress({ 
            current: generatedCount, 
            total: count, 
            estimatedTimeMs: Math.max(0, remaining) 
          });
          resolve();
        }, 15);
      });
    };

    while (generatedCount < count) {
      await generateChunk();
    }
    
    setProblems(newProblems);
    setCurrentPage(1);
    setShowSettings(false);
    setIsGenerating(false);
  };
  
  const handlePrint = () => {
    window.print();
  };

  const toggleType = (type: ProblemType) => {
    setTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-brand-500 text-white p-6 shadow-md mb-8 no-print">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-3xl font-heading font-bold">
            <span>🧮</span>
            <h1>일차방정식 마스터</h1>
          </div>
          {problems.length > 0 && !showSettings && (
            <button 
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-full font-bold transition-colors"
            >
              <Settings size={20} />
              새로운 문제 만들기
            </button>
          )}
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 w-full">
        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-t-8 border-brand-500 mb-12 no-print transform transition-all">
             <h2 className="text-2xl font-heading text-slate-800 mb-6 flex items-center gap-2">
               <span>🎯</span> 어떤 문제를 풀어볼까요?
             </h2>
             
             <div className="grid md:grid-cols-2 gap-8 mb-8">
               <div className="bg-brand-50 p-6 rounded-2xl">
                 <h3 className="font-bold text-lg text-slate-700 mb-4">문제 유형</h3>
                 <div className="space-y-3">
                   <label className="flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-colors cursor-pointer">
                     <input type="checkbox" className="w-5 h-5 accent-brand-500" 
                       checked={types.integer} onChange={() => toggleType('integer')} />
                     <span className="text-slate-700 font-medium">기본 정수 (가장 쉬워요!)</span>
                   </label>
                   <label className="flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-colors cursor-pointer">
                     <input type="checkbox" className="w-5 h-5 accent-brand-500" 
                       checked={types.parentheses} onChange={() => toggleType('parentheses')} />
                     <span className="text-slate-700 font-medium">괄호가 있는 문제</span>
                   </label>
                   <label className="flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-colors cursor-pointer">
                     <input type="checkbox" className="w-5 h-5 accent-brand-500" 
                       checked={types.fractionCoeff} onChange={() => toggleType('fractionCoeff')} />
                     <span className="text-slate-700 font-medium">분수가 있는 문제 (조금 어려워요)</span>
                   </label>
                   <label className="flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-colors cursor-pointer">
                     <input type="checkbox" className="w-5 h-5 accent-brand-500" 
                       checked={types.fractionTerm} onChange={() => toggleType('fractionTerm')} />
                     <span className="text-slate-700 font-medium">복잡한 분수 형태 (도전!)</span>
                   </label>
                 </div>
               </div>
               
               <div className="bg-accent-50 p-6 rounded-2xl flex flex-col justify-center">
                 <h3 className="font-bold text-lg text-slate-700 mb-4">문제 개수</h3>
                 <div className="flex items-center justify-center gap-4 text-xl">
                   <input type="number" value={startNum} min="1" onChange={e => setStartNum(parseInt(e.target.value) || 1)}
                     className="w-20 text-center py-2 px-3 rounded-xl border-2 border-slate-200 focus:border-accent-500 font-bold" />
                   <span className="text-slate-500">부터</span>
                   <input type="number" value={endNum} min="1" onChange={e => setEndNum(parseInt(e.target.value) || 1)}
                     className="w-20 text-center py-2 px-3 rounded-xl border-2 border-slate-200 focus:border-accent-500 font-bold" />
                   <span className="text-slate-500">까지</span>
                 </div>
                 <p className="text-center text-sm text-slate-500 mt-4">
                   총 {Math.max(0, endNum - startNum + 1)}문제가 만들어져요!
                 </p>
               </div>
             </div>
             
             <div className="flex justify-center h-[72px] items-center">
               {isGenerating ? (
                 <div className="flex flex-col items-center w-full max-w-md mx-auto animate-fade-in">
                   <div className="w-full bg-slate-200 rounded-full h-4 mb-2 overflow-hidden shadow-inner">
                     <div 
                       className="bg-accent-500 h-4 rounded-full transition-all duration-200 ease-out flex items-center justify-end pr-1" 
                       style={{ width: `${Math.max(5, (generateProgress.current / generateProgress.total) * 100)}%` }}
                     >
                       <div className="w-2 h-2 bg-white rounded-full bg-opacity-50 animate-pulse"></div>
                     </div>
                   </div>
                   <div className="flex justify-between w-full font-bold text-sm">
                     <span className="text-slate-600 flex items-center gap-2">
                       <Loader2 size={14} className="animate-spin" />
                       문제 생성 중... {generateProgress.current} / {generateProgress.total}
                     </span>
                     <span className="text-accent-600">
                       예상 남은 시간: {Math.max(0, Math.ceil(generateProgress.estimatedTimeMs / 1000))}초
                     </span>
                   </div>
                 </div>
               ) : (
                 <button 
                   onClick={handleGenerate}
                   className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white text-xl font-heading font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all focus:outline-none focus:ring-4 focus:ring-accent-300"
                 >
                   <RefreshCcw className="animate-spin-slow" />
                   재미있는 문제 만들기 시작!
                 </button>
               )}
             </div>
          </div>
        )}

        {/* Content Area */}
        {problems.length > 0 && !showSettings && (
          <div className="animate-fade-in">
            {/* Action Bar */}
            <div className="flex flex-wrap justify-center items-center gap-4 mb-8 no-print">
              <div className="flex items-center gap-2 bg-white px-4 py-2 flex-shrink-0 rounded-2xl shadow-md border-2 border-slate-100">
                <span className="text-slate-500 font-bold mr-1 hidden sm:inline">글씨 크기</span>
                <button 
                  onClick={() => setFontSizeIndex(i => Math.max(0, i - 1))}
                  disabled={fontSizeIndex === 0}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-50 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="font-bold text-slate-700 w-20 text-center">
                  {FONT_SIZES[fontSizeIndex].label}
                </span>
                <button 
                  onClick={() => setFontSizeIndex(i => Math.min(FONT_SIZES.length - 1, i + 1))}
                  disabled={fontSizeIndex === FONT_SIZES.length - 1}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-50 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-md"
              >
                <Printer size={20} />
                종이로 인쇄하기
              </button>
            </div>

            {/* Print Friendly Output */}
            <div className="hidden print:block space-y-0">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const pageStart = (pageNum - 1) * PROBLEMS_PER_PAGE;
                const pageProblems = problems.slice(pageStart, pageStart + PROBLEMS_PER_PAGE);
                
                return (
                  <div key={`print-page-${pageNum}`} className={`print-page-break h-screen print:h-[240mm] flex flex-col pt-8 pb-8 px-8 box-border`}>
                    <div className="text-center mb-6 border-b-2 border-slate-800 pb-4 shrink-0">
                      <h2 className="text-3xl font-heading font-bold text-slate-800">일차방정식 연습장</h2>
                      <div className="flex justify-between mt-4 font-bold text-lg text-slate-600">
                        <span>학년/반: __________________</span>
                        <span>이름: __________________</span>
                        <span>( {pageNum} / {totalPages} )쪽</span>
                      </div>
                    </div>
                    
                    <div className="flex-grow min-h-0">
                      <Worksheet 
                        problems={pageProblems} 
                        startNumber={startNum + pageStart} 
                        fontSizeClass={FONT_SIZES[fontSizeIndex].problem}
                      />
                    </div>
                  </div>
                );
              })}
              
              {/* Answer Key Print Page */}
              <div className="flex flex-col pt-8 pb-8 px-8 box-border h-auto">
                 <div className="text-center mb-6 border-b-2 border-slate-800 pb-4 shrink-0">
                   <h2 className="text-3xl font-heading font-bold text-slate-800">일차방정식 정답지</h2>
                 </div>
                 <div className="flex-grow min-h-0">
                   <AnswerKey 
                     problems={problems} 
                     startNumber={startNum} 
                     fontSizeClass={FONT_SIZES[fontSizeIndex].answer}
                   />
                 </div>
              </div>
            </div>

            {/* Interactive Screen Output */}
            <div className="print:hidden space-y-8">
               <div className="text-center">
                 <h2 className="text-3xl font-heading font-bold text-brand-600 mb-2">
                   {currentPage <= totalPages ? '풀어보자! 아자아자! 🚀' : '✨ 정답 확인 ✨'}
                 </h2>
                 <p className="text-slate-500 font-bold mb-6">
                   {currentPage}쪽 (전체 {totalPages + 1}쪽)
                 </p>
               </div>
               
               {currentPage <= totalPages ? (
                 <Worksheet 
                   problems={currentPageProblems} 
                   startNumber={startNum + (currentPage - 1) * PROBLEMS_PER_PAGE} 
                   fontSizeClass={FONT_SIZES[fontSizeIndex].problem}
                 />
               ) : (
                 <div className="animate-fade-in">
                   <AnswerKey 
                     problems={problems} 
                     startNumber={startNum} 
                     fontSizeClass={FONT_SIZES[fontSizeIndex].answer}
                   />
                 </div>
               )}

               <div className="flex justify-center items-center gap-6 mt-12 bg-white inline-flex p-2 rounded-full shadow-lg mx-auto w-max max-w-full">
                 <button 
                   disabled={currentPage === 1}
                   onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
                   className="px-6 py-3 rounded-full font-bold bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-700"
                 >
                   &lt; 이전
                 </button>
                 <span className="font-heading text-lg font-bold text-brand-600">
                   {currentPage} / {totalPages + 1}
                 </span>
                 <button 
                   disabled={currentPage === totalPages + 1}
                   onClick={() => setCurrentPage(c => Math.min(totalPages + 1, c + 1))}
                   className="px-6 py-3 rounded-full font-bold bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-700"
                 >
                   다음 &gt;
                 </button>
               </div>
            </div>
            
          </div>
        )}
      </main>
    </div>
  );
}

