import { useState, useContext, createContext, ReactNode } from "react";

type MineContextType = {
    isMineStage: boolean | undefined;
    setIsMineStage: (value: boolean) => void;
    targetMinePosition: any | undefined;
    setTargetMinePosition: (value: any) => void;
    attackerArmyPosition: any | undefined;
    setAttackerArmyPosition: (value: any) => void;
};

const MineContext = createContext<MineContextType>({
    isMineStage: undefined,
    setIsMineStage: () => { },
    targetMinePosition: undefined,
    setTargetMinePosition: () => { },
    attackerArmyPosition: undefined,
    setAttackerArmyPosition: () => { }
});

const MineProvider: React.FC<{ children: ReactNode }> = ({ children, }: { children: ReactNode; }) => {
    const [isMineStage, setIsMineStage] = useState<boolean>();
    const [targetMinePosition, setTargetMinePosition] = useState<any>();
    const [attackerArmyPosition, setAttackerArmyPosition] = useState<any>();

    const results: MineContextType = {
        isMineStage,
        setIsMineStage,
        targetMinePosition,
        setTargetMinePosition,
        attackerArmyPosition,
        setAttackerArmyPosition
    };

    return (
        <MineContext.Provider value={results}>
            {children}
        </MineContext.Provider>
    );
};

const useMine = () => useContext(MineContext);

export { MineProvider, useMine };
