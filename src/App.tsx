import { useContext } from 'react';
import { SnackbarContext } from './hooks/SnackbarProvider';
import Dashboard from './pages/dashboard'
import { Alert, AppBar, Box, Button, IconButton, Snackbar, Toolbar, Typography } from '@mui/material';

function App() {
  const { snackbar, setSnackbar, snackbarSeverity, snackbarMessage } =
    useContext(SnackbarContext);
  return (
    <>
     <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
        
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
             WebSite Name
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
      <Snackbar
        open={snackbar}
        autoHideDuration={5000}
        onClose={() => setSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dashboard />
    </>);
}

export default App
