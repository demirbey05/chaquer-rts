import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Alert, AlertIcon } from "@chakra-ui/react";
import { useGame } from "../../context/GameContext";
import { usePlayerIsValid } from "../../hooks/IdentityHooks/usePlayerIsValid";
import { useGameData } from "../../hooks/useGameData";
import { usePlayer } from "../../context/PlayerContext";
import { useMUD } from "../../context/MUDContext";

export const JoinGameModal = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (value: boolean) => void }) => {
    const { systemCalls } = useMUD();
    const { gameID, setGameID } = useGame();
    const { userWallet } = usePlayer();

    const userValid = usePlayerIsValid(gameID, userWallet);
    const gameData = useGameData(gameID)

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
    const [joinButtonClicked, setJoinButtonClicked] = useState<boolean>(false);

    const toggleDrawer = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        if (userValid === undefined && gameData) {
            if (gameData.state === 2 || gameData.state === 3 || gameData.state === 4 || Number(gameData.numberOfPlayer) === Number(gameData.limitOfPlayer)) {
                setIsButtonDisabled(true)
            } else {
                setIsButtonDisabled(false)
            }
        } else {
            setIsButtonDisabled(false)
        }
    }, [gameData])

    useEffect(() => {
        const joinGame = async () => {
            if (joinButtonClicked) {
                setIsLoading(true)
                if (userValid === true || userValid === false) {
                    navigate(`/game/${gameID}`);
                } else {
                    const tx = await systemCalls.joinGame(gameID);
                    if (tx) {
                        const interval = setInterval(() => {
                            if (userValid === true || userValid === false) {
                                clearInterval(interval);
                                navigate(`/game/${gameID}`);
                                setIsLoading(false)
                            }
                        }, 1000);
                    }
                }
            }
        };

        if (isOpen) {
            joinGame();
        }
    }, [isOpen, joinButtonClicked, userValid, gameID, history, systemCalls]);

    if (isOpen) {
        return (
            <div className="join-game-modal-overlay">
                <div className="join-game-modal-container">
                    <div className="join-game-modal">
                        <div className="modal-header justify-center mb-2">
                            <h1 className="modal-title text-2xl" id="userNameModalLabel">
                                Join Game
                            </h1>
                        </div>
                        {
                            userValid === undefined && gameData && (gameData.state === 2 || gameData.state === 3 || gameData.state === 4 || Number(gameData.numberOfPlayer) === Number(gameData.limitOfPlayer)) ?
                                <Alert textColor={"black"} status='warning'>
                                    <AlertIcon />
                                    Seems game is full or started. You cannot join.
                                </Alert> :
                                <div className="modal-header justify-center mb-2">
                                    <p>Click to Join Game button to join game.</p>
                                </div>
                        }
                        <div className="modal-footer justify-content-around mt-3">
                            <BackMapButton
                                toggleDrawer={toggleDrawer}
                                isLoading={isLoading}
                                setGameID={setGameID} />
                            <JoinToGameButton
                                onClick={() => setJoinButtonClicked(true)}
                                isLoading={isLoading}
                                disable={isButtonDisabled} />
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return null;
    }
}


const JoinToGameButton = ({ disable, onClick, isLoading }: any) => {
    return <Button
        colorScheme="whatsapp"
        border="solid"
        textColor="dark"
        isDisabled={disable}
        isLoading={isLoading}
        loadingText='Connecting'
        onClick={() => onClick()}
    >
        Join Game
    </Button>
}

const BackMapButton = ({ toggleDrawer, isLoading, setGameID }: { toggleDrawer: () => void, isLoading: boolean, setGameID: (value: number | undefined) => void }) => {
    return (
        <Button
            colorScheme="red"
            isDisabled={isLoading}
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