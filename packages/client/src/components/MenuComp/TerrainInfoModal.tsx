import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button } from '@chakra-ui/react'
import { InfoOutlineIcon } from '@chakra-ui/icons'

export const TerrainInfoModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        border="solid"
        colorScheme="blackAlpha"
        width="200px"
        variant="ghost"
        textColor="white"
        onClick={onOpen}
        p="7">Terrain Info
        <InfoOutlineIcon ml="2" />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Terrain Info</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TerrainInfo terrainType={"Sea"} backgroundColor={"#0366a4"} />
            <TerrainInfo terrainType={"Mount"} backgroundColor={"#beb89f"} />
            <TerrainInfo terrainType={"Land"} backgroundColor={"#547315"} />
          </ModalBody>
          <ModalFooter>
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
    <h3 className='flex flex-row mb-3'>{props.terrainType}:
      <div className='terrain-info-menu' style={{ backgroundColor: props.backgroundColor }}>
      </div>
    </h3>
  )
}
