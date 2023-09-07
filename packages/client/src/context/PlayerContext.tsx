import { useRef, useState, useEffect, useContext, createContext, ReactNode } from "react";
import { getBurnerPrivateKey } from "@latticexyz/common";
import { Wallet } from "ethers";
import { useMUD } from "../MUDContext";
import { useNumberOfUsers } from "../hooks/useNumberOfUsers";
import { usePlayerIsValid } from "../hooks/usePlayerIsValid";
import { useGameState } from "../hooks/useGameState";
import { useWinnerAddress } from "../hooks/useWinnerAddress";

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

  const numberOfUser = useNumberOfUsers(1);
  const userValid = usePlayerIsValid(1, userWallet);
  const gameState = useGameState(1);
  const winnerAddress = useWinnerAddress(1);

  useEffect(() => {
    if (!userValid && (gameState === 3 || gameState === 4)) {
      setIsPlayerLost(true)
    }
  }, [userValid, gameState])

  useEffect(() => {
    const fetchData = async () => {
      if (userValid && numberOfUser === 1 && (gameState === 3 || gameState === 4)) {
        if (winnerAddress && (winnerAddress === userWallet)) {
          setIsPlayerWinner(true);
        } else {
          const tx = await systemCalls.claimWinner(1, userWallet);
          if (tx) {
            setIsPlayerWinner(true);
          }
        }
      }
    };

    fetchData();

  }, [userValid, numberOfUser, gameState, winnerAddress]);

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
