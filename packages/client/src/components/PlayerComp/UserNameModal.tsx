import { useHistory } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Button, Alert, AlertIcon, AlertTitle } from "@chakra-ui/react";
import { usePlayer } from '../../context/PlayerContext';
import { useMUD } from '../../context/MUDContext';
import { useError } from '../../context/ErrorContext';
import { usePlayerIsValid } from "../../hooks/IdentityHooks/usePlayerIsValid";
import { useNumberOfUsers } from "../../hooks/IdentityHooks/useNumberOfUsers";
import { useGameState } from '../../hooks/useGameState';
import { limitOfUser } from "../../utils/constants/constants";

export const UserNameModal = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (value: boolean) => void }) => {
    const { systemCalls } = useMUD()

    const { userWallet, setUserName, userName } = usePlayer();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();

    const [disable, setDisable] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [gameIsFull, setGameIsFull] = useState<string>("");

    const userValid = usePlayerIsValid(1, userWallet);
    const gameState = useGameState(1);
    const numberOfUsers = useNumberOfUsers(1);

    let history = useHistory();

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (gameState === 4 || gameState === 3) {
            if (userValid) {
                setDisable(false)
                setGameIsFull("");
            }
            else if (userValid === false) {
                setDisable(false)
                setGameIsFull("");
            }
            else {
                setDisable(true)
                setGameIsFull("The game is full. Reached the player limit.")
            }
        }
        else if (gameState === 2) {
            if (numberOfUsers === limitOfUser) {
                if (userValid) {
                    setDisable(false)
                    setGameIsFull("");
                }
                else {
                    setDisable(true)
                    setGameIsFull("The game is full. Reached the player limit.")
                }
            }
        }
        else if (gameState === 1) {
            if (userValid) {
                setDisable(false)
                setGameIsFull("");
            }
            else if (userName && userName.length >= 3 && userName.length <= 31) {
                setDisable(false);
                setGameIsFull("");
            }
            else {
                setDisable(true)
            }
        }
        else {
            setDisable(true)
        }
    }, [gameState, userValid, numberOfUsers, limitOfUser, userName]);

    const handleInput = (e: any) => {
        setUserName(e.target.value)
    }

    const onClick = async () => {
        setIsLoading(true)
        if (!userValid && gameState === 1) {
            const tx = await systemCalls.joinGame(userName!, 1);

            if (tx == null) {
                setErrorMessage("An error occurred while trying to join to the game.")
                setErrorTitle("Join Game Error")
                setShowError(true)
                setIsLoading(false)
            } else {
                setIsLoading(false)
            }
        }

        if (userValid === true || userValid === false) {
            history.push("/game")
            setIsLoading(false)
        }
    }

    if (isOpen) {
        return (
            <div className='username-modal-overlay'>
                <div className='username-modal-container'>
                    <div className="username-modal">
                        {
                            userValid === undefined && gameState !== 3 &&
                            <div className="modal-header justify-center mb-2">
                                <h1 className="modal-title text-2xl" id="userNameModalLabel">
                                    Username
                                </h1>
                            </div>
                        }
                        {
                            userValid === undefined && gameState === 3 &&
                            <Alert status='warning' color="black" mb={2}>
                                <AlertIcon />
                                <AlertTitle>{gameIsFull}</AlertTitle>
                            </Alert>
                        }
                        {
                            userValid === undefined && gameState !== 3 &&
                            < input onChange={(e: any) => handleInput(e)}
                                type="text"
                                className="form-control dark-input bg-dark text-white"
                                id="usernameinput"
                                placeholder="Please enter your username" />
                        }
                        {
                            (((userValid || userValid === false) && gameState !== 0) && !isLoading) &&
                            <p>Click Join to the Game button to connect to the game.</p>
                        }
                        <div className="modal-footer justify-content-around mt-3">
                            <Button
                                colorScheme="red"
                                isDisabled={isLoading}
                                border="solid"
                                textColor="dark"
                                onClick={toggleDrawer}
                            >
                                Back to Menu
                            </Button>
                            <JoinToGameButton onClick={() => onClick()} isLoading={isLoading} disable={disable || isLoading} />
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
        Join to the Game
    </Button>
}
