import {URL} from  '../constants'

export async function getTaxBrackets(year: number): Promise<{ tax_brackets: any[] }> {
    const response = await fetch(`${URL}/${year}`);
  
    if (!response.ok) {
      throw new Error('Failed to fetch tax brackets.');
    }
  
    return response.json();
  }
  