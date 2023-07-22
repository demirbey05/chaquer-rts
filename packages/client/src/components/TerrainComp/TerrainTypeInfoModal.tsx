import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, useDisclosure, Button } from '@chakra-ui/react'
import { InfoOutlineIcon } from '@chakra-ui/icons'

export const TerrainTypeInfoModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        colorScheme="whiteAlpha"
        textColor="dark"
        p="8"
        width="200px"
        onClick={onOpen}>
        Terrain Info
        <InfoOutlineIcon ml="2" />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className='text-center text-2xl'>Terrain Info</ModalHeader>
          <ModalBody>
            <TerrainInfo terrainType={"Sea"} backgroundColor={"#0366a4"} />
            <TerrainInfo terrainType={"Mount"} backgroundColor={"#beb89f"} />
            <TerrainInfo terrainType={"Land"} backgroundColor={"#547315"} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} colorScheme="blackAlpha" mt={-5}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

interface TerrainInfoPropTypes {
  terrainType: string,
  backgroundColor: string
}

const TerrainInfo = (props: TerrainInfoPropTypes) => {
  return (
    <h3 className='p-2 mb-3 text-center text-white' style={{ backgroundColor: props.backgroundColor }}>
      {props.terrainType}
    </h3>
  )
}
