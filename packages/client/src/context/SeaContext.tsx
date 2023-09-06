import { useState, useContext, createContext, ReactNode } from "react";

type SeaContextType = {
    dockSettleStage: boolean;
    setDockSettleStage: (value: boolean) => void;
    armyPositionToSettleDock: any;
    setArmyPositionToSettleDock: (value: any) => void;
    dockPosition: any;
    setDockPosition: (value: any) => void;
};

const SeaContext = createContext<SeaContextType>({
    dockSettleStage: false,
    setDockSettleStage: () => { },
    armyPositionToSettleDock: undefined,
    setArmyPositionToSettleDock: () => { },
    dockPosition: undefined,
    setDockPosition: () => { }
});

const SeaProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode; }) => {
    const [dockSettleStage, setDockSettleStage] = useState<boolean>(false);
    const [armyPositionToSettleDock, setArmyPositionToSettleDock] = useState<any>();
    const [dockPosition, setDockPosition] = useState<any>();

    const results: SeaContextType = {
        dockSettleStage,
        setDockSettleStage,
        armyPositionToSettleDock,
        setArmyPositionToSettleDock,
        dockPosition,
        setDockPosition
    };

    return (
        <SeaContext.Provider value={results}>
            {children}
        </SeaContext.Provider>
    );
};

const useSea = () => useContext(SeaContext);

export { SeaProvider, useSea };
