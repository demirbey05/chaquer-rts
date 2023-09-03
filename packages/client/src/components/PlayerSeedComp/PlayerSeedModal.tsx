import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, useDisclosure } from '@chakra-ui/react'
import { useState, useRef } from 'react'
import { usePlayer } from '../../context/PlayerContext';
import { useMUD } from '../../MUDContext';
import { useError } from '../../context/ErrorContext';

export const PlayerSeedModal = () => {
    const { isOpen, onClose } = useDisclosure({ isOpen: true })
    const [disable, setDisable] = useState<boolean>(true);
    const initialRef = useRef(null);

    const { setPlayerSeedStage, setPlayerSeed, savePlayerSeedStage, playerSeed } = usePlayer();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();
    const { systemCalls } = useMUD()

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
        setPlayerSeedStage(false);
        savePlayerSeedStage();
    }

    return (
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
        </Modal>
    )
}