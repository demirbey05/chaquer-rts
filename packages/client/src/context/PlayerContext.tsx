import { useRef, useState, useEffect, useContext, createContext, ReactNode } from "react";
import { getBurnerPrivateKey } from "@latticexyz/common";
import { Wallet } from "ethers";
import { useMUD } from "./MUDContext";
import { usePlayerIsValid } from "../hooks/IdentityHooks/usePlayerIsValid";
import { useGame } from "./GameContext";
import { useGameData } from "../hooks/useGameData";

type PlayerContextType = {
  userWallet: string | undefined
  userName: string | null | undefined;
  setUserName: (value: string) => void;
  playerSeed: number | undefined;
  setPlayerSeed: (value: number) => void;
  isPlayerLost: boolean | undefined;
  isPlayerWinner: boolean | undefined;
};

const PlayerContext = createContext<PlayerContextType>({
  userWallet: undefined,
  userName: null,
  setUserName: () => { },
  playerSeed: undefined,
  setPlayerSeed: () => { },
  isPlayerLost: false,
  isPlayerWinner: false,
});

const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children, }: { children: ReactNode; }) => {
  const { current: userWallet } = useRef(new Wallet(getBurnerPrivateKey()).address)
  const [userName, setUserName] = useState<string | null | undefined>();

  const [isPlayerLost, setIsPlayerLost] = useState<boolean>(false);
  const [isPlayerWinner, setIsPlayerWinner] = useState<boolean>(false);

  const [playerSeed, setPlayerSeed] = useState<number>();

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
    userName,
    setUserName,
    playerSeed,
    setPlayerSeed,
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
