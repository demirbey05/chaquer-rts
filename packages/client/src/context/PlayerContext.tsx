import { useRef, useState, useEffect, useContext, createContext, ReactNode } from "react";
import { getBurnerPrivateKey } from "@latticexyz/common";
import { Wallet } from "ethers";
import { useMUD } from "./MUDContext";
import { usePlayerIsValid } from "../hooks/IdentityHooks/usePlayerIsValid";
import { useGame } from "./GameContext";
import { useGameData } from "../hooks/useGameData";

type PlayerContextType = {
  userWallet: string | undefined;
  isPlayerLost: boolean | undefined;
  isPlayerWinner: boolean | undefined;
};

const PlayerContext = createContext<PlayerContextType>({
  userWallet: undefined,
  isPlayerLost: false,
  isPlayerWinner: false,
});

const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children, }: { children: ReactNode; }) => {
  const { current: userWallet } = useRef(new Wallet(getBurnerPrivateKey()).address)

  const [isPlayerLost, setIsPlayerLost] = useState<boolean>(false);
  const [isPlayerWinner, setIsPlayerWinner] = useState<boolean>(false);

  const { systemCalls } = useMUD();
  const { gameID } = useGame();
  const gameData = useGameData(gameID)
  const userValid = usePlayerIsValid(gameID, userWallet);

  useEffect(() => {
    if (!userValid && gameData && (gameData.state === 3 || gameData.state === 4)) {
      setIsPlayerLost(true)
    }
  }, [userValid, gameData])

  useEffect(() => {
    const fetchData = async () => {
      if (userValid && gameData && Number(gameData.numberOfPlayer) === 1 && (gameData.state === 3 || gameData.state === 4)) {

        if (gameData.winner && (gameData.winner === userWallet)) {
          setIsPlayerWinner(true);
        } else {

          const tx = await systemCalls.claimWinner(gameID, userWallet);
          if (tx) {
            setIsPlayerWinner(true);
          }
        }
      }
    };

    fetchData();

  }, [userValid, gameData]);

  const results: PlayerContextType = {
    userWallet,
    isPlayerLost,
    isPlayerWinner
  };

  return (
    <PlayerContext.Provider value={results}>
      {children}
    </PlayerContext.Provider>
  );
};

const usePlayer = () => useContext(PlayerContext);

export { PlayerProvider, usePlayer };
