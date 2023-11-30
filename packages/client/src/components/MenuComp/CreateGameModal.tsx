import map1Data from '../../../map1.json'
import map2Data from '../../../map2.json'
import map3Data from '../../../map3.json'
import { useEffect, useState } from "react";
import { Button, Radio, RadioGroup, Stack, Tabs, Tab, TabList, TabPanel, TabPanels, Image, } from "@chakra-ui/react";
import { useMUD } from "../../context/MUDContext";
import { useTerrain } from "../../context/TerrainContext";
import { useGame } from "../../context/GameContext";
import { ethers } from "ethers";
import { flatten2D } from "../../utils/terrainArray";
import map1 from '../../images/maps/map1.jpg'
import map2 from '../../images/maps/map2.jpg'
import map3 from '../../images/maps/map3.jpg'

const discordAPIURI = 'https://discord.com/api/webhooks/1164497192879411211/hXwMgsEiM-ldEx28QJo5Oqoj1rgeV3_R6DjnvmRAKZKsT7Q3dKMAGKPbY-fg8qrwAqvM';

export const CreateGameModal = ({ isOpen, setIsOpen, setIsJoinOpen }: { isOpen: boolean, setIsOpen: (value: boolean) => void, setIsJoinOpen: (value: boolean) => void }) => {
    const { systemCalls } = useMUD();
    const { width, height } = useTerrain();
    const { setGameID } = useGame();

    const [numberOfPlayer, setNumberOfPlayer] = useState<number>(3);
    const [gameName, setGameName] = useState<string>("");
    const [mapID, setMapID] = useState<number>(1);

    const [isCreateGameModalOpen, setIsCreateGameModelOpen] = useState<boolean>(false);

    const [disable, setDisable] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const toggleDrawer = () => {
        setIsCreateGameModelOpen(!isCreateGameModalOpen)
    };

    useEffect(() => {
        if (gameName.length > 0 && gameName.length <= 32) {
            setDisable(false)
        } else {
            setDisable(true)
        }
    }, [gameName])

    const handleCreateGame = async () => {
        setIsLoading(true)

        var buf = new Uint8Array(1);
        crypto.getRandomValues(buf);
        let data: string;
        if (mapID === 1) {
            data = ethers.utils.hexlify(flatten2D(map1Data));
        } else if (mapID === 2) {
            data = ethers.utils.hexlify(flatten2D(map2Data));
        } else {
            data = ethers.utils.hexlify(flatten2D(map3Data));
        }

        const initGameTx = await systemCalls.initGame(numberOfPlayer, width, height, data, gameName, mapID, buf[0]);
        if (initGameTx) {
            setGameID(Number(initGameTx.result))
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: "<@&1146814229312188477>",
                    embeds: [
                        {
                            fields: [
                                { name: "Game Name", value: `${gameName}`, inline: true },
                                { name: "Player Limit", value: `${numberOfPlayer}`, inline: true },
                            ],
                            title: "New Game Created!",
                            description: "[Go to game](https://go.chaquer.xyz)",
                            color: 10025880,
                        },
                    ],
                }),
            };

            try {
                !import.meta.env.DEV && await fetch(discordAPIURI, options)
            } catch (e) {
                console.log(e)
            }

            setIsLoading(false)
            toggleDrawer();
            setIsJoinOpen(true)
        }
        setIsLoading(false)
    }


    if (isCreateGameModalOpen) {
        return (
            <div className='menu-create-game-overlay'>
                <div className='menu-create-game-container'>
                    <div className="menu-create-game-modal">
                        <p className="text-xl mb-2">Game Name</p>
                        <input onChange={(e) => setGameName(e.target.value)}
                            type="text"
                            className="form-control dark-input bg-dark text-white mb-3"
                            id="gameNameInput"
                            placeholder="Game Name (Required)"
                            required />
                        <p className="text-xl mb-2">Number of Players</p>
                        <RadioGroup
                            className="d-flex justify-content-center mb-3"
                            onChange={(value) => setNumberOfPlayer(Number(value))}
                            value={numberOfPlayer.toString()}>
                            <Stack direction='row' spacing={5}>
                                <Radio colorScheme='green' size='lg' value='3'>3</Radio>
                                <Radio colorScheme='green' size='lg' value='4'>4</Radio>
                                <Radio colorScheme='green' size='lg' value='5'>5</Radio>
                            </Stack>
                        </RadioGroup>
                        <p className="text-xl mb-2">Map Selection</p>
                        <Tabs defaultIndex={mapID - 1} isFitted variant='enclosed' onChange={(value) => setMapID(value + 1)}>
                            <TabList>
                                <Tab _selected={{ color: 'white', bg: 'green.500' }}>King's Crest</Tab>
                                <Tab _selected={{ color: 'white', bg: 'green.500' }}>Iron Valley</Tab>
                                <Tab _selected={{ color: 'white', bg: 'green.500' }}>Mystic Highlands</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <div className='d-flex justify-content-center'>
                                        <Image
                                            boxSize='250px'
                                            fit={"fill"}
                                            src={map1}
                                        />
                                    </div>
                                </TabPanel>
                                <TabPanel>
                                    <div className='d-flex justify-content-center'>
                                        <Image
                                            boxSize='250px'
                                            fit={"fill"}
                                            src={map2}
                                        />
                                    </div>
                                </TabPanel>
                                <TabPanel>
                                    <div className='d-flex justify-content-center'>
                                        <Image
                                            boxSize='250px'
                                            fit={"fill"}
                                            src={map3}
                                        />
                                    </div>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                        <div className="modal-footer justify-content-around mt-3">
                            <BackMapButton toggleDrawer={toggleDrawer} isLoading={isLoading} />
                            <CreateGameButton onClick={() => handleCreateGame()} isLoading={isLoading} disable={disable || isLoading} />
                        </div>
                    </div>
                </div>
            </div >
        )
    } else if (isOpen) {
        return <div className='menu-create-game-overlay'>
            <div className='menu-create-game-container'>
                <div className="menu-create-game-modal">
                    <CreateGameWarning setIsCreateGameModalOpen={setIsCreateGameModelOpen} setIsOpen={setIsOpen} />
                </div>
            </div>
        </div>
    } else {
        return null;
    }
}

