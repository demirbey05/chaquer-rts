import map1 from '../../images/maps/map1.jpg'
import map2 from '../../images/maps/map2.jpg'
import map3 from '../../images/maps/map3.jpg'
import { useMUD } from '../../context/MUDContext';
import { getComponentValueStrict } from '@latticexyz/recs';
import { encodeEntity } from '@latticexyz/store-sync/recs';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react'
import { useGameList } from '../../hooks/GameHooks/useGameList';
import { getMapFromMapId } from '../../utils/helperFunctions/CustomFunctions/getMapFromMapId';

export const CompletedGameTable = ({ gameNameFilter }: { gameNameFilter: string }) => {
    const { components } = useMUD();

    const gameList = useGameList();
    return (
        <TableContainer
            border={"2px"}
            borderRadius={"25px"}
            textColor={"white"}
            overflowY={"auto"}
            backgroundColor={"rgba(0,0,0,0.8)"}
            height={"525px"}>
            <Table variant='simple' >
                <Thead position="sticky" top={0} zIndex="10" backgroundColor={"black"}>
                    <Tr>
                        <Th className='text-white'>Map Preview</Th>
                        <Th className='text-white'>Game Name</Th>
                        <Th className='text-white'>Winner</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {gameList &&
                        gameList
                            .filter((game) => game.name.toLowerCase().includes(gameNameFilter))
                            .filter((game) => game.state === 3)
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
                                        {getComponentValueStrict(components.AddressToUsername,
                                            encodeEntity(components.AddressToUsername.metadata.keySchema, { ownerAddress: game.winner }))!.userName}
                                    </Td>
                                </Tr>
                            ))}
                </Tbody>
            </Table>
        </TableContainer>
    )
}