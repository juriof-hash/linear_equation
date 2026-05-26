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
  num /= common; 
  den /= common;
  if (den < 0) { num *= -1; den *= -1; }
  if (den === 1) return `${num}`;
  return `${num < 0 ? '-' : ''}\\frac{${Math.abs(num)}}{${den}}`;
};

export const formatCoefficient = (n: number, term = 'x') => {
  if (n === 0) return '';
  if (n === 1) return term;
  if (n === -1) return `-${term}`;
  return `${n}${term}`;
};

export const problemGenerators: Record<ProblemType, () => Problem> = {
  integer: () => {
    const x = getRandomInt(-15, 15);
    let a: number, c: number;
    do { 
      a = getRandomInt(-10, 10); 
      c = getRandomInt(-10, 10); 
    } while (a === c || a === 0 || c === 0);
    const b = getRandomInt(-10, 10);
    const d = a * x + b - c * x;
    
    const left = `${formatCoefficient(a)} ${formatSign(b)}`.replace(/\+ -/g, '- ').trim();
    const right = `${formatCoefficient(c)} ${formatSign(d)}`.replace(/\+ -/g, '- ').trim();
    return { equation: `${left} = ${right}`, answer: { num: x, den: 1 } };
  },

  parentheses: () => {
    const x = getRandomInt(-10, 10);
    const a = getRandomInt(2, 5) * (Math.random() > 0.5 ? 1 : -1);
    const b = getRandomInt(1, 4);
    const d = getRandomInt(1, 10);
    if (a * b === d) return problemGenerators.parentheses();

    const c = getRandomInt(-8, 8);
    const e = a * (b * x + c) - d * x;

    const left = `${a}(${formatCoefficient(b)} ${formatSign(c)})`.replace(/\+ -/g, '- ');
    const right = `${formatCoefficient(d)} ${formatSign(e)}`.replace(/\+ -/g, '- ').trim();
    return { equation: `${left} = ${right}`, answer: { num: x, den: 1 } };
  },
  
  fractionCoeff: () => {
    const x = getRandomInt(-12, 12);
    const b = getRandomInt(2, 5); // den1
    const a = getRandomInt(1, 10); // num1
    const e = getRandomInt(2, 5); // den2
    const d = getRandomInt(1, 10); // num2
    if (a * e === d * b) return problemGenerators.fractionCoeff();

    const c = getRandomInt(-5, 5);
    const f_num = a * x * e + c * b * e - d * x * b;
    const f_den = b * e;
    
    const left = `\\frac{${a}}{${b}}x ${formatSign(c)}`.replace(/\+ -/g, '- ');

    const f_value = f_num / f_den;
    let right_constant = '';
    if (f_value !== 0) {
      const f_abs_string = formatFraction(Math.abs(f_num), f_den);
      right_constant = f_value > 0 ? `+ ${f_abs_string}` : `- ${f_abs_string}`;
    }
    
    const right = `\\frac{${d}}{${e}}x ${right_constant}`.replace(/\s\s+/g, ' ').replace(/\+ -/g, '- ').trim();
    return { equation: `${left} = ${right}`, answer: { num: x, den: 1 } };
  },
  
  fractionTerm: () => {
    const x = getRandomInt(-10, 10);
    const V = getRandomInt(-5, 5);

    const a = getRandomInt(1, 5);
    const c = getRandomInt(2, 6);
    const b = V * c - a * x;

    const d = getRandomInt(1, 5);
    const f = getRandomInt(2, 6);
    if (c === f) return problemGenerators.fractionTerm();
    if (a * f === d * c) return problemGenerators.fractionTerm();
    const e = V * f - d * x;
    
    const left = `\\frac{${formatCoefficient(a)} ${formatSign(b)}}{${c}}`.replace(/\+ -/g, '- ').trim();
    const right = `\\frac{${formatCoefficient(d)} ${formatSign(e)}}{${f}}`.replace(/\+ -/g, '- ').trim();
    return { equation: `${left} = ${right}`, answer: { num: x, den: 1 } };
  }
};
