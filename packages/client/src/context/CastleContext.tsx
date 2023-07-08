import {
    useState,
    useContext,
    createContext,
    ReactNode,
} from "react";

type CastleContextType = {
    isCastleSettled: boolean | undefined;
    setIsCastleSettled: (value: boolean) => void;
    setCastle: (value: { x: number; y: number }) => void;
    castle: { x: any; y: any };
    setTempCastle: (value: { x: number; y: number }) => void;
    tempCastle: { x: any; y: any };
    isCastleDeployedBefore: boolean;
    setIsCastleDeployedBefore: (value: boolean) => void;
};

const CastleContext = createContext<CastleContextType>({
    isCastleSettled: false,
    setIsCastleSettled: () => { },
    setCastle: () => { },
    castle: { x: null, y: null },
    setTempCastle: () => { },
    tempCastle: { x: null, y: null },
    isCastleDeployedBefore: false,
    setIsCastleDeployedBefore: () => { },
});

const CastleProvider: React.FC<{ children: ReactNode }> = ({ children, }: { children: ReactNode; }) => {
    const [isCastleSettled, setIsCastleSettled] = useState<boolean>();
    const [castle, setCastle] = useState<any>();
    const [tempCastle, setTempCastle] = useState<any>();
    const [isCastleDeployedBefore, setIsCastleDeployedBefore] = useState<boolean>(false);

    const results: CastleContextType = {
        setCastle,
        castle,
        setTempCastle,
        tempCastle,
        setIsCastleSettled,
        isCastleSettled,
        isCastleDeployedBefore,
        setIsCastleDeployedBefore
    };

    return (
        <CastleContext.Provider value={results}>
            {children}
        </CastleContext.Provider>
    );
};

const useCastle = () => useContext(CastleContext);

export { CastleProvider, useCastle };
