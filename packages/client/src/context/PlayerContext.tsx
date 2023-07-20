import { getBurnerWallet } from "@latticexyz/std-client";
import { Wallet } from "ethers";
import { useRef, useState, useEffect, useContext, createContext, ReactNode } from "react";
import { useCastle } from "./CastleContext";
import { useCastlePositionByAddress } from "../hooks/useCastlePositionByAddress";

type PlayerContextType = {
  userWallet: Wallet | undefined
  userName: string | undefined;
  setUserName: (value: string) => void;
  saveUserName: () => void;
  removeUserName: () => void;
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
  userName: undefined,
  setUserName: () => { },
  saveUserName: () => { },
  removeUserName: () => { },
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
  const { current: userWallet } = useRef(new Wallet(getBurnerWallet().value))
  const [userName, setUserName] = useState<string>();
  const [isPlayerLost, setIsPlayerLost] = useState<boolean>(false);

  const [playerSeed, setPlayerSeed] = useState<number>();
  const [playerSeedStage, setPlayerSeedStage] = useState<boolean>(true);

  const [playerWaitingStage, setPlayerWaitingStage] = useState<boolean>(true);

  const { isCastleDeployedBefore, isCastleSettled } = useCastle();
  const myCastlePosition = useCastlePositionByAddress(userWallet!.address.toLocaleLowerCase());

  useEffect(() => {
    if ((myCastlePosition && (myCastlePosition.length === 0) && isCastleDeployedBefore && isCastleSettled)) {
      setIsPlayerLost(true);
    }
  }, [myCastlePosition, isCastleDeployedBefore, isCastleSettled])

  useEffect(() => {
    if (isPlayerLost) {
      removeUserName();
      removePlayerSeedStage();
    }
  }, [isPlayerLost])

  useEffect(() => {
    if (localStorage.getItem('username')) {
      setUserName(localStorage.getItem('username'))
    }
  }, [userName])

  useEffect(() => {
    if (localStorage.getItem('playerSeedStage')) {
      setPlayerSeedStage(false)
    }
  }, [playerSeedStage])

  const saveUserName = () => {
    if (userName) {
      localStorage.setItem('username', userName)
    }
  }

  const savePlayerSeedStage = () => {
    localStorage.setItem('playerSeedStage', "false");
  }

  const removeUserName = () => {
    if (localStorage.getItem('username')) {
      localStorage.removeItem('username')
    }
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
    saveUserName,
    removeUserName,
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
