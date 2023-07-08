import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button
  } from '@chakra-ui/react'
import { InfoOutlineIcon } from '@chakra-ui/icons'

function MyModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    
  return (
    <>
      <Button border="solid" colorScheme="blackAlpha" width="200px" variant="ghost" textColor="white" onClick={onOpen} p="7">Terrain Info<InfoOutlineIcon ml="2"/></Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Terrain Info</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
                <h3 className='flex flex-row mb-3'>Sea: <div style={{width:"300px", height:"30px", backgroundColor:"#0366a4", marginLeft:"30px", borderRadius:"25px"}}></div></h3>
                <h3 className='flex flex-row mb-3'>Mount: <div style={{width:"300px", height:"30px", backgroundColor:"#beb89f", marginLeft:"8px", borderRadius:"25px"}}></div></h3>
                <h3 className='flex flex-row'>Land: <div style={{width:"300px", height:"30px", backgroundColor:"#547315", marginLeft:"21px", borderRadius:"25px"}}></div></h3>
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default MyModal
