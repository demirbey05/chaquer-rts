import { useState, useContext, createContext, ReactNode } from "react";

type FleetContextType = {
    fleetSettleStage: boolean;
    setFleetSettleStage: (value: boolean) => void;
    fleetPosition: any;
    setFleetPosition: (value: any) => void;
    dockPositionForFleetSettlement: any;
    setDockPositionForFleetSettlement: (value: any) => void;
};

const FleetContext = createContext<FleetContextType>({
    fleetSettleStage: false,
    setFleetSettleStage: () => { },
    fleetPosition: undefined,
    setFleetPosition: () => { },
    dockPositionForFleetSettlement: undefined,
    setDockPositionForFleetSettlement: () => { }
});

const FleetProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode; }) => {
    const [fleetSettleStage, setFleetSettleStage] = useState<boolean>(false);
    const [fleetPosition, setFleetPosition] = useState<any>();
    const [dockPositionForFleetSettlement, setDockPositionForFleetSettlement] = useState<any>();

    const results: FleetContextType = {
        fleetSettleStage,
        setFleetSettleStage,
        fleetPosition,
        setFleetPosition,
        dockPositionForFleetSettlement,
        setDockPositionForFleetSettlement
    };

    return (
        <FleetContext.Provider value={results}>
            {children}
        </FleetContext.Provider>
    );
};

const useFleet = () => useContext(FleetContext);

export { FleetProvider, useFleet };
