import { useState, useContext, createContext, ReactNode, useRef } from "react";
import { ethers } from "ethers";

type TerrainContextType = {
  width: number;
  height: number;
  values: any;
  setValues: (value: any) => void;
  setRefresh: (value: number) => void;
  refresh: number;
  abiCoder: any;
  provider: ethers.providers.BaseProvider;
};

const TerrainContext = createContext<TerrainContextType>({
  width: 25,
  height: 25,
  values: null,
  setValues: () => { },
  setRefresh: () => { },
  refresh: 0,
  abiCoder: undefined,
  provider: new ethers.providers.JsonRpcProvider(),
});

const TerrainProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode; }) => {
  const width = 25;
  const height = 25;
  const [values, setValues] = useState<any>(null);
  const [refresh, setRefresh] = useState<number>(0);
  const { current: abiCoder } = useRef(new ethers.utils.AbiCoder());
  const { current: provider } = useRef(new ethers.providers.JsonRpcProvider());

  const results: TerrainContextType = {
    width,
    height,
    values,
    setValues,
    setRefresh,
    refresh,
    abiCoder,
    provider,
  };

  return (
    <TerrainContext.Provider value={results}>
      {children}
    </TerrainContext.Provider>
  );
};

const useTerrain = () => useContext(TerrainContext);

export { TerrainProvider, useTerrain };
