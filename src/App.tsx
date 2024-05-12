import { useContext } from 'react';
import { SnackbarContext } from './hooks/SnackbarProvider';
import Dashboard from './pages/dashboard'
import { Alert, AppBar, BottomNavigation, BottomNavigationAction, Box, Button, Divider, IconButton, Link, Snackbar, Toolbar, Typography } from '@mui/material';

function App() {
  const { snackbar, setSnackbar, snackbarSeverity, snackbarMessage } =
    useContext(SnackbarContext);
  return (
    <>
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
      <Box>
        <Box>
          <AppBar position="static" sx={{backgroundColor:"#00a3cc"}}>
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
                CRM Dashboard
              </Typography>
            </Toolbar>
          </AppBar>


          <Dashboard />
        </Box>
        
          <Box sx={{textAlign:"center",backgroundColor:"InfoBackground",mt:1.3}}>
            <Divider/>
        <Box sx={{p:1,backgroundColor:"#00a3cc",color:"whitesmoke"}}>
          <Typography variant='body2' sx={{color:"whitesmoke"}}>© 2024 Barabari Collective Developers.</Typography>
          <Typography variant='body2'>Built By <Link sx={{color:'black'}} href="https://github.com/hemanshu16">Hemanshu Faldu.</Link></Typography>
          <Typography variant='body2'>Want us to build something for you? <Link sx={{color:'black'}} href="https://www.barabariproject.org/">Contact us</Link></Typography>
        </Box>
        </Box>
      </Box>
    </>);
}

export default App
