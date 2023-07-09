import {
    useState,
    useContext,
    createContext,
    ReactNode
} from "react";

type AttackContextType = {
    isAttackStage: boolean;
    setIsAttackStage: (value: boolean) => void;
    attackFromArmyPosition: any | undefined;
    setAttackFromArmyPosition: (value: any | undefined) => void;
    attackToArmyPosition: any | undefined;
    setAttackToArmyPosition: (value: any | undefined) => void;
    myArmyConfig: any | undefined;
    setMyArmyConfig: (value: any | undefined) => void;
    enemyArmyConfig: any | undefined;
    setEnemyArmyConfig: (value: any | undefined) => void;
};

const AttackContext = createContext<AttackContextType>({
    isAttackStage: false,
    setIsAttackStage: () => { },
    attackFromArmyPosition: undefined,
    setAttackFromArmyPosition: () => { },
    attackToArmyPosition: undefined,
    setAttackToArmyPosition: () => { },
    myArmyConfig: undefined,
    setMyArmyConfig: () => { },
    enemyArmyConfig: undefined,
    setEnemyArmyConfig: () => { },
});

const AttackProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode; }) => {
    const [isAttackStage, setIsAttackStage] = useState<any>();
    const [attackFromArmyPosition, setAttackFromArmyPosition] = useState<any>();
    const [attackToArmyPosition, setAttackToArmyPosition] = useState<any>();
    const [myArmyConfig, setMyArmyConfig] = useState<any>();
    const [enemyArmyConfig, setEnemyArmyConfig] = useState<any>();

    const results: AttackContextType = {
        isAttackStage,
        setIsAttackStage,
        attackFromArmyPosition,
        setAttackFromArmyPosition,
        attackToArmyPosition,
        setAttackToArmyPosition,
        myArmyConfig,
        setMyArmyConfig,
        enemyArmyConfig,
        setEnemyArmyConfig
    };

    return (
        <AttackContext.Provider value={results}>
            {children}
        </AttackContext.Provider>
    );
};

const useAttack = () => useContext(AttackContext);

export { AttackProvider, useAttack };
