import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Button,
    useDisclosure
} from '@chakra-ui/react'
import { useState, useRef } from 'react'
import { usePlayer } from '../../context/PlayerContext';
import { useMUD } from '../../MUDContext';

export const PlayerSeedModal = () => {
    const { isOpen, onClose } = useDisclosure({ isOpen: true })
    const [disable, setDisable] = useState<boolean>(true);
    const initialRef = useRef(null);
    const { setPlayerSeedStage, setPlayerSeed, savePlayerSeedStage, playerSeed } = usePlayer();
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
                console.log("Player Seed issue.")
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
            <ModalContent>
                <ModalHeader>Please enter player seed for better game experience</ModalHeader>
                <hr />
                <ModalBody pb={6}>
                    <label htmlFor="playerseedinput" className="form-label">Player Seed</label>
                    <input ref={initialRef} onChange={(e: any) => handleInput(e)} type="number" className="form-control w-75" id="usernameinput" placeholder='Player Seed' />
                </ModalBody>

                <ModalFooter>
                    <Button isDisabled={disable}
                        onClick={handleConfirmClick}
                        colorScheme='blue'
                        mr={3}>
                        Confirm
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}