import { useState, useContext, createContext, ReactNode } from "react";

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
    artilleryAttackStage: boolean;
    setArtilleryAttackStage: (value: boolean) => void;
    myArtilleryConfig: number;
    setMyArtilleryConfig: (value: number) => void;
    attackFromArtilleryPositionToCastle: any;
    setAttackFromArtilleryPositionToCastle: (value: any) => void;
    attackToArtilleryPositionToCastle: any;
    setAttackToArtilleryPositionToCastle: (value: any) => void;
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
    artilleryAttackStage: false,
    setArtilleryAttackStage: () => { },
    myArtilleryConfig: 0,
    setMyArtilleryConfig: () => { },
    attackFromArtilleryPositionToCastle: undefined,
    setAttackFromArtilleryPositionToCastle: () => { },
    attackToArtilleryPositionToCastle: undefined,
    setAttackToArtilleryPositionToCastle: () => { }
});

const AttackProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode; }) => {
    const [isAttackStage, setIsAttackStage] = useState<any>();

    const [attackFromArmyPositionToArmy, setAttackFromArmyPositionToArmy] = useState<any>();
    const [attackToArmyPositionToArmy, setAttackToArmyPositionToArmy] = useState<any>();

    const [attackFromArmyPositionToCastle, setAttackFromArmyPositionToCastle] = useState<any>();
    const [attackToArmyPositionToCastle, setAttackToArmyPositionToCastle] = useState<any>();

    const [myArmyConfig, setMyArmyConfig] = useState<any>();
    const [enemyArmyConfig, setEnemyArmyConfig] = useState<any>();

    const [artilleryAttackStage, setArtilleryAttackStage] = useState(false)
    const [myArtilleryConfig, setMyArtilleryConfig] = useState<number>(0)
    const [attackFromArtilleryPositionToCastle, setAttackFromArtilleryPositionToCastle] = useState<any>()
    const [attackToArtilleryPositionToCastle, setAttackToArtilleryPositionToCastle] = useState<any>()

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
        setAttackToArmyPositionToCastle,
        artilleryAttackStage,
        setArtilleryAttackStage,
        myArtilleryConfig,
        setMyArtilleryConfig,
        attackFromArtilleryPositionToCastle,
        setAttackFromArtilleryPositionToCastle,
        attackToArtilleryPositionToCastle,
        setAttackToArtilleryPositionToCastle
    };

    return (
        <AttackContext.Provider value={results}>
            {children}
        </AttackContext.Provider>
    );
};

const useAttack = () => useContext(AttackContext);

export { AttackProvider, useAttack };
