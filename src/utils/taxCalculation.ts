export interface TaxBracket {
  min: number;
  max?: number;
  rate: number;
}

export function calculateTax(income: number, brackets: TaxBracket[]): number {
  let totalTax = 0;

  for (const bracket of brackets) {
    if (income > bracket.min) {
      let taxableIncome = 0;
      if (bracket.max !== undefined) {
        taxableIncome = Math.min(income - bracket.min, bracket.max - bracket.min);
      } else {
        taxableIncome = income - bracket.min;
      }
      totalTax += taxableIncome * bracket.rate;
    }
  }

  return totalTax;
}
