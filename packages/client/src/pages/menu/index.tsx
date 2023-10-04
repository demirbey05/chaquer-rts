import { useEffect, useState } from 'react';
import { Accordion, useClipboard, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
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

export const Menu = () => {
  const { userWallet } = usePlayer();
  const { setIsLoading, setRefresh, refresh } = useTerrain();
  const { onCopy, setValue, hasCopied } = useClipboard("");

  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [isCreateGameModalOpen, setIsCreateGameModalOpen] = useState<boolean>(false);
  const [isJoinGameModalOpen, setIsJoinGameModalOpen] = useState<boolean>(false);
  const [isSpectateGameModalOpen, setIsSpectateGameModalOpen] = useState<boolean>(false);

  const [gameNameFilter, setGameNameFilter] = useState('');
  const [selectedPlayersFilter, setSelectedPlayersFilter] = useState<number[]>([]);

  const progress = useSyncProgress();
  const username = useMyUsername(userWallet);

  useEffect(() => {
    if (userWallet) {
      setValue(userWallet.toString())
    }
  }, [userWallet])

  const handleRefresh = (event: any) => {
    setIsLoading(true);
    setRefresh(refresh + 1);
  };

  return (
    <>
      <div className='menu-background'></div>
      <>
        <MenuTitle />
        <div className="menu-row" style={refresh === 0 ? { justifyContent: "center" } : { justifyContent: "space-evenly", padding: "0 15%" }}>
          {
            refresh === 0 &&
            <div id="menu-items">
              {refresh === 0 && <DataFetchProgress progress={progress} />}
              {refresh === 0 && <EnterGameButton handleRefresh={handleRefresh} percentage={progress && progress.percentage} />}
            </div>
          }
          {
            refresh !== 0 &&
            <div className='col'>
              <PlayerInfoCard
                username={username}
                publicWallet={userWallet}
                onCopy={onCopy}
                hasCopied={hasCopied}
                setIsUserModalOpen={setIsUserModalOpen} />
              <div className='menu-row mt-5'>
                <div className='col-8'>
                  <Tabs isFitted variant='enclosed'>
                    <TabList backgroundColor={"rgba(0,0,0,0.8)"} textColor={'white'}>
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
                <div className='col-4'>
                  <div id="menu-items">
                    <span className='text-white'>QUICK FILTER</span>
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
    </button>
  )
}

const EnterGameButton = ({ handleRefresh, percentage }: { handleRefresh: (event: any) => void, percentage: number }) => {
  return (
    <button
      className='btn btn-dark menu-buttons mb-4'
      onClick={handleRefresh}
      disabled={percentage !== 100}>
      Enter the Game
    </button>
  )
}

const GameTutorialButton = () => {
  return (
    <a href="https://www.notion.so/psiket-comm/Chaquer-Game-Tutorial-680ce3a3fcf345fbb9a2bcc458e3b21b" target={"_blank"}>
      <button
        className='btn btn-dark menu-buttons mt-2'>
        Game Tutorial
      </button>
    </a>
  )
}

const MenuTitle = () => {
  return (
    <div className='row d-flex justify-content-center'>
      <h2 className="menu-title">
        Chaquer
      </h2>
    </div>
  )
}