const CreateGameButton = ({ disable, onClick, isLoading }: any) => {
    return <Button
        colorScheme="whatsapp"
        border="solid"
        textColor="dark"
        isDisabled={disable}
        isLoading={isLoading}
        loadingText='Creating'
        onClick={() => onClick()}
    >
        Create Game
    </Button>
}

const BackMapButton = ({ toggleDrawer, isLoading }: { toggleDrawer: () => void, isLoading: boolean }) => {
    return (
        <Button
            colorScheme="red"
            isDisabled={isLoading}
            border="solid"
            textColor="dark"
            onClick={toggleDrawer}
        >
            Back to Menu
        </Button>
    )
}

const CreateGameWarning = ({ setIsCreateGameModalOpen, setIsOpen }: { setIsCreateGameModalOpen: (value: boolean) => void, setIsOpen: (value: boolean) => void }) => {
    return (
        <>
            <div className="modal-header justify-center mb-2">
                <h1 className="modal-title text-2xl" id="userNameModalLabel">
                    Warning about Creating Game
                </h1>
            </div>
            <p className="text-info d-flex font-bolder">
                You must reach a sufficient number of players for the game you will create to start, otherwise the game will not start.
                To find players, you can use our discord.
            </p>
            <Button
                onClick={() => { setIsCreateGameModalOpen(true); setIsOpen(false) }}
                border={"2px"}
                colorScheme={"facebook"}
                mt={3}>
                I Understood
            </Button>
        </>
    )
}
