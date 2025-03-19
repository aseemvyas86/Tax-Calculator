export function generateTaxYears(startYear: number, endYear: number): number[] {
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  }
  