import { Avatar, WrapItem, Button } from '@chakra-ui/react'

export const PlayerInfoCard = ({ username, publicWallet, onCopy, hasCopied, setIsUserModalOpen }:
    { username: string, publicWallet: string | undefined, onCopy: () => void, hasCopied: boolean, setIsUserModalOpen: (value: boolean) => void }) => {
    const truncatedPublicWallet = publicWallet!.length > 10 ? publicWallet!.substring(0, 10) + '...' : publicWallet;

    return (
        <div className='row d-flex justify-center'>
            <div className="player-card-info-modal">
                <div className='d-flex justify-content-center mb-2'>
                    <WrapItem>
                        <Avatar name={username} />
                    </WrapItem>
                </div>
                <div className='d-flex justify-content-center mt-2 mb-2'>
                    <p className='d-flex justify-content-center'>Public Wallet: {truncatedPublicWallet}<Button ms={2} size={"xs"} colorScheme={"whiteAlpha"} onClick={onCopy}>{hasCopied ? "Copied!" : "Copy"}</Button></p>
                </div>
                <div className='d-flex justify-content-center'>
                    {username && <p>Username: {username}</p>}
                    {!username &&
                        <div className='d-flex justify-content-center'>
                            <Button colorScheme={"blackAlpha"} onClick={() => setIsUserModalOpen(true)}>
                                Enter Username
                            </Button>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}