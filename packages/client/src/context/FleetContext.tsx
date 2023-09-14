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
    setIsFleetAttackStage: () => { }
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
        setIsFleetAttackStage
    };

    return (
        <FleetContext.Provider value={results}>
            {children}
        </FleetContext.Provider>
    );
};

const useFleet = () => useContext(FleetContext);

export { FleetProvider, useFleet };
