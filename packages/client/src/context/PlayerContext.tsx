import { getBurnerPrivateKey } from "@latticexyz/common";
import { Wallet } from "ethers";
import { useRef, useState, useEffect, useContext, createContext, ReactNode } from "react";
import { useCastle } from "./CastleContext";
import { useCastlePositionByAddress } from "../hooks/useCastlePositionByAddress";

type PlayerContextType = {
  userWallet: string | undefined
  userName: string | null | undefined;
  setUserName: (value: string) => void;
  playerSeed: number | undefined;
  setPlayerSeed: (value: number) => void;
  playerSeedStage: boolean | undefined;
  setPlayerSeedStage: (value: boolean) => void;
  savePlayerSeedStage: () => void;
  playerWaitingStage: boolean | undefined;
  setPlayerWaitingStage: (value: boolean) => void;
  isPlayerLost: boolean | undefined;
};

const PlayerContext = createContext<PlayerContextType>({
  userWallet: undefined,
  userName: null,
  setUserName: () => { },
  playerSeed: undefined,
  setPlayerSeed: () => { },
  playerSeedStage: true,
  setPlayerSeedStage: () => { },
  savePlayerSeedStage: () => { },
  playerWaitingStage: undefined,
  setPlayerWaitingStage: () => { },
  isPlayerLost: false
});

const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children, }: { children: ReactNode; }) => {
  const { current: userWallet } = useRef(new Wallet(getBurnerPrivateKey()).address)
  const [userName, setUserName] = useState<string | null | undefined>();
  const [isPlayerLost, setIsPlayerLost] = useState<boolean>(false);

  const [playerSeed, setPlayerSeed] = useState<number>();
  const [playerSeedStage, setPlayerSeedStage] = useState<boolean>(true);

  const [playerWaitingStage, setPlayerWaitingStage] = useState<boolean>(true);

  const { isCastleDeployedBefore, isCastleSettled } = useCastle();
  const myCastlePosition = useCastlePositionByAddress(userWallet);

  useEffect(() => {
    if (isPlayerLost) {
      removePlayerSeedStage();
    }
  }, [isPlayerLost])

  useEffect(() => {
    if (localStorage.getItem('playerSeedStage')) {
      setPlayerSeedStage(false)
    }
  }, [playerSeedStage])

  const savePlayerSeedStage = () => {
    localStorage.setItem('playerSeedStage', "false");
  }

  const removePlayerSeedStage = () => {
    if (localStorage.getItem('playerSeedStage')) {
      localStorage.removeItem('playerSeedStage')
    }
  }

  const results: PlayerContextType = {
    userWallet,
    userName,
    setUserName,
    playerSeed,
    setPlayerSeed,
    playerSeedStage,
    setPlayerSeedStage,
    savePlayerSeedStage,
    playerWaitingStage,
    setPlayerWaitingStage,
    isPlayerLost
  };

  return (
    <PlayerContext.Provider value={results}>
      {children}
    </PlayerContext.Provider>
  );
};

const usePlayer = () => useContext(PlayerContext);

export { PlayerProvider, usePlayer };
