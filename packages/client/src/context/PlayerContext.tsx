import { getBurnerWallet } from "@latticexyz/std-client";
import { Wallet } from "ethers";
import {
    useRef,
    useContext,
    createContext,
    ReactNode,
  } from "react";
  
type PlayerContextType = {
  userWallet:Wallet|undefined

};

const PlayerContext = createContext<PlayerContextType>({
  userWallet:undefined

});

const PlayerProvider: React.FC<{ children: ReactNode }> = ({children,}: {children: ReactNode;}) => {

  const {current:userWallet} = useRef(new Wallet(getBurnerWallet().value))

const results: PlayerContextType = {
  userWallet
    
};

return (
    <PlayerContext.Provider value={results}>
    {children}
    </PlayerContext.Provider>
);
};
  
const usePlayer = () => useContext(PlayerContext);

export { PlayerProvider, usePlayer };
  