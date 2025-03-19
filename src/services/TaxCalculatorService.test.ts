import { getTaxBrackets } from './TaxCalculatorService';

describe('getTaxBrackets', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return tax brackets when response is ok', async () => {
    const mockData = {
      tax_brackets: [
        { min: 0, max: 47630, rate: 0.15 },
        { min: 47630, max: 95259, rate: 0.205 },
        { min: 95259, max: 147667, rate: 0.26 },
        { min: 147667, max: 210371, rate: 0.29 },
        { min: 210371, rate: 0.33 },
      ],
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const result = await getTaxBrackets(2021);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:5001/tax-calculator/tax-year/2021');
    expect(result).toEqual(mockData);
  });

  it('should throw an error when response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn(),
    });

    await expect(getTaxBrackets(2021)).rejects.toThrow('Failed to fetch tax brackets.');
  });
});
