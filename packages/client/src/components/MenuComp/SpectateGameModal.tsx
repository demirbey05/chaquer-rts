import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import { useGame } from "../../context/GameContext";

export const SpectateGameModal = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (value: boolean) => void }) => {
    const { gameID, setGameID } = useGame();

    const navigate = useNavigate();

    const toggleDrawer = () => {
        setIsOpen(!isOpen)
    }

    const handleSpectate = () => {
        navigate(`/spectator/${gameID}`)
    }

    if (isOpen) {
        return (
            <div className="join-game-modal-overlay">
                <div className="join-game-modal-container">
                    <div className="join-game-modal">
                        <div className="modal-header justify-center mb-4">
                            <h1 className="modal-title text-2xl" id="userNameModalLabel">
                                Spectate Game
                            </h1>
                        </div>
                        <div className="modal-header justify-center mb-4">
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
        borderRadius={"15px"}
        boxShadow={"0px 5px 0px 0px #33550F"}
        onClick={() => onClick()}
    >
        Spectate Game
    </Button>
}

const BackMapButton = ({ toggleDrawer, setGameID }: { toggleDrawer: () => void, setGameID: (value: number | undefined) => void }) => {
    return (
        <Button
            colorScheme="red"
            borderRadius={"15px"}
            boxShadow={"0px 5px 0px 0px #7E2918"}
            onClick={() => {
                setGameID(0)
                toggleDrawer();
            }}
        >
            Back to Menu
        </Button>
    )
}