import map1 from '../../images/maps/map1.jpg'
import map2 from '../../images/maps/map2.jpg'
import map3 from '../../images/maps/map3.jpg'
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Button } from '@chakra-ui/react'
import { useGameList } from '../../hooks/GameHooks/useGameList';
import { useGame } from '../../context/GameContext';
import { getMapFromMapId } from '../../utils/helperFunctions/CustomFunctions/getMapFromMapId';

export const LiveGameTable = ({ selectedPlayers, gameNameFilter, setIsJoinGameModalOpen, setIsSpectateGameModalOpen, username }:
    { selectedPlayers: number[], gameNameFilter: string, setIsJoinGameModalOpen: (value: boolean) => void, setIsSpectateGameModalOpen: (value: boolean) => void, username: string }) => {
    const { setGameID } = useGame();

    const gameList = useGameList();

    return (
        <TableContainer
            border={"2px"}
            borderRadius={"25px"}
            textColor={"white"}
            overflowY={"auto"}
            backgroundColor={"rgba(0,0,0,0.8)"}
            height={"525px"}>
            <Table variant='simple'>
                <Thead position="sticky" top={0} zIndex="10" backgroundColor={"black"}>
                    <Tr>
                        <Th className='text-white'>Map Preview</Th>
                        <Th className='text-white'>Game Name</Th>
                        <Th className='text-white'>Game State</Th>
                        <Th className='text-white'>Players</Th>
                        <Th className='text-white'>Join / Spectate</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {gameList &&
                        gameList
                            .filter((game) => game.name.toLowerCase().includes(gameNameFilter))
                            .filter((game) =>
                                selectedPlayers.length === 0 ||
                                selectedPlayers.includes(Number(game.numberOfPlayer))
                            )
                            .filter((game) => game.state !== 3)
                            .map((game, key) => (
                                <Tr key={key}>
                                    <Td>
                                        <img
                                            src={getMapFromMapId(game.mapId)}
                                            alt="Map Image"
                                            width={"75"}
                                            height={"75"}
                                            style={{ transform: "rotateX(60deg) rotateZ(45deg)" }} />
                                    </Td>
                                    <Td>
                                        {game.name && game.name.length > 15 ? `${game.name.slice(0, 15)}...` : game.name}
                                    </Td>
                                    <Td>
                                        {getGameState(game.state)}
                                    </Td>
                                    <Td>
                                        {Number(game.numberOfPlayer)} / {Number(game.limitOfPlayer)}
                                    </Td>
                                    <Td>
                                        <JoinGameButtom
                                            isDisabled={!username}
                                            setIsJoinGameModalOpen={setIsJoinGameModalOpen}
                                            setGameID={setGameID}
                                            gameID={Number(game.mirror)} />
                                        <SpectatorButton
                                            username={username}
                                            gameState={game.state}
                                            setIsSpectateGameModalOpen={setIsSpectateGameModalOpen}
                                            setGameID={setGameID}
                                            gameID={Number(game.mirror)} />
                                    </Td>
                                </Tr>
                            ))}
                </Tbody>
            </Table>
        </TableContainer>
    )
}

const JoinGameButtom = ({ isDisabled, setIsJoinGameModalOpen, setGameID, gameID }: { isDisabled: boolean, setIsJoinGameModalOpen: (value: boolean) => void, setGameID: (value: number) => void, gameID: number }) => {
    return (
        <Button
            size={"lg"}
            backgroundColor={"#DCBF9D"}
            borderRadius={"25px"}
            boxShadow={"0px 5px 0px 0px #99866F"}
            me={3}
            isDisabled={isDisabled}
            onClick={() => {
                setIsJoinGameModalOpen(true)
                setGameID(gameID)
            }}>
            Join
        </Button>
    )
}

const SpectatorButton = ({ gameState, setIsSpectateGameModalOpen, setGameID, gameID, username }: { gameState: any, setIsSpectateGameModalOpen: (value: boolean) => void, setGameID: (value: number) => void, gameID: number, username: string }) => {
    return (
        <Button
            size={"lg"}
            backgroundColor={"#DCBF9D"}
            borderRadius={"25px"}
            boxShadow={"0px 5px 0px 0px #99866F"}
            isDisabled={(gameState !== 2 && gameState !== 3) || !username}
            onClick={() => {
                setIsSpectateGameModalOpen(true)
                setGameID(gameID)
            }}>
            Spectate
        </Button>
    )
}

const getGameState = (gameState: number) => {
    if (gameState === 1) {
        return "Waiting for Players"
    }
    else if (gameState === 2) {
        return "Game Started"
    } else {
        return null
    }
}