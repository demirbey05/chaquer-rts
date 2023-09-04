import { useState, useContext, createContext, ReactNode } from "react";

type CastleContextType = {
    isCastleSettled: boolean | undefined;
    setIsCastleSettled: (value: boolean) => void;
    setCastle: (value: { x: number; y: number }) => void;
    castle: { x: any; y: any };
    setTempCastle: (value: { x: number; y: number }) => void;
    tempCastle: { x: any; y: any };
};

const CastleContext = createContext<CastleContextType>({
    isCastleSettled: false,
    setIsCastleSettled: () => { },
    setCastle: () => { },
    castle: { x: null, y: null },
    setTempCastle: () => { },
    tempCastle: { x: null, y: null }
});

const CastleProvider: React.FC<{ children: ReactNode }> = ({ children, }: { children: ReactNode; }) => {
    const [isCastleSettled, setIsCastleSettled] = useState<boolean>();
    const [castle, setCastle] = useState<any>();
    const [tempCastle, setTempCastle] = useState<any>();

    const results: CastleContextType = {
        setCastle,
        castle,
        setTempCastle,
        tempCastle,
        setIsCastleSettled,
        isCastleSettled
    };

    return (
        <CastleContext.Provider value={results}>
            {children}
        </CastleContext.Provider>
    );
};

const useCastle = () => useContext(CastleContext);

export { CastleProvider, useCastle };
