import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7c5cff'
    },
    secondary: {
      main: '#19d3da'
    },
    background: {
      default: '#08111f',
      paper: 'rgba(13, 24, 43, 0.86)'
    }
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontWeight: 800
    },
    h2: {
      fontWeight: 800
    },
    h3: {
      fontWeight: 700
    },
    button: {
      textTransform: 'none',
      fontWeight: 700
    }
  },
  shape: {
    borderRadius: 18
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(18px)'
        }
      }
    }
  }
});

export default theme;
