export type ProblemType = 'integer' | 'parentheses' | 'fractionCoeff' | 'fractionTerm';

export interface Answer {
  num: number;
  den: number;
}

export interface Problem {
  equation: string;
  answer: Answer;
}

export const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const getGcd = (a: number, b: number): number => b === 0 ? a : getGcd(b, a % b);

export const formatSign = (n: number) => (n === 0) ? '' : (n > 0 ? `+ ${n}` : `- ${Math.abs(n)}`);

export const formatFraction = (num: number, den: number) => {
  if (den === 0) return 'Error'; 
  if (num === 0) return '0';
  
  const common = getGcd(Math.abs(num), Math.abs(den));
  let finalNum = num / common;
  let finalDen = den / common;
  
  if (finalDen < 0) { 
    finalNum *= -1; 
    finalDen *= -1; 
  }
  if (finalDen === 1) return `${finalNum}`;
  return `${finalNum < 0 ? '-' : ''}\\frac{${Math.abs(finalNum)}}{${finalDen}}`;
};

// 정답 객체를 기약분수로 변환해주는 헬퍼 함수
export const makeValidAnswer = (num: number, den: number): Answer => {
  if (den === 0) throw new Error("Division by zero in answer calculation");
  const common = getGcd(Math.abs(num), Math.abs(den));
  let finalNum = num / common;
  let finalDen = den / common;
  if (finalDen < 0) {
    finalNum *= -1;
    finalDen *= -1;
  }
  return { num: finalNum, den: finalDen };
};

export const formatCoefficient = (n: number, term = 'x') => {
  if (n === 0) return '';
  if (n === 1) return term;
  if (n === -1) return `-${term}`;
  return `${n}${term}`;
};

export const problemGenerators: Record<ProblemType, () => Problem> = {
  // 1. 정수 계수 문제 (정답은 분수 가능) : ax + b = cx + d
  integer: () => {
    let a = 0, c = 0, b = 0, d = 0;
    while (true) {
      a = getRandomInt(-10, 10);
      c = getRandomInt(-10, 10);
      b = getRandomInt(-15, 15);
      d = getRandomInt(-15, 15);
      // x의 계수가 0이 되지 않고, 의미 없는 식(예: b = d)이 되지 않도록 가드
      if (a !== c && b !== d && a !== 0 && c !== 0) break;
    }
    
    // (a - c)x = d - b  ->  x = (d - b) / (a - c)
    const ansNum = d - b;
    const ansDen = a - c;

    const left = `${formatCoefficient(a)} ${formatSign(b)}`.trim();
    const right = `${formatCoefficient(c)} ${formatSign(d)}`.trim();
    return { 
      equation: `${left} = ${right}`, 
      answer: makeValidAnswer(ansNum, ansDen) 
    };
  },

  // 2. 괄호가 있는 문제 : a(bx + c) = dx + e
  parentheses: () => {
    let a = 0, b = 0, c = 0, d = 0, e = 0;
    while (true) {
      a = getRandomInt(2, 5) * (Math.random() > 0.5 ? 1 : -1);
      b = getRandomInt(2, 5); // 1x는 괄호 의미가 적으므로 2부터 시작하도록 권장
      c = getRandomInt(-8, 8);
      d = getRandomInt(-10, 10);
      e = getRandomInt(-15, 15);
      
      // abx + ac = dx + e -> (ab - d)x = e - ac
      if (a * b !== d && c !== 0 && d !== 0) break;
    }

    const ansNum = e - (a * c);
    const ansDen = (a * b) - d;

    const left = `${a}(${formatCoefficient(b)} ${formatSign(c)})`.trim();
    const right = `${formatCoefficient(d)} ${formatSign(e)}`.trim();
    return { 
      equation: `${left} = ${right}`, 
      answer: makeValidAnswer(ansNum, ansDen) 
    };
  },
  
  // 3. 분수 계수 문제 : (a/b)x + c = (d/e)x + f
  fractionCoeff: () => {
    let a = 0, b = 0, d = 0, e = 0, c = 0, f = 0;
    
    while (true) {
      b = getRandomInt(2, 6); 
      a = getRandomInt(1, 10); 
      e = getRandomInt(2, 6); 
      d = getRandomInt(1, 10); 
      
      // [조건 추가] 문제에 3/3x 나 4/2x 같은 불필요한 표현이 나오지 않도록 기약분수만 허용
      if (getGcd(a, b) !== 1 || getGcd(d, e) !== 1) continue;
      // 두 계수가 같아서 x가 사라지는 경우 방지
      if (a * e === d * b) continue;
      
      c = getRandomInt(-5, 5);
      f = getRandomInt(-5, 5);
      if (c !== f) break;
    }

    // 통분 계산: (a/b - d/e)x = f - c  ->  ((ae - bd) / be)x = f - c
    const ansNum = (f - c) * (b * e);
    const ansDen = (a * e) - (d * b);
    
    const left = `\\frac{${a}}{${b}}x ${formatSign(c)}`.trim();
    const right = `\\frac{${d}}{${e}}x ${formatSign(f)}`.trim();
    
    return { 
      equation: `${left} = ${right}`, 
      answer: makeValidAnswer(ansNum, ansDen) 
    };
  },
  
  // 4. 분수 형태 식 문제 : (ax + b)/c = (dx + e)/f
  fractionTerm: () => {
    let a = 0, c = 0, b = 0, d = 0, f = 0, e = 0;
    
    while (true) {
      a = getRandomInt(1, 5);
      c = getRandomInt(2, 6);
      b = getRandomInt(-8, 8);
      
      d = getRandomInt(1, 5);
      f = getRandomInt(2, 6);
      e = getRandomInt(-8, 8);
      
      // 분자 안에서도 기약분수 형태처럼 깔끔하게 떨어지도록 유도 (필수 조건은 아님)
      if (getGcd(Math.abs(a), c) === c || getGcd(Math.abs(d), f) === f) continue;
      
      // 대각선 곱: f(ax + b) = c(dx + e) -> fax + fb = cdx + ce -> (fa - cd)x = ce - fb
      if (f * a !== c * d && c !== f) break;
    }
    
    const ansNum = (c * e) - (f * b);
    const ansDen = (f * a) - (c * d);
    
    const leftNumerator = `${formatCoefficient(a)} ${formatSign(b)}`.trim();
    const rightNumerator = `${formatCoefficient(d)} ${formatSign(e)}`.trim();
    
    const left = `\\frac{${leftNumerator}}{${c}}`;
    const right = `\\frac{${rightNumerator}}{${f}}`;
    
    return { 
      equation: `${left} = ${right}`, 
      answer: makeValidAnswer(ansNum, ansDen) 
    };
  }
};
