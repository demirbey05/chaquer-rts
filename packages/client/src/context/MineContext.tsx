import { useState, useContext, createContext, ReactNode } from "react";

type MineContextType = {
    isMineStage: boolean | undefined;
    setIsMineStage: (value: boolean) => void;
    targetMinePosition: any | undefined;
    setTargetMinePosition: (value: any) => void;
    attackFromArmyPositionToMine: any | undefined;
    setAttackFromArmyPositionToMine: (value: any) => void;
};

const MineContext = createContext<MineContextType>({
    isMineStage: undefined,
    setIsMineStage: () => { },
    targetMinePosition: undefined,
    setTargetMinePosition: () => { },
    attackFromArmyPositionToMine: undefined,
    setAttackFromArmyPositionToMine: () => { }
});

const MineProvider: React.FC<{ children: ReactNode }> = ({ children, }: { children: ReactNode; }) => {
    const [isMineStage, setIsMineStage] = useState<boolean>();
    const [targetMinePosition, setTargetMinePosition] = useState<any>();
    const [attackFromArmyPositionToMine, setAttackFromArmyPositionToMine] = useState<any>();

    const results: MineContextType = {
        isMineStage,
        setIsMineStage,
        targetMinePosition,
        setTargetMinePosition,
        attackFromArmyPositionToMine,
        setAttackFromArmyPositionToMine
    };

    return (
        <MineContext.Provider value={results}>
            {children}
        </MineContext.Provider>
    );
};

const useMine = () => useContext(MineContext);

export { MineProvider, useMine };
