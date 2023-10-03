import mapImg from '../../images/backgrounds/map.png';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Progress, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Avatar, WrapItem, Accordion, AccordionItem, AccordionIcon, AccordionButton, AccordionPanel, Box, Checkbox, useClipboard, Button
} from '@chakra-ui/react'
import { useTerrain } from "../../context/TerrainContext"
import { usePlayer } from "../../context/PlayerContext"
import { useSyncProgress } from "../../hooks/useSyncProgress";
import { useGameList } from '../../hooks/GameHooks/useGameList';
import { UserNameModal } from '../../components/MenuComp/UserNameModal';
import { CreateGameModal } from '../../components/MenuComp/CreateGameModal';
import { useMyUsername } from '../../hooks/IdentityHooks/useMyUsername';
import { JoinGameModal } from '../../components/MenuComp/JoinGameModal';
import { useGame } from '../../context/GameContext';
import { usePlayerIsValid } from '../../hooks/IdentityHooks/usePlayerIsValid';

export const Menu = () => {
  const { userWallet } = usePlayer();
  const { setIsLoading, setRefresh, refresh } = useTerrain();

  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [isCreateGameModalOpen, setIsCreateGameModalOpen] = useState<boolean>(false);
  const [isJoinGameModalOpen, setIsJoinGameModalOpen] = useState<boolean>(false);

  const [filter, setFilter] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);

  const progress = useSyncProgress();
  const gameList = useGameList();
  const { setGameID } = useGame();
  const username = useMyUsername(1, userWallet);
  const { onCopy, setValue, hasCopied } = useClipboard("");

  useEffect(() => {
    if (userWallet) {
      setValue(userWallet.toString())
    }
  }, [userWallet])

  const handleRefresh = (event: any) => {
    setIsLoading(true);
    setRefresh(refresh + 1);
  };

  const togglePlayerFilter = (numPlayers: number) => {
    if (selectedPlayers.includes(numPlayers)) {
      setSelectedPlayers(selectedPlayers.filter((player) => player !== numPlayers));
    } else {
      setSelectedPlayers([...selectedPlayers, numPlayers]);
    }
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
              {refresh === 0 && <Loader progress={progress} />}
              {refresh === 0 && <EnterGameButton handleRefresh={handleRefresh} percentage={progress && progress.percentage} />}
            </div>
          }
          {
            refresh !== 0 &&
            <div className='col'>
              <PlayerInfoCard username={username} publicWallet={userWallet} onCopy={onCopy} hasCopied={hasCopied} setIsUserModalOpen={setIsUserModalOpen} />
              <div className='menu-row mt-5'>
                <div className='col-8'>
                  <TableContainer textColor={"white"} overflowY="scroll" backgroundColor={"rgba(0,0,0,0.8)"} height={"525px"}>
                    <Table variant='simple' layout={"responsive"}>
                      <Thead position="sticky" top={0} zIndex="10" backgroundColor={"black"}>
                        <Tr>
                          <Th className='text-white'>Map Preview</Th>
                          <Th className='text-white'>Game Name</Th>
                          <Th className='text-white'>Players</Th>
                          <Th className='text-white'>Join / Spectate</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {gameList &&
                          gameList
                            .filter((game) => game.name.toLowerCase().includes(filter))
                            .filter((game) =>
                              selectedPlayers.length === 0 ||
                              selectedPlayers.includes(Number(game.numberOfPlayer))
                            )
                            .map((game, key) => (
                              <Tr key={key}>
                                <Td><img src={mapImg} alt="Map Image" width={"75"} height={"75"} /></Td>
                                <Td>{game.name}</Td>
                                <Td>{Number(game.numberOfPlayer)} / {Number(game.limitOfPlayer)}</Td>
                                <Td>
                                  <JoinGameButtom gameState={game.state} username={username} setIsJoinGameModalOpen={setIsJoinGameModalOpen} setGameID={setGameID} gameID={Number(game.mirror)} />
                                  <SpectatorButton gameState={game.state} />
                                </Td>
                              </Tr>
                            ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </div>
                <div className='col-4'>
                  <div id="menu-items">
                    <div>
                      <span className='text-white'>QUICK FILTER</span>
                      <Accordion defaultIndex={[0]} allowMultiple>
                        <AccordionItem>
                          <AccordionButton>
                            <Box as="span" flex='1' textAlign='left' textColor={"white"}>
                              Filter by Game Name
                            </Box>
                            <AccordionIcon color={"white"} />
                          </AccordionButton>
                          <AccordionPanel>
                            <input className='form-control bg-transparent text-white dark-input'
                              type="text"
                              onChange={(e) => setFilter(e.target.value)}
                              placeholder='Game Name' />
                          </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem>
                          <AccordionButton>
                            <Box as="span" flex='1' textAlign='left' textColor={"white"}>
                              Filter by # of User
                            </Box>
                            <AccordionIcon color={"white"} />
                          </AccordionButton>
                          <AccordionPanel>
                            {Array.from({ length: 6 }, (_, i) => i + 3).map((numPlayers) => (
                              <div key={numPlayers}>
                                <Checkbox
                                  size='md'
                                  colorScheme='green'
                                  color={"white"}
                                  checked={selectedPlayers.includes(numPlayers)}
                                  onChange={() => togglePlayerFilter(numPlayers)}>
                                  {numPlayers}
                                </Checkbox>
                              </div>
                            ))}
                          </AccordionPanel>
                        </AccordionItem>
                      </Accordion>
                    </div>
                    <CreateGameButton setIsCreateGameModalOpen={setIsCreateGameModalOpen} username={username} />
                    <GameTutorialButton />
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </>
      <UserNameModal isOpen={isUserModalOpen} setIsOpen={setIsUserModalOpen} />
      <CreateGameModal isOpen={isCreateGameModalOpen} setIsOpen={setIsCreateGameModalOpen} isJoinOpen={isJoinGameModalOpen} setIsJoinOpen={setIsJoinGameModalOpen} />
      <JoinGameModal isOpen={isJoinGameModalOpen} setIsOpen={setIsJoinGameModalOpen} />
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

const JoinGameButtom = ({ gameState, username, setIsJoinGameModalOpen, setGameID, gameID }: { gameState: any, username: any, setIsJoinGameModalOpen: (value: boolean) => void, setGameID: (value: number) => void, gameID: number }) => {
  return (
    <button
      className='btn btn-dark menu-join-button me-2'
      disabled={!gameState || !username}
      onClick={() => {
        setIsJoinGameModalOpen(true)
        setGameID(gameID)
      }}
    >
      Join
    </button>
  )
}

const SpectatorButton = ({ gameState }: { gameState: any }) => {
  if (gameState === 3 || gameState === 4) {
    return (
      <Link to={'/game/spectator'}>
        <button
          className='btn btn-dark menu-spectate-button'
        >
          Spectate
        </button>
      </Link>
    )
  } else {
    return (
      <button
        className='btn btn-dark menu-spectate-button'
        disabled={true}
      >
        Spectate
      </button>
    )
  }
}

const RegenerateButton = ({ isLoading, handleRefresh }: { isLoading: boolean, handleRefresh: (event: any) => void, }) => {
  return (
    <button
      className='btn btn-dark menu-buttons mb-4'
      disabled={isLoading || true}
      onClick={handleRefresh}
    >
      Regenerate the Terrain
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

const Loader = ({ progress }: { progress: any }) => {
  return (
    <div className="loader-box">
      <div className="d-flex justify-content-center pt-3">
        <Progress colorScheme="linkedin"
          borderRadius={"25px"}
          width={"75%"}
          height='32px'
          hasStripe
          isAnimated
          value={progress ? progress.percentage * 100 : 0} />
      </div>
      <div className="text-center p-3">
        <p className="text-white text-2xl">{progress ? (progress.percentage !== 100 ? progress.percentage * 100 : 100) : 0}%</p>
        <p className="text-white text-xl">{progress ? progress.message : "Fetching data from blockchain"}...</p>
      </div>
    </div>
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

const PlayerInfoCard = ({ username, publicWallet, onCopy, hasCopied, setIsUserModalOpen }: { username: string, publicWallet: string, onCopy: () => void, hasCopied: boolean, setIsUserModalOpen: (value: boolean) => void }) => {
  const truncatedPublicWallet = publicWallet.length > 10 ? publicWallet.substring(0, 10) + '...' : publicWallet;

  return (
    <div className='row d-flex justify-center'>
      <div className="menu-user-info-modal">
        <div className='d-flex align-items-center justify-content-evenly'>
          <WrapItem>
            <Avatar name={username} />
          </WrapItem>
          <div>
            <p className='d-flex align-content-center'>Public Wallet: {truncatedPublicWallet}<Button ms={2} size={"xs"} colorScheme={"whiteAlpha"} onClick={onCopy}>{hasCopied ? "Copied!" : "Copy"}</Button></p>
            {username && <p>Username: {username}</p>}
            {!username && <div className='d-flex align-content-center justify-content-center'><Button ms={2} size={"sm"} colorScheme={"whiteAlpha"} onClick={() => setIsUserModalOpen(true)}>Enter Username</Button></div>}
          </div>
        </div>
      </div>
    </div>
  )
}