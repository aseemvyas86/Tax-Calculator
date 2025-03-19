import { calculateTax, TaxBracket } from './taxCalculation';

describe('calculateTax', () => {
  it('calculates tax for income within a single bracket', () => {
    const brackets: TaxBracket[] = [
      { min: 0, max: 20000, rate: 0.1 },
      { min: 20000, max: 40000, rate: 0.2 },
    ];
    const income = 15000;
    const tax = calculateTax(income, brackets);
    expect(tax).toBeCloseTo(1500, 2);
  });

  it('calculates tax correctly when income spans multiple brackets', () => {
    const brackets: TaxBracket[] = [
      { min: 0, max: 20000, rate: 0.0 },    
      { min: 20000, max: 40000, rate: 0.1 },
      { min: 40000, max: 60000, rate: 0.2 }, 
      { min: 60000, rate: 0.3 },             
    ];
    const income = 50000;
    const tax = calculateTax(income, brackets);
    expect(tax).toBeCloseTo(4000, 2);
  });

  it('calculates tax correctly when income exceeds all defined brackets', () => {
    const brackets: TaxBracket[] = [
      { min: 0, max: 47630, rate: 0.15 },
      { min: 47630, max: 95259, rate: 0.205 },
      { min: 95259, max: 147667, rate: 0.26 },
      { min: 147667, max: 210371, rate: 0.29 },
      { min: 210371, rate: 0.33 },
    ];
    const income = 250000;
    const tax = calculateTax(income, brackets);
    const roundedTax = Math.round(tax * 100) / 100;
    expect(roundedTax).toBe(61796.26);
  });
});
