import map from "../../../map.json";
import { useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";
import { useMUD } from "../../context/MUDContext";
import { useTerrain } from "../../context/TerrainContext";
import { useGame } from "../../context/GameContext";
import { ethers } from "ethers";
import { flatten2D } from "../../utils/terrainArray";

export const CreateGameModal = ({ isOpen, setIsOpen, setIsJoinOpen }: { isOpen: boolean, setIsOpen: (value: boolean) => void, setIsJoinOpen: (value: boolean) => void }) => {
    const { systemCalls } = useMUD();
    const { width, height } = useTerrain();
    const { setGameID } = useGame();

    const [numberOfPlayer, setNumberOfPlayer] = useState<number>(0);
    const [gameName, setGameName] = useState<string>("");

    const [isCreateGameModalOpen, setIsCreateGameModelOpen] = useState<boolean>(false);

    const [disable, setDisable] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const toggleDrawer = () => {
        setIsCreateGameModelOpen(!isCreateGameModalOpen)
    };

    useEffect(() => {
        if (numberOfPlayer <= 5 && numberOfPlayer >= 3 && gameName.length > 0 && gameName.length <= 32) {
            setDisable(false)
        } else {
            setDisable(true)
        }
    }, [numberOfPlayer, gameName])

    const handleCreateGame = async () => {
        setIsLoading(true)
        var buf = new Uint8Array(1);
        crypto.getRandomValues(buf);
        const data: string = ethers.utils.hexlify(flatten2D(map));
        const initGameTx = await systemCalls.initGame(numberOfPlayer, width, height, data, gameName, 1, buf[0]);
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
                !import.meta.env.DEV && await fetch('https://discord.com/api/webhooks/1164497192879411211/hXwMgsEiM-ldEx28QJo5Oqoj1rgeV3_R6DjnvmRAKZKsT7Q3dKMAGKPbY-fg8qrwAqvM', options)
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
                        <div className="modal-header justify-center mb-2">
                            <h1 className="modal-title text-2xl" id="userNameModalLabel">
                                Create Game
                            </h1>
                        </div>
                        <input onChange={(e) => setGameName(e.target.value)}
                            type="text"
                            className="form-control dark-input bg-dark text-white mb-3"
                            id="gameNameInput"
                            placeholder="Game Name (Required)" required />
                        <input onChange={(e) => setNumberOfPlayer(Number(e.target.value))}
                            type="number"
                            className="form-control dark-input bg-dark text-white"
                            id="numberOfPlayerInput"
                            placeholder="Number of Player (Min: 3 - Max: 5)" required />
                        <div className="modal-footer justify-content-around mt-3">
                            <BackMapButton toggleDrawer={toggleDrawer} isLoading={isLoading} />
                            <CreateGameButton onClick={() => handleCreateGame()} isLoading={isLoading} disable={disable || isLoading} />
                        </div>
                    </div>
                </div>
            </div>
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
                When creating a game, it is crucial to ensure that you can assemble a sufficient number of participants for the game to commence.
                If you cannot, the game will be not started.
            </p>
            <Button onClick={() => { setIsCreateGameModalOpen(true); setIsOpen(false) }} border={"2px"} colorScheme={"facebook"} mt={3}>I Understood</Button>
        </>
    )
} 