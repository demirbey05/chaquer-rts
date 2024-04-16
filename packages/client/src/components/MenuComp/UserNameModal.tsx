import { useEffect, useState } from 'react';
import { Button } from "@chakra-ui/react";
import { useMUD } from '../../context/MUDContext';

export const UserNameModal = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (value: boolean) => void }) => {
    const { systemCalls } = useMUD()

    const [username, setUsername] = useState<string>("");

    const [disable, setDisable] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (username && username.length >= 3 && username.length < 32) {
            setDisable(false);
        }
        else {
            setDisable(true)
        }
    }, [username]);

    const handleInput = (e: any) => {
        setUsername(e.target.value)
    }

    const onClick = async () => {
        setIsLoading(true)
        await systemCalls.initUsername(username);
        setIsLoading(false)
        setUsername("")
        toggleDrawer();
    }

    if (isOpen) {
        return (
            <div className='username-modal-overlay'>
                <div className='username-modal-container'>
                    <div className="username-modal">
                        <div className="modal-header justify-center mb-4">
                            <h1 className="modal-title text-2xl" id="userNameModalLabel">
                                Username
                            </h1>
                        </div>
                        <input onChange={(e: any) => handleInput(e)}
                            type="text"
                            className="form-control dark-input bg-dark text-white mb-4"
                            id="usernameinput"
                            placeholder="Min 3 Char - Max 32 Char"
                        />
                        <div className="modal-footer justify-content-around mt-3">
                            <BackMapButton
                                toggleDrawer={toggleDrawer}
                                isLoading={isLoading} />
                            <JoinToGameButton
                                onClick={() => onClick()}
                                isLoading={isLoading}
                                disable={disable || isLoading} />
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
        borderRadius={"15px"}
        boxShadow={"0px 5px 0px 0px #33550F"}
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
            borderRadius={"15px"}
            boxShadow={"0px 5px 0px 0px #7E2918"}
            isDisabled={isLoading}
            onClick={toggleDrawer}
        >
            Back to Menu
        </Button>
    )
}
