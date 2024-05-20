import { FaEthereum } from 'react-icons/fa'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, Input, Text } from '@chakra-ui/react'
import { usePlayer } from '../../context/PlayerContext'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useBalance } from 'wagmi'
import { useSendTransaction } from 'wagmi'
import { parseEther } from 'viem'

export const AddBalanceModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const { data: hash, isPending, sendTransaction } = useSendTransaction()
    const { userWallet } = usePlayer()

    const account = useAccount()
    const balance = useBalance({ address: userWallet!, chainId: account.chainId })

    const [addBalance, setAddBalance] = useState<number>(0)

    const handleAddBalance = async () => {
        const to = userWallet!
        const value = addBalance.toString()
        sendTransaction({ to, value: parseEther(value) })
    }

    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent
                maxWidth={"30%"}
                backgroundColor={"rgba(0,0,0,0.75)"}
                textColor={"white"}
                borderRadius={"25px"}
                border={"1px solid white"}
            >
                <ModalHeader
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    Balance <FaEthereum className='ms-2' />
                </ModalHeader>
                <ModalBody>
                    <Text textAlign={"center"} mb={3}>Current Balance: {balance.data?.value}</Text>

                    <Text>Burner Wallet</Text>
                    <Input value={userWallet} mb={3} readOnly />

                    <Text>Amount</Text>
                    <Input type="number" value={addBalance} onChange={(value) => setAddBalance(value.target.value)} />
                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme={"red"}
                        border={"2px solid #68291C"}
                        boxShadow={"0px 3px #68291C"}
                        me={3}
                        isLoading={isPending}
                        onClick={onClose}
                    >
                        Close
                    </Button>
                    <Button
                        colorScheme={"green"}
                        border={"2px solid #1C6820"}
                        boxShadow={"0px 3px #1C6820"}
                        isDisabled={addBalance === 0}
                        isLoading={isPending}
                        loadingText="Pending..."
                        onClick={handleAddBalance}
                    >
                        Add Balance
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}