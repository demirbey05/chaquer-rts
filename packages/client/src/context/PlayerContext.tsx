import { getBurnerWallet } from "@latticexyz/std-client";
import { Wallet } from "ethers";
import { useRef, useState, useEffect, useContext, createContext, ReactNode } from "react";

type PlayerContextType = {
  userWallet: Wallet | undefined
  userName: string | undefined;
  setUserName: (value: string) => void;
};

const PlayerContext = createContext<PlayerContextType>({
  userWallet: undefined,
  userName: undefined,
  setUserName: () => { }
});

const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children, }: { children: ReactNode; }) => {

  const { current: userWallet } = useRef(new Wallet(getBurnerWallet().value))
  const [userName, setUserName] = useState<string>();

  useEffect(() => {
    if (localStorage.getItem('username')) {
      setUserName(localStorage.getItem('username'))
    }
  }, [])

  const saveUserName = () => {
    if (userName) {
      localStorage.setItem('username', userName)
    }
  }

  const removeUserName = () => {
    if (localStorage.getItem('username')) {
      localStorage.removeItem('username')
    }
  }

  const results: PlayerContextType = {
    userWallet,
    userName,
    setUserName
  };

  return (
    <PlayerContext.Provider value={results}>
      {children}
    </PlayerContext.Provider>
  );
};

const usePlayer = () => useContext(PlayerContext);

export { PlayerProvider, usePlayer };
