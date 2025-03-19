export async function getTaxBrackets(year: number): Promise<{ tax_brackets: any[] }> {
    const response = await fetch(`http://localhost:5001/tax-calculator/tax-year/${year}`);
  
    if (!response.ok) {
      throw new Error('Failed to fetch tax brackets.');
    }
  
    return response.json();
  }
  