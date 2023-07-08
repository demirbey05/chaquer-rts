import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
  useRef,
} from "react";
import { ethers } from "ethers";

type TerrainContextType = {
  values: any;
  setIsLoading: (value: boolean) => void;
  width: number;
  height: number;
  setValues: (value: any) => void;
  setRefresh: (value: number) => void;
  refresh: number;
  isLoading: boolean;
  setPermArray: (value: any) => void;
  saveTerrain: () => void;
  abiCoder: any;
  provider: ethers.providers.BaseProvider;
};

const TerrainContext = createContext<TerrainContextType>({
  values: null,
  setIsLoading: () => { },
  width: 50,
  height: 50,
  setValues: () => { },
  setRefresh: () => { },
  refresh: 0,
  isLoading: false,
  setPermArray: () => { },
  saveTerrain: () => { },
  abiCoder: undefined,
  provider: new ethers.providers.JsonRpcProvider(),
});

const TerrainProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode; }) => {
  const width = 50;
  const height = 50;
  const [values, setValues] = useState<any>(null);
  const [permArray, setPermArray] = useState<any>(null);
  const [refresh, setRefresh] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { current: abiCoder } = useRef(new ethers.utils.AbiCoder());
  const { current: provider } = useRef(new ethers.providers.JsonRpcProvider());

  useEffect(() => {
    saveTerrain();
    setIsLoading(false);
  }, [values]);

  useEffect(() => {
    const terrain = window.localStorage.getItem("terrain");
    if (terrain) {
      setValues(JSON.parse(terrain));
    }
  }, []);

  const saveTerrain = () => {
    window.localStorage.setItem("terrain", JSON.stringify(values));
  };

  const results: TerrainContextType = {
    values,
    setIsLoading,
    isLoading,
    width,
    height,
    setValues,
    setRefresh,
    refresh,
    setPermArray,
    saveTerrain,
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
