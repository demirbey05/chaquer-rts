import { useState, useContext, createContext, ReactNode } from "react";

type GameContextType = {
    gameID: number;
    setGameID: (value: any) => void;
    isInputFocused: boolean;
    setIsInputFocused: (value: boolean) => void;
};

const GameContext = createContext<GameContextType>({
    gameID: 0,
    setGameID: () => { },
    isInputFocused: false,
    setIsInputFocused: () => { }
});

const GameProvider: React.FC<{ children: ReactNode }> = ({ children, }: { children: ReactNode; }) => {
    const [gameID, setGameID] = useState<number>(0);
    const [isInputFocused, setIsInputFocused] = useState(false);

    const results: GameContextType = {
        gameID,
        setGameID,
        isInputFocused,
        setIsInputFocused
    };

    return (
        <GameContext.Provider value={results}>
            {children}
        </GameContext.Provider>
    );
};

const useGame = () => useContext(GameContext);

export { GameProvider, useGame };
