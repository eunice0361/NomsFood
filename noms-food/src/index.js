// index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Update for React 18
import './index.css';
import App from './App'; // Main App component that includes routing
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#477368', // Adjust primary color to your preference
    },
    secondary: {
      main: '#F7F4ED', // Adjust secondary color to your preference
    },
  },
  typography: {
    fontFamily: [
      'Roboto', // You can specify your preferred font family here
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <div style={{ backgroundColor: theme.palette.secondary.main, minHeight: '100vh' }}>
          <App />
        </div>
      </ThemeProvider>

    </BrowserRouter>
  </React.StrictMode>
);
