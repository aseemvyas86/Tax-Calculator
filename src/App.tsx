import React from 'react';
import { Container, Box } from '@mui/material';
import TaxCalculator from './components/TaxCalculator';

const App: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <TaxCalculator />
      </Box>
    </Container>
  );
};

export default App;
