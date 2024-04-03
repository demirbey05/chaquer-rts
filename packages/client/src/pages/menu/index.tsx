import { useState } from 'react';
import { Accordion, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { FaCirclePlus, FaEnvelopeOpenText } from 'react-icons/fa6'
import { useTerrain } from "../../context/TerrainContext"
import { usePlayer } from "../../context/PlayerContext"
import { useSyncProgress } from "../../hooks/useSyncProgress";
import { useMyUsername } from '../../hooks/IdentityHooks/useMyUsername';
import { UserNameModal } from '../../components/MenuComp/UserNameModal';
import { CreateGameModal } from '../../components/MenuComp/CreateGameModal';
import { PlayerInfoCard } from '../../components/MenuComp/PlayerInfoCard';
import { JoinGameModal } from '../../components/MenuComp/JoinGameModal';
import { GameNameFilter } from '../../components/MenuComp/GameNameFilter';
import { UserNumberFilter } from '../../components/MenuComp/UserNumberFilter';
import { DataFetchProgress } from '../../components/MenuComp/DataFetchProgress';
import { LiveGameTable } from '../../components/MenuComp/LiveGameTable';
import { SpectateGameModal } from '../../components/MenuComp/SpectateGameModal';
import { CompletedGameTable } from '../../components/MenuComp/CompletedGameTable';
import { VersionInfo } from '../../components/TipsComp/VersionInfo';

export const Menu = () => {
  const { userWallet } = usePlayer();
  const { refresh } = useTerrain();

  const username = useMyUsername(userWallet);

  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [isCreateGameModalOpen, setIsCreateGameModalOpen] = useState<boolean>(false);
  const [isJoinGameModalOpen, setIsJoinGameModalOpen] = useState<boolean>(false);
  const [isSpectateGameModalOpen, setIsSpectateGameModalOpen] = useState<boolean>(false);

  const [gameNameFilter, setGameNameFilter] = useState('');
  const [selectedPlayersFilter, setSelectedPlayersFilter] = useState<number[]>([]);

  return (
    <>
      <div className='menu-background'></div>
      <>
        <MenuTitle />
        <VersionInfo />
        <div className={`${refresh === 0 ? "justify-content-center" : ""}`}>
          {
            refresh === 0 &&
            <div id="menu-items">
              {refresh === 0 && <DataFetchProgress />}
              {refresh === 0 && <EnterGameButton />}
            </div>
          }
          {
            refresh !== 0 &&
            <div className='menu-row'>
              <div className='d-lg-inline w-75 p-3'>
                <Tabs
                  isFitted
                  variant={"soft-rounded"}
                >
                  <TabList
                    backgroundColor={"rgba(0,0,0,0.8)"}
                    textColor={'white'}
                    border={"2px"}
                    borderRadius={"25px"}
                    mb={0.5}
                  >
                    <Tab _selected={{ color: 'white', bg: 'green.500' }}>Live Games</Tab>
                    <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Completed Games</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel p={0}>
                      <LiveGameTable
                        selectedPlayers={selectedPlayersFilter}
                        gameNameFilter={gameNameFilter}
                        setIsJoinGameModalOpen={setIsJoinGameModalOpen}
                        setIsSpectateGameModalOpen={setIsSpectateGameModalOpen}
                        username={username} />
                    </TabPanel>
                    <TabPanel p={0}>
                      <CompletedGameTable
                        gameNameFilter={gameNameFilter} />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </div>
              <div className='d-lg-inline p-3'>
                <PlayerInfoCard
                  username={username}
                  setIsUserModalOpen={setIsUserModalOpen} />
                <div id="menu-items">
                  <span className='text-white mt-3'>QUICK FILTER</span>
                  <Accordion defaultIndex={[0]} allowMultiple>
                    <GameNameFilter setFilter={setGameNameFilter} />
                    <UserNumberFilter
                      setSelectedPlayers={setSelectedPlayersFilter}
                      selectedPlayers={selectedPlayersFilter} />
                  </Accordion>
                  <CreateGameButton
                    setIsCreateGameModalOpen={setIsCreateGameModalOpen}
                    username={username} />
                  <GameTutorialButton />
                </div>
              </div>
            </div>
          }
        </div>
      </>
      <UserNameModal
        isOpen={isUserModalOpen}
        setIsOpen={setIsUserModalOpen} />
      <CreateGameModal
        isOpen={isCreateGameModalOpen}
        setIsOpen={setIsCreateGameModalOpen}
        setIsJoinOpen={setIsJoinGameModalOpen} />
      <JoinGameModal
        isOpen={isJoinGameModalOpen}
        setIsOpen={setIsJoinGameModalOpen} />
      <SpectateGameModal
        isOpen={isSpectateGameModalOpen}
        setIsOpen={setIsSpectateGameModalOpen} />
    </>
  );
}

const CreateGameButton = ({ setIsCreateGameModalOpen, username }: { setIsCreateGameModalOpen: (value: boolean) => void, username: any }) => {
  return (
    <button className='btn btn-dark menu-buttons mt-5'
      onClick={() => setIsCreateGameModalOpen(true)}
      disabled={!username}>
      Create a Game
      <FaCirclePlus className='inline align-text-bottom ms-2 text-xl' />
    </button>
  )
}

const EnterGameButton = () => {
  const { setRefresh, refresh } = useTerrain();
  const progress = useSyncProgress();
  const progressStep = progress ? progress.step : "";

  const handleRefresh = (event: any) => {
    setRefresh(refresh + 1);
  };
  return (
    <button
      className='btn btn-dark menu-buttons mb-4'
      onClick={handleRefresh}
      disabled={progressStep !== "live"}>
      Enter the Game
    </button>
  )
}

const GameTutorialButton = () => {
  return (
    <a href="https://docs.chaquer.xyz/basics/read-before-playing" target={"_blank"}>
      <button
        className='btn btn-dark menu-buttons mt-2'>
        Game Tutorial
        <FaEnvelopeOpenText className='inline align-text-bottom ms-2 text-xl' />
      </button>
    </a>
  )
}

const MenuTitle = () => {
  return (
    <div className='d-flex justify-content-center'>
      <h2 className="menu-title">
        Chaquer
      </h2>
    </div>
  )
}