import { useRef, useState, useEffect, useContext, createContext, ReactNode } from "react";
import { CustomToastMessage } from "../components/ErrorMonitoringComp/CustomToastMessage";

type ErrorContextType = {
    showError: boolean;
    setShowError: (value: boolean) => void;
    errorMessage: string | undefined;
    setErrorMessage: (value: string) => void;
    errorTitle: string | undefined;
    setErrorTitle: (value: string) => void;
};

const ErrorContext = createContext<ErrorContextType>({
    showError: false,
    setShowError: () => { },
    errorMessage: undefined,
    setErrorMessage: () => { },
    errorTitle: undefined,
    setErrorTitle: () => { }
});

const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children, }: { children: ReactNode; }) => {
    const [showError, setShowError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [errorTitle, setErrorTitle] = useState<string | undefined>();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowError(false);
        }, 5000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [showError]);

    const results: ErrorContextType = {
        showError,
        setShowError,
        errorMessage,
        setErrorMessage,
        errorTitle,
        setErrorTitle
    };

    return (
        <ErrorContext.Provider value={results}>
            {showError && <CustomToastMessage message={errorMessage} title={errorTitle} />}
            {children}
        </ErrorContext.Provider>
    );
};

const useError = () => useContext(ErrorContext);

export { ErrorProvider, useError };
