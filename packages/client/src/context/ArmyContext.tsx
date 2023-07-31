import { useState, useContext, createContext, ReactNode } from "react";

type ArmyContextType = {
    isArmySettled: boolean | undefined;
    setIsArmySettled: (value: boolean) => void;
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
};

const ArmyContext = createContext<ArmyContextType>({
    isArmySettled: false,
    setIsArmySettled: () => { },
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
});

const ArmyProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode; }) => {
    const [isArmySettled, setIsArmySettled] = useState<boolean>();
    const [isArmySettleStage, setIsArmySettleStage] = useState<boolean>();
    const [armyPosition, setArmyPosition] = useState<any>();
    const [numberOfArmy, setNumberOfArmy] = useState<any>();

    const [fromArmyPosition, setFromArmyPosition] = useState<any>();
    const [isArmyMoveStage, setIsArmyMoveStage] = useState<any>();

    const results: ArmyContextType = {
        isArmySettled,
        setIsArmySettled,
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
    };

    return (
        <ArmyContext.Provider value={results}>
            {children}
        </ArmyContext.Provider>
    );
};

const useArmy = () => useContext(ArmyContext);

export { ArmyProvider, useArmy };
