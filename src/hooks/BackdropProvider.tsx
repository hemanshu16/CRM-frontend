import { createContext, ReactNode, useState } from 'react';

interface BackDropContextProps {
    backdrop: boolean,
    setBackdrop: (loading: boolean) => void;
    backdropMessage: string,
    setBackdropMessage: (message: string) => void;
}

const BackdropContext = createContext<BackDropContextProps>({
    backdrop: false,
    setBackdrop: () => { },
    backdropMessage: '',
    setBackdropMessage: () => { }
});

interface BackdropProviderProps {
    children: ReactNode;
}

function BackdropProvider({ children }: BackdropProviderProps): JSX.Element {
    const [backdrop, setBackdrop] = useState(false);
    const [backdropMessage, setBackdropMessage] = useState('');

    const handleBackdrop = (backdrop: boolean): void => {
        setBackdrop(backdrop);
    }
    const handleBackdropMessage = (backdropMessage: string): void => {
        setBackdropMessage(backdropMessage);
    }

    return (
        <BackdropContext.Provider value={{
            backdrop,
            backdropMessage,
            setBackdropMessage: handleBackdropMessage,
            setBackdrop: handleBackdrop
        }}>
            <>
                {children}
            </>
        </BackdropContext.Provider>
    );
}

export { BackdropContext };
export default BackdropProvider;