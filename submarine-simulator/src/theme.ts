import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#FF5A5F' },
    secondary: { main: '#00A699' },
    background: { default: '#F7F7F7', paper: '#FFFFFF' },
    text: { primary: '#484848' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { 
      fontSize: '2.5rem', 
      fontWeight: 700,
      color: '#FF5A5F', // Matching the primary color
    },
    h4: { 
      fontSize: '1.5rem', 
      fontWeight: 600,
    },
    h6: { 
      fontSize: '1.1rem', 
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { 
          borderRadius: 20,
          textTransform: 'none',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: { 
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: '#00A699',
          '&.Mui-checked': {
            color: '#00A699',
          },
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            backgroundColor: '#00A699',
            color: '#FFFFFF',
          },
        },
      },
    },
  },
});

export default theme;