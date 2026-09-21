import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: 'hsl(212, 85%, 45%)',
      light: 'hsl(212, 85%, 55%)',
      dark: 'hsl(212, 85%, 35%)',
      contrastText: '#ffffff',
    },
    success: { main: 'hsl(142, 70%, 40%)', contrastText: '#ffffff' },
    warning: { main: 'hsl(38, 92%, 45%)', contrastText: '#ffffff' },
    error: { main: 'hsl(0, 75%, 55%)', contrastText: '#ffffff' },
    background: {
      default: 'hsl(220, 20%, 98%)',
      paper: '#ffffff',
    },
    text: {
      primary: 'hsl(215, 25%, 15%)',
      secondary: 'hsl(215, 15%, 45%)',
    },
    divider: 'hsl(215, 15%, 88%)',
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily:
      "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 8 } },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: '1px solid hsl(215, 15%, 88%)',
          borderRadius: 12,
          boxShadow:
            '0 1px 2px hsl(215 25% 15% / 0.04), 0 1px 3px hsl(215 25% 15% / 0.06)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: { rounded: { borderRadius: 12 } },
    },
    MuiListItem: {
      styleOverrides: { root: { paddingTop: 12, paddingBottom: 12 } },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
    },
  },
});
