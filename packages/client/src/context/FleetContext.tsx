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
    setFromFleetPosition: (value: { x: number, y: number } | undefined) => void
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
    setFromFleetPosition: () => { }
});

const FleetProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode; }) => {
    const [fleetSettleStage, setFleetSettleStage] = useState<boolean>(false);
    const [fleetPosition, setFleetPosition] = useState<any>();
    const [dockPositionForFleetSettlement, setDockPositionForFleetSettlement] = useState<any>();

    const [isFleetMoveStage, setIsFleetMoveStage] = useState<boolean>(false);
    const [fromFleetPosition, setFromFleetPosition] = useState<{ x: number, y: number } | undefined>();

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
        setFromFleetPosition
    };

    return (
        <FleetContext.Provider value={results}>
            {children}
        </FleetContext.Provider>
    );
};

const useFleet = () => useContext(FleetContext);

export { FleetProvider, useFleet };
