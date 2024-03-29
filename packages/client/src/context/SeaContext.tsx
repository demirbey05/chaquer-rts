import { useState, useContext, createContext, ReactNode } from "react";

type SeaContextType = {
    dockSettleStage: boolean;
    setDockSettleStage: (value: boolean) => void;
    armyPositionToSettleDock: any;
    setArmyPositionToSettleDock: (value: any) => void;
    dockPosition: any;
    setDockPosition: (value: any) => void;
    dockCaptureStage: boolean;
    setDockCaptureStage: (value: boolean) => void;
    targetDockPosition: any;
    setTargetDockPosition: (value: any) => void;
    dockAttackerArmyPosition: any;
    setDockAttackerArmyPosition: (value: any) => void;
    seaMineStage: boolean;
    setSeaMineStage: (value: boolean) => void;
    seaMineAttackerFleetPosition: any;
    setSeaMineAttackerFleetPosition: (value: any) => void;
    targetSeaMinePosition: any;
    setTargetSeaMinePosition: (value: any) => void;
};

const SeaContext = createContext<SeaContextType>({
    dockSettleStage: false,
    setDockSettleStage: () => { },
    armyPositionToSettleDock: undefined,
    setArmyPositionToSettleDock: () => { },
    dockPosition: undefined,
    setDockPosition: () => { },
    dockCaptureStage: false,
    setDockCaptureStage: () => { },
    targetDockPosition: undefined,
    setTargetDockPosition: () => { },
    dockAttackerArmyPosition: undefined,
    setDockAttackerArmyPosition: () => { },
    seaMineStage: false,
    setSeaMineStage: () => { },
    seaMineAttackerFleetPosition: undefined,
    setSeaMineAttackerFleetPosition: () => { },
    targetSeaMinePosition: undefined,
    setTargetSeaMinePosition: () => { }
});

const SeaProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode; }) => {
    const [dockSettleStage, setDockSettleStage] = useState<boolean>(false);
    const [armyPositionToSettleDock, setArmyPositionToSettleDock] = useState<any>();
    const [dockPosition, setDockPosition] = useState<any>();

    const [dockCaptureStage, setDockCaptureStage] = useState<boolean>(false);
    const [targetDockPosition, setTargetDockPosition] = useState<any>();
    const [dockAttackerArmyPosition, setDockAttackerArmyPosition] = useState<any>();

    const [seaMineStage, setSeaMineStage] = useState<boolean>(false);
    const [seaMineAttackerFleetPosition, setSeaMineAttackerFleetPosition] = useState<any>();
    const [targetSeaMinePosition, setTargetSeaMinePosition] = useState<any>();

    const results: SeaContextType = {
        dockSettleStage,
        setDockSettleStage,
        armyPositionToSettleDock,
        setArmyPositionToSettleDock,
        dockPosition,
        setDockPosition,
        dockCaptureStage,
        setDockCaptureStage,
        targetDockPosition,
        setTargetDockPosition,
        dockAttackerArmyPosition,
        setDockAttackerArmyPosition,
        seaMineStage,
        setSeaMineStage,
        seaMineAttackerFleetPosition,
        setSeaMineAttackerFleetPosition,
        targetSeaMinePosition,
        setTargetSeaMinePosition
    };

    return (
        <SeaContext.Provider value={results}>
            {children}
        </SeaContext.Provider>
    );
};

const useSea = () => useContext(SeaContext);

export { SeaProvider, useSea };
