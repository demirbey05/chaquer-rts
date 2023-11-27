import { useState, useContext, createContext, ReactNode } from "react";

type FleetContextType = {
    fleetSettleStage: boolean;
    setFleetSettleStage: (value: boolean) => void;
    fleetPosition: any;
    setFleetPosition: (value: any) => void;
    dockPositionForFleetSettlement: any;
    setDockPositionForFleetSettlement: (value: any) => void;
    isFleetMoveStage: boolean;
    setIsFleetMoveStage: (value: boolean) => void;
    fromFleetPosition: { x: number, y: number } | undefined;
    setFromFleetPosition: (value: { x: number, y: number } | undefined) => void;
    attackerFleetPosition: { x: number, y: number } | undefined;
    setAttackerFleetPosition: (value: { x: number, y: number } | undefined) => void;
    targetFleetPosition: { x: number, y: number } | undefined;
    setTargetFleetPosition: (value: { x: number, y: number } | undefined) => void;
    myFleetConfig: any;
    setMyFleetConfig: (value: any) => void;
    enemyFleetConfig: any;
    setEnemyFleetConfig: (value: any) => void;
    isFleetAttackStage: boolean;
    setIsFleetAttackStage: (value: boolean) => void;
    isFleetLoadStage: boolean;
    setIsFleetLoadStage: (value: boolean) => void;
    loadArmyPosition: { x: number, y: number };
    setLoadArmyPosition: (value: { x: number, y: number }) => void;
    targetLoadFleetPosition: { x: number, y: number };
    setTargetLoadFleetPosition: (value: { x: number, y: number }) => void;
    isFleetUnloadStage: boolean;
    setIsFleetUnloadStage: (value: boolean) => void;
    unloadArmyPosition: { x: number, y: number };
    setUnloadArmyPosition: (value: { x: number, y: number }) => void;
    fromLoadFleetPosition: { x: number, y: number };
    setFromLoadFleetPosition: (value: { x: number, y: number }) => void;
};

const FleetContext = createContext<FleetContextType>({
    fleetSettleStage: false,
    setFleetSettleStage: () => { },
    fleetPosition: undefined,
    setFleetPosition: () => { },
    dockPositionForFleetSettlement: undefined,
    setDockPositionForFleetSettlement: () => { },
    isFleetMoveStage: false,
    setIsFleetMoveStage: () => { },
    fromFleetPosition: undefined,
    setFromFleetPosition: () => { },
    attackerFleetPosition: undefined,
    setAttackerFleetPosition: () => { },
    targetFleetPosition: undefined,
    setTargetFleetPosition: () => { },
    myFleetConfig: undefined,
    setMyFleetConfig: () => { },
    enemyFleetConfig: undefined,
    setEnemyFleetConfig: () => { },
    isFleetAttackStage: false,
    setIsFleetAttackStage: () => { },
    isFleetLoadStage: false,
    setIsFleetLoadStage: () => { },
    loadArmyPosition: { x: -1, y: -1 },
    setLoadArmyPosition: () => { },
    targetLoadFleetPosition: { x: -1, y: -1 },
    setTargetLoadFleetPosition: () => { },
    isFleetUnloadStage: false,
    setIsFleetUnloadStage: () => { },
    unloadArmyPosition: { x: -1, y: -1 },
    setUnloadArmyPosition: () => { },
    fromLoadFleetPosition: { x: -1, y: -1 },
    setFromLoadFleetPosition: () => { }
});

const FleetProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode; }) => {
    const [fleetSettleStage, setFleetSettleStage] = useState<boolean>(false);
    const [fleetPosition, setFleetPosition] = useState<any>();
    const [dockPositionForFleetSettlement, setDockPositionForFleetSettlement] = useState<any>();

    const [isFleetMoveStage, setIsFleetMoveStage] = useState<boolean>(false);
    const [fromFleetPosition, setFromFleetPosition] = useState<{ x: number, y: number } | undefined>();

    const [isFleetAttackStage, setIsFleetAttackStage] = useState<boolean>(false);
    const [attackerFleetPosition, setAttackerFleetPosition] = useState<{ x: number, y: number } | undefined>();
    const [targetFleetPosition, setTargetFleetPosition] = useState<{ x: number, y: number } | undefined>();
    const [myFleetConfig, setMyFleetConfig] = useState<any>();
    const [enemyFleetConfig, setEnemyFleetConfig] = useState<any>();

    const [isFleetLoadStage, setIsFleetLoadStage] = useState<boolean>(false)
    const [loadArmyPosition, setLoadArmyPosition] = useState<{ x: number, y: number }>({ x: -1, y: -1 })
    const [targetLoadFleetPosition, setTargetLoadFleetPosition] = useState<{ x: number, y: number }>({ x: -1, y: -1 })

    const [isFleetUnloadStage, setIsFleetUnloadStage] = useState<boolean>(false)
    const [unloadArmyPosition, setUnloadArmyPosition] = useState<{ x: number, y: number }>({ x: -1, y: -1 })
    const [fromLoadFleetPosition, setFromLoadFleetPosition] = useState<{ x: number, y: number }>({ x: -1, y: -1 })

    const results: FleetContextType = {
        fleetSettleStage,
        setFleetSettleStage,
        fleetPosition,
        setFleetPosition,
        dockPositionForFleetSettlement,
        setDockPositionForFleetSettlement,
        isFleetMoveStage,
        setIsFleetMoveStage,
        fromFleetPosition,
        setFromFleetPosition,
        attackerFleetPosition,
        setAttackerFleetPosition,
        targetFleetPosition,
        setTargetFleetPosition,
        myFleetConfig,
        setMyFleetConfig,
        enemyFleetConfig,
        setEnemyFleetConfig,
        isFleetAttackStage,
        setIsFleetAttackStage,
        isFleetLoadStage,
        setIsFleetLoadStage,
        loadArmyPosition,
        setLoadArmyPosition,
        targetLoadFleetPosition,
        setTargetLoadFleetPosition,
        isFleetUnloadStage,
        setIsFleetUnloadStage,
        unloadArmyPosition,
        setUnloadArmyPosition,
        fromLoadFleetPosition,
        setFromLoadFleetPosition,
    };

    return (
        <FleetContext.Provider value={results}>
            {children}
        </FleetContext.Provider>
    );
};

const useFleet = () => useContext(FleetContext);

export { FleetProvider, useFleet };
