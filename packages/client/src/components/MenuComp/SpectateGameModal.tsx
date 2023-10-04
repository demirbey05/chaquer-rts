import { useHistory } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import { useGame } from "../../context/GameContext";

export const SpectateGameModal = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (value: boolean) => void }) => {
    const { gameID, setGameID } = useGame();

    let history = useHistory();

    const toggleDrawer = () => {
        setIsOpen(!isOpen)
    }

    const handleSpectate = () => {
        history.push(`/spectator/${gameID}`)
    }

    if (isOpen) {
        return (
            <div className="join-game-modal-overlay">
                <div className="join-game-modal-container">
                    <div className="join-game-modal">
                        <div className="modal-header justify-center mb-2">
                            <h1 className="modal-title text-2xl" id="userNameModalLabel">
                                Spectate Game
                            </h1>
                        </div>
                        <div className="modal-header justify-center mb-2">
                            <p>Click to Spectate Game button to join as a spectator.</p>
                        </div>
                        <div className="modal-footer justify-content-around mt-3">
                            <BackMapButton toggleDrawer={toggleDrawer} setGameID={setGameID} />
                            <SpectateGameButton onClick={handleSpectate} />
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return null;
    }
}


const SpectateGameButton = ({ onClick }: any) => {
    return <Button
        colorScheme="whatsapp"
        border="solid"
        textColor="dark"
        onClick={() => onClick()}
    >
        Spectate Game
    </Button>
}

const BackMapButton = ({ toggleDrawer, setGameID }: { toggleDrawer: () => void, setGameID: (value: number | undefined) => void }) => {
    return (
        <Button
            colorScheme="red"
            border="solid"
            textColor="dark"
            onClick={() => {
                setGameID(0)
                toggleDrawer();
            }}
        >
            Back to Menu
        </Button>
    )
}