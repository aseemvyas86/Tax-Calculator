/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaxCalculator from './TaxCalculator';
import * as taxCalculation from '../utils/taxCalculation';
import * as TaxCalculatorService from '../services/TaxCalculatorService';

jest.mock('../utils/taxCalculation');
jest.mock('../services/TaxCalculatorService');

describe('TaxCalculator', () => {
  const mockTaxBrackets = [
    { min: 0, max: 50000, rate: 0.15 },
    { min: 50000, max: 100000, rate: 0.25 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    (TaxCalculatorService.getTaxBrackets as jest.Mock).mockResolvedValue({
      tax_brackets: mockTaxBrackets
    });
    
    (taxCalculation.calculateTax as jest.Mock).mockReturnValue(7500);
  });

  it('renders initial form elements correctly', () => {
    render(<TaxCalculator />);
    expect(screen.getByText('Income Tax Calculator')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Annual Income (in $)' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Tax Year' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Calculate Tax' })).toBeInTheDocument();
  });

  it('updates income input value', () => {
    render(<TaxCalculator />);
  
  const incomeInput = screen.getByRole('textbox', { name: 'Annual Income (in $)' }) as HTMLInputElement;
  fireEvent.change(incomeInput, { target: { value: '100,000' } });
  
  expect(incomeInput.value).toBe('100,000');
  });

  it('updates tax year selection', () => {
    render(<TaxCalculator />);
    
    const yearSelect = screen.getByRole('combobox', { name: 'Tax Year' });
    fireEvent.mouseDown(yearSelect);
    
    const option = screen.getByText('2022');
    fireEvent.click(option);
    
    expect(screen.getByDisplayValue('2022')).toBeInTheDocument();
  });

  it('calculates tax successfully', async () => {
    render(<TaxCalculator />);
    
    const incomeInput = screen.getByRole('textbox', { name: 'Annual Income (in $)' });
    const submitButton = screen.getByRole('button', { name: 'Calculate Tax' });
    
    fireEvent.change(incomeInput, { target: { value: '50000' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Total Tax:\s*\$7500\.00/)).toBeInTheDocument();
    });
    
    expect(taxCalculation.calculateTax).toHaveBeenCalledWith(50000, mockTaxBrackets);
  });

  it('displays error when tax brackets fetch fails', async () => {
    (TaxCalculatorService.getTaxBrackets as jest.Mock).mockRejectedValue(
      new Error('Fetch failed')
    );
    
    render(<TaxCalculator />);
    
    const incomeInput = screen.getByRole('textbox', { name: 'Annual Income (in $)' });
    fireEvent.change(incomeInput, { target: { value: '50000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Calculate Tax' }));
    
    await waitFor(() => {
      expect(screen.getByText(
        'Error fetching tax data. Please try again.'
      )).toBeInTheDocument();
    });
  });

  it('disables button and shows loading state during calculation', async () => {
    render(<TaxCalculator />);
    
    const submitButton = screen.getByRole('button', { name: 'Calculate Tax' });
    const incomeInput = screen.getByRole('textbox', { name: 'Annual Income (in $)' });
    
    fireEvent.change(incomeInput, { target: { value: '50000' } });
    fireEvent.click(submitButton);
    
    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});