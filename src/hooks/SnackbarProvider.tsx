import { AlertColor } from '@mui/material';
import { createContext, ReactNode, useState } from 'react';

interface SnackbarContextProps {
    snackbar: boolean,
    setSnackbar: (snackbar: boolean) => void;
    snackbarMessage: string,
    setSnackbarMessage: (message: string) => void;
    snackbarSeverity: AlertColor;
    setSnackbarSeverity: (severity: AlertColor) => void;
}

const SnackbarContext = createContext<SnackbarContextProps>({
    snackbar: false,
    setSnackbar: () => { },
    snackbarMessage: '',
    setSnackbarMessage: () => { },
    snackbarSeverity: 'success',
    setSnackbarSeverity: () => { }
});

interface SnackbarProviderProps {
    children: ReactNode;
}

function SnackbarProvider({ children }: SnackbarProviderProps): JSX.Element {
    const [snackbar, setSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');

    const handleSnackBar = (snackbar: boolean): void => {
        setSnackbar(snackbar);
    }
    const handleSnackbarMessage = (snackbarMessage: string): void => {
        setSnackbarMessage(snackbarMessage);
    }
    const handleSnackbarSeverity = (snackbarSeverity: AlertColor): void => {
        setSnackbarSeverity(snackbarSeverity);
    }

    return (
        <SnackbarContext.Provider value={{
            snackbar: snackbar,
            setSnackbar: handleSnackBar,
            snackbarMessage: snackbarMessage,
            setSnackbarMessage: handleSnackbarMessage,
            snackbarSeverity: snackbarSeverity,
            setSnackbarSeverity: handleSnackbarSeverity
        }}>
            <>
                {children}
            </>
        </SnackbarContext.Provider>
    )

}


export { SnackbarContext };
export default SnackbarProvider;