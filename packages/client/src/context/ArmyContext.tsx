import { useState, useContext, createContext, ReactNode } from "react";

type ArmyContextType = {
    isArmySettleStage: boolean | undefined;
    setIsArmySettleStage: (value: boolean) => void;
    setArmyPosition: (value: { x: number; y: number }) => void;
    armyPosition: { x: any; y: any };
    numberOfArmy: any | undefined;
    setNumberOfArmy: (value: any | undefined) => void;
    fromArmyPosition: { x: any; y: any } | undefined;
    setFromArmyPosition: (value: { x: any; y: any } | undefined) => void;
    isArmyMoveStage: boolean;
    setIsArmyMoveStage: (value: boolean) => void;
    isArmyUpdateStage: boolean;
    setIsArmyUpdateStage: (value: boolean) => void;
    armyPositionUpdate: any;
    setArmyPositionUpdate: (value: any) => void;
    isArmyMergeStage: boolean;
    setIsArmyMergeStage: (value: boolean) => void;
    mergeTargetArmyPosition: any;
    setMergeTargetArmyPosition: (value: any) => void;
    mergeFromArmyPosition: any;
    setMergeFromArmyPosition: (value: any) => void;
};

const ArmyContext = createContext<ArmyContextType>({
    isArmySettleStage: false,
    setIsArmySettleStage: () => { },
    setArmyPosition: () => { },
    armyPosition: { x: null, y: null },
    numberOfArmy: null,
    setNumberOfArmy: () => { },
    fromArmyPosition: undefined,
    setFromArmyPosition: () => { },
    isArmyMoveStage: false,
    setIsArmyMoveStage: () => { },
    isArmyUpdateStage: false,
    setIsArmyUpdateStage: () => { },
    armyPositionUpdate: undefined,
    setArmyPositionUpdate: () => { },
    isArmyMergeStage: false,
    setIsArmyMergeStage: () => { },
    mergeTargetArmyPosition: undefined,
    setMergeTargetArmyPosition: () => { },
    mergeFromArmyPosition: undefined,
    setMergeFromArmyPosition: () => { }
});

const ArmyProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode; }) => {
    const [isArmySettleStage, setIsArmySettleStage] = useState<boolean>();
    const [armyPosition, setArmyPosition] = useState<any>();
    const [numberOfArmy, setNumberOfArmy] = useState<any>();

    const [fromArmyPosition, setFromArmyPosition] = useState<any>();
    const [isArmyMoveStage, setIsArmyMoveStage] = useState<any>();

    const [isArmyUpdateStage, setIsArmyUpdateStage] = useState<boolean>(false);
    const [armyPositionUpdate, setArmyPositionUpdate] = useState<any>();

    const [isArmyMergeStage, setIsArmyMergeStage] = useState<boolean>(false);
    const [mergeTargetArmyPosition, setMergeTargetArmyPosition] = useState<any>();
    const [mergeFromArmyPosition, setMergeFromArmyPosition] = useState<any>();

    const results: ArmyContextType = {
        isArmySettleStage,
        setIsArmySettleStage,
        armyPosition,
        setArmyPosition,
        numberOfArmy,
        setNumberOfArmy,
        fromArmyPosition,
        setFromArmyPosition,
        isArmyMoveStage,
        setIsArmyMoveStage,
        isArmyUpdateStage,
        setIsArmyUpdateStage,
        armyPositionUpdate,
        setArmyPositionUpdate,
        isArmyMergeStage,
        setIsArmyMergeStage,
        mergeTargetArmyPosition,
        setMergeTargetArmyPosition,
        mergeFromArmyPosition,
        setMergeFromArmyPosition
    };

    return (
        <ArmyContext.Provider value={results}>
            {children}
        </ArmyContext.Provider>
    );
};

const useArmy = () => useContext(ArmyContext);

export { ArmyProvider, useArmy };
