import { useContext } from 'react';
import { SnackbarContext } from './hooks/SnackbarProvider';
import { Alert, AppBar, Backdrop, Box, CircularProgress, Divider, Link, Snackbar, Toolbar, Typography } from '@mui/material';
import { BackdropContext } from './hooks/BackdropProvider';
import DataTable from './pages/datagrid';

function App() {
  const { snackbar, setSnackbar, snackbarSeverity, snackbarMessage } =
    useContext(SnackbarContext);

  const { backdrop, setBackdrop, backdropMessage } =
    useContext(BackdropContext);
  return (
    <>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme: { zIndex: { drawer: number } }) =>
            theme.zIndex.drawer + 1_000_0,
        }}
        open={backdrop}
        onClick={() => setBackdrop(false)}
      >
        <CircularProgress color="inherit" />&nbsp; &nbsp;
        <h3>{backdropMessage}</h3>
      </Backdrop>
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
         <Box sx={{display:"flex"}}>
       
          <AppBar position="fixed" sx={{ top:0,backgroundColor: "#002244" }}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                CRM Dashboard
              </Typography>
            </Toolbar>
          </AppBar>


          <DataTable/>

        <Box sx={{ textAlign: "center", backgroundColor: "InfoBackground", position:"fixed",bottom:"0",width:"100%" }}>
          <Divider />
          <Box sx={{p:1, backgroundColor: "#002244", color: "whitesmoke" }}>
            <Typography variant='body2' sx={{ color: "whitesmoke" }}>© 2024 Barabari Collective Developers.</Typography>
            <Typography variant='body2'>Built By <Link sx={{ color: 'white',textDecoration:"underline",textDecorationColor:"yellow" }} href="https://github.com/hemanshu16">Hemanshu Faldu.</Link></Typography>
            <Typography variant='body2'>Want us to build something for you? <Link sx={{ color: 'white',textDecoration:"underline",textDecorationColor:"yellow" }} href="https://www.barabariproject.org/">Contact us</Link></Typography>
          </Box>
        </Box>
        </Box>
    
    </>);
}

export default App
