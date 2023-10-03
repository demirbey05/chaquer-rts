import { useEffect, useState } from 'react';
import { Button } from "@chakra-ui/react";
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

    const userValid = usePlayerIsValid(1, userWallet);
    const gameState = useGameState(1);
    const numberOfUsers = useNumberOfUsers(1);


    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (userName && userName.length >= 3 && userName.length < 32) {
            setDisable(false);
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
        const userNameTx = await systemCalls.initUsername(userName!);

        if (userNameTx == null) {
            setErrorMessage("An error occurred while trying to join to the game.")
            setErrorTitle("Username Error")
            setShowError(true)
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }

        toggleDrawer();
    }

    if (isOpen) {
        return (
            <div className='username-modal-overlay'>
                <div className='username-modal-container'>
                    <div className="username-modal">
                        <div className="modal-header justify-center mb-2">
                            <h1 className="modal-title text-2xl" id="userNameModalLabel">
                                Username
                            </h1>
                        </div>
                        < input onChange={(e: any) => handleInput(e)}
                            type="text"
                            className="form-control dark-input bg-dark text-white"
                            id="usernameinput"
                            placeholder="Please enter your username" />
                        <div className="modal-footer justify-content-around mt-3">
                            <BackMapButton toggleDrawer={toggleDrawer} isLoading={isLoading} />
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
        loadingText='Assigning'
        onClick={() => onClick()}
    >
        Assign Username
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
