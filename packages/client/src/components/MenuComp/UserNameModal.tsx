import { useEffect, useState } from 'react';
import { Button } from "@chakra-ui/react";
import { usePlayer } from '../../context/PlayerContext';
import { useMUD } from '../../context/MUDContext';

export const UserNameModal = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (value: boolean) => void }) => {
    const { systemCalls } = useMUD()
    const { setUserName, userName } = usePlayer();

    const [disable, setDisable] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
    }, [userName]);

    const handleInput = (e: any) => {
        setUserName(e.target.value)
    }

    const onClick = async () => {
        setIsLoading(true)
        await systemCalls.initUsername(userName!);
        setIsLoading(false)
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
                            placeholder="Min 3 Char - Max 32 Char" />
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
        Assign
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
