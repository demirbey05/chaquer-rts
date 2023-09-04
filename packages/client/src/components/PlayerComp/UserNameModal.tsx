import { Link } from 'react-router-dom';
import { Button, Alert, AlertIcon, AlertTitle } from "@chakra-ui/react";
import { usePlayer } from '../../context/PlayerContext';
import { useEffect, useState } from 'react';
import { useMUD } from '../../MUDContext';
import { useError } from '../../context/ErrorContext';
import { usePlayerIsValid } from "../../hooks/usePlayerIsValid";
import { useNumberOfUsers } from "../../hooks/useNumberOfUsers";
import { limitOfUser } from "../../utils/constants/constants";
import { useGameState } from '../../hooks/useGameState';

export const UserNameModal = () => {
    const { systemCalls } = useMUD()

    const { userWallet, setUserName, userName } = usePlayer();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();

    const [disable, setDisable] = useState<boolean>(true);
    const [gameIsFull, setGameIsFull] = useState<string>("");

    const userValid = usePlayerIsValid(1, userWallet);
    const gameState = useGameState(1);
    const numberOfUsers = useNumberOfUsers(1);

    useEffect(() => {
        if (gameState === 3) {
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
            setDisable(false);
            setGameIsFull("");
        }
        else {
            setDisable(false)
        }
    }, [gameState, userValid, numberOfUsers, limitOfUser]);

    const handleInput = (e: any) => {
        setUserName(e.target.value)
    }

    const onClick = async () => {
        if (!userValid && gameState === 1) {
            const tx = await systemCalls.joinGame(userName!, 1);
            if (tx == null) {
                setErrorMessage("An error occurred while trying to join to the game.")
                setErrorTitle("Join Game Error")
                setShowError(true)
                return
            }

        }
    }
    return (
        <div className="modal fade"
            id="userNameModal"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex={-1}
            aria-labelledby="userNameModalLabel"
            aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-dark text-white">
                    {
                        !userValid && gameState !== 3 &&
                        <div className="modal-header justify-center">
                            <h1 className="modal-title text-2xl" id="userNameModalLabel">
                                Username
                            </h1>
                        </div>
                    }
                    <div className="modal-body">
                        {
                            userValid === undefined && gameState === 3 &&
                            <Alert status='warning' color="black">
                                <AlertIcon />
                                <AlertTitle>{gameIsFull}</AlertTitle>
                            </Alert>
                        }
                        {
                            !userValid && gameState !== 3 &&
                            <input onChange={(e: any) => handleInput(e)}
                                type="text"
                                className="form-control dark-input bg-dark text-white"
                                id="usernameinput"
                                placeholder="Please enter your username" />
                        }
                        {
                            (((userValid || userValid === false) && gameState !== 0)) &&
                            <p>It seems you leave the game. Click Join to the Game button to reconnect to the game.</p>
                        }
                    </div>
                    <div className="modal-footer">
                        <Button
                            colorScheme="red"
                            border="solid"
                            textColor="dark"
                            data-bs-dismiss="modal"
                        >
                            Back to Menu
                        </Button>
                        {
                            disable ?
                                <JoinToGameButton disable={disable} /> :
                                <Link to={'/game'}>
                                    <JoinToGameButton onClick={() => onClick()} disable={disable} />
                                </Link>
                        }
                    </div>
                </div>
            </div >
        </div >
    )
}


const JoinToGameButton = ({ disable, onClick }: any) => {
    return <Button
        colorScheme="whatsapp"
        border="solid"
        textColor="dark"
        data-bs-dismiss="modal"
        isDisabled={disable}
        onClick={() => onClick()}
    >
        Join to the Game
    </Button>
}
