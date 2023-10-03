import { useState, useContext, createContext, ReactNode } from "react";

type GameContextType = {
    gameID: number;
    setGameID: (value: any) => void;
    gameState: number;
    setGameState: (value: any) => void;
};

const GameContext = createContext<GameContextType>({
    gameID: 0,
    setGameID: () => { },
    gameState: 0,
    setGameState: () => { },
});

const GameProvider: React.FC<{ children: ReactNode }> = ({ children, }: { children: ReactNode; }) => {
    const [gameID, setGameID] = useState<number>(0);
    const [gameState, setGameState] = useState<number>(0);

    const results: GameContextType = {
        gameID,
        setGameID,
        gameState,
        setGameState
    };

    return (
        <GameContext.Provider value={results}>
            {children}
        </GameContext.Provider>
    );
};

const useGame = () => useContext(GameContext);

export { GameProvider, useGame };
