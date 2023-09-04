import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, useDisclosure, Progress, CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import { useState, useRef, useEffect } from 'react'
import { usePlayer } from '../../context/PlayerContext';
import { useMUD } from '../../MUDContext';
import { useError } from '../../context/ErrorContext';
import { useSeedUsers } from '../../hooks/useSeedUsers';
import { useCountOfPlayerSeed } from '../../hooks/useCountOfPlayerSeed';
import { limitOfUser } from '../../utils/constants/constants';

export const PlayerSeedModal = () => {
    const { systemCalls } = useMUD()
    const [disable, setDisable] = useState<boolean>(true);
    const [seedEntered, setSeedEntered] = useState<boolean>(false);

    const { isOpen, onClose } = useDisclosure({ isOpen: true })

    const initialRef = useRef(null);

    const { userWallet, setPlayerSeed, playerSeed } = usePlayer();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();

    const playerSeeds = useSeedUsers(1);
    const playerSeedCount = useCountOfPlayerSeed(1);

    useEffect(() => {
        if (playerSeeds?.find(data => { return data === userWallet })) {
            setSeedEntered(true)
        }
    }, [playerSeeds])

    const handleInput = (e: any) => {
        if (e.target.value > 0 && e.target.value < 100) {
            setPlayerSeed(e.target.value)
            setDisable(false);
        }
        else {
            setDisable(true);
        }
    }

    const handleConfirmClick = async () => {
        if (playerSeed) {
            const tx = await systemCalls.commitSeed(1, playerSeed);
            if (tx == null) {
                setErrorMessage("An error occurred while trying to enter player seed.")
                setErrorTitle("Player Seed Error")
                setShowError(true)
                return
            }
        }
        onClose();
    }

    return (
        <>
            {
                !seedEntered ?
                    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} isCentered={true}>
                        <ModalOverlay />
                        <ModalContent className="bg-dark text-white">
                            <ModalHeader className='text-center text-2xl'>Player Seed Stage</ModalHeader>
                            <hr />
                            <ModalBody>
                                <input ref={initialRef}
                                    onChange={(e: any) => handleInput(e)}
                                    type="number"
                                    className="form-control dark-input bg-dark text-white"
                                    id="usernameinput"
                                    placeholder='Enter player seed between 1-100' />
                            </ModalBody>
                            <ModalFooter>
                                <Button isDisabled={disable}
                                    onClick={handleConfirmClick}
                                    colorScheme='whatsapp'
                                    border="solid"
                                    textColor="dark">
                                    Confirm
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal> :
                    <div id="overlay" className="waiting-for-players-fade-overlay">
                        <div className="waiting-for-players-message-container">
                            <span className="waiting-for-players-info-message">Waiting players to enter their player seed...</span>
                            <span className="waiting-for-players-info-message d-flex align-items-center">
                                Need {limitOfUser - playerSeedCount} player to initialize the resources.
                                <CircularProgress className='ms-4' value={((playerSeedCount) / Number(limitOfUser)) * 100} color='green.400' thickness='12px'>
                                    <CircularProgressLabel>({playerSeedCount}/{limitOfUser})</CircularProgressLabel>
                                </CircularProgress>
                            </span>
                            <Progress size='sm' colorScheme={"whatsapp"} isIndeterminate />
                        </div>
                    </div >
            }
        </>
    )
}