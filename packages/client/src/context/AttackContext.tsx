import {
    useState,
    useContext,
    createContext,
    ReactNode
} from "react";

type AttackContextType = {
    isAttackStage: boolean;
    setIsAttackStage: (value: boolean) => void;
    attackFromArmyPositionToArmy: any | undefined;
    setAttackFromArmyPositionToArmy: (value: any | undefined) => void;
    attackToArmyPositionToArmy: any | undefined;
    setAttackToArmyPositionToArmy: (value: any | undefined) => void;
    attackFromArmyPositionToCastle: any | undefined;
    setAttackFromArmyPositionToCastle: (value: any | undefined) => void;
    attackToArmyPositionToCastle: any | undefined;
    setAttackToArmyPositionToCastle: (value: any | undefined) => void;
    myArmyConfig: any | undefined;
    setMyArmyConfig: (value: any | undefined) => void;
    enemyArmyConfig: any | undefined;
    setEnemyArmyConfig: (value: any | undefined) => void;
};

const AttackContext = createContext<AttackContextType>({
    isAttackStage: false,
    setIsAttackStage: () => { },
    attackFromArmyPositionToArmy: undefined,
    setAttackFromArmyPositionToArmy: () => { },
    attackToArmyPositionToArmy: undefined,
    setAttackToArmyPositionToArmy: () => { },
    attackFromArmyPositionToCastle: undefined,
    setAttackFromArmyPositionToCastle: () => { },
    attackToArmyPositionToCastle: undefined,
    setAttackToArmyPositionToCastle: () => { },
    myArmyConfig: undefined,
    setMyArmyConfig: () => { },
    enemyArmyConfig: undefined,
    setEnemyArmyConfig: () => { },
});

const AttackProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode; }) => {
    const [isAttackStage, setIsAttackStage] = useState<any>();

    const [attackFromArmyPositionToArmy, setAttackFromArmyPositionToArmy] = useState<any>();
    const [attackToArmyPositionToArmy, setAttackToArmyPositionToArmy] = useState<any>();

    const [attackFromArmyPositionToCastle, setAttackFromArmyPositionToCastle] = useState<any>();
    const [attackToArmyPositionToCastle, setAttackToArmyPositionToCastle] = useState<any>();

    const [myArmyConfig, setMyArmyConfig] = useState<any>();
    const [enemyArmyConfig, setEnemyArmyConfig] = useState<any>();

    const results: AttackContextType = {
        isAttackStage,
        setIsAttackStage,
        attackFromArmyPositionToArmy,
        setAttackFromArmyPositionToArmy,
        attackToArmyPositionToArmy,
        setAttackToArmyPositionToArmy,
        myArmyConfig,
        setMyArmyConfig,
        enemyArmyConfig,
        setEnemyArmyConfig,
        attackFromArmyPositionToCastle,
        setAttackFromArmyPositionToCastle,
        attackToArmyPositionToCastle,
        setAttackToArmyPositionToCastle
    };

    return (
        <AttackContext.Provider value={results}>
            {children}
        </AttackContext.Provider>
    );
};

const useAttack = () => useContext(AttackContext);

export { AttackProvider, useAttack };
