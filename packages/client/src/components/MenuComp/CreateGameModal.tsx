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

    const [disable, setDisable] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (numberOfPlayer <= 8 && numberOfPlayer >= 3 && gameName.length > 0 && gameName.length <= 32) {
            setDisable(false)
        } else {
            setDisable(true)
        }
    }, [numberOfPlayer, gameName])

    const handleCreateGame = async () => {
        setIsLoading(true)
        const data: string = ethers.utils.hexlify(flatten2D(map));
        const initGameTx = await systemCalls.initGame(numberOfPlayer, width, height, data, gameName, 1);
        if (initGameTx) {
            setGameID(Number(initGameTx.result))
            setIsLoading(false)
            toggleDrawer();
            setIsJoinOpen(true)
        }
        setIsLoading(false)
    }

    if (isOpen) {
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
                            placeholder="Number of Player (Min: 3 - Max: 8)" required />
                        <div className="modal-footer justify-content-around mt-3">
                            <BackMapButton toggleDrawer={toggleDrawer} isLoading={isLoading} />
                            <CreateGameButton onClick={() => handleCreateGame()} isLoading={isLoading} disable={disable || isLoading} />
                        </div>
                    </div>
                </div>
            </div>
        )
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