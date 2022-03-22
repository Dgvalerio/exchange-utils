import React from 'react';
import ReactDOM from 'react-dom';

import { createTheme, CssBaseline } from '@mui/material';
import { ThemeProvider as MuiProvider } from '@mui/material/styles';

import App from './App';

const theme = createTheme({ palette: { mode: 'dark' } });

ReactDOM.render(
  <React.StrictMode>
    <MuiProvider theme={theme}>
      <CssBaseline />
      <App />
    </MuiProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
