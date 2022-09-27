export type Operator = '-' | '+' | '*' | '/' | '(' | ')';

export function isOperator(token: string): token is Operator {
  return token === '-' || token === '+' || token === '*' || token === '/' || token === '(' || token === ')';
}