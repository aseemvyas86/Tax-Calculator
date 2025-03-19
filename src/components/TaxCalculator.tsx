import React, { useState, useCallback, useMemo } from 'react';
import {
  Container,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from '@mui/material';
import { calculateTax, TaxBracket }  from '../utils/taxCalculation';
import { getTaxBrackets } from '../services/TaxCalculatorService';
import { TAX_YEAR_START, TAX_YEAR_END } from '../constants';
import { generateTaxYears } from '../utils/dateUtils';
import NumberFormatCustom from '../utils/numberFormatCustom';

const TaxCalculator: React.FC = () => {
  const [income, setIncome] = useState<string>('0');
  const [year, setYear] = useState<number>(2021);
  const [taxResult, setTaxResult] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Generate tax years dynamically.
  const taxYears = generateTaxYears(TAX_YEAR_START, TAX_YEAR_END);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setTaxResult(null);
      setLoading(true);

      if (year < TAX_YEAR_START || year > TAX_YEAR_END) {
        setError(`Supported tax years are ${TAX_YEAR_START}-${TAX_YEAR_END}.`);
        setLoading(false);
        return;
      }

      try {
        const incomeNumber = parseFloat(income.replace(/,/g, ''));
        const data = await getTaxBrackets(year);
        const brackets: TaxBracket[] = data.tax_brackets;
        const totalTax = calculateTax(incomeNumber, brackets);
        setTaxResult(totalTax);
      } catch (err) {
        setError('Error fetching tax data. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [income, year]
  );

  const formattedTaxResult = useMemo(() => {
    return taxResult !== null ? `$${taxResult.toFixed(2)}` : '';
  }, [taxResult]);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Income Tax Calculator
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Annual Income (in $)"
          type="text"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          fullWidth
          margin="normal"
          required
          InputLabelProps={{ shrink: true }}
          InputProps={{
            inputComponent: NumberFormatCustom as any
          }}
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="year-label">Tax Year</InputLabel>
          <Select
            labelId="year-label"
            id="year"
            value={year}
            label="Tax Year"
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {taxYears.map((yr) => (
              <MenuItem key={yr} value={yr}>
                {yr}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Calculate Tax'}
        </Button>
      </form>
      {taxResult !== null && (
        <Typography
          variant="h5"
          align="center"
          sx={{
            mt: 3,
            p: 2,
            bgcolor: '#e9f7ef',
            border: '1px solid #c3e6cb',
            borderRadius: 1,
            color: '#155724',
          }}
        >
          Total Tax: {formattedTaxResult}
        </Typography>
      )}
      {error && (
        <Typography
          variant="h6"
          align="center"
          sx={{
            mt: 3,
            p: 2,
            bgcolor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: 1,
            color: '#721c24',
          }}
        >
          {error}
        </Typography>
      )}
    </Container>
  );
};

export default TaxCalculator;
