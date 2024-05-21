import { useToast } from '@chakra-ui/react'
import { usePlayer } from './context/PlayerContext'
import { useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'

export const MyBalance = () => {
    const { userWallet } = usePlayer()
    const account = useAccount()
    const { data } = useBalance({
        address: userWallet!,
        chainId: account.chainId
    })

    const toast = useToast()
    const id = "balanceMessage"

    useEffect(() => {
        if (data && account.isConnected && !toast.isActive(id)) {
            const message = `Your balance is ${data.value} ETH. Please keep reasonable amount in your burner wallet to make every transaction successfully.`

            toast({
                id,
                description: message,
                status: "info",
                duration: null,
                isClosable: true,
                position: "top-left",
                variant: "left-accent",
                containerStyle: {
                    borderRadius: "25px",
                    backgroundColor: "#751414"
                }
            })
        }
    }, [data, account])
}