import { useEffect } from 'react';
import { Avatar, WrapItem, Button, Tag, useClipboard } from '@chakra-ui/react';
import { usePlayer } from '../../context/PlayerContext';
import { WarningTwoIcon } from "@chakra-ui/icons";

export const PlayerInfoCard = ({ username, setIsUserModalOpen }: { username: string, setIsUserModalOpen: (value: boolean) => void }) => {
    const showUsername = !!username;

    return (
        <div className='row d-flex justify-center'>
            <div className="player-card-info-modal">
                <div className='d-flex justify-content-center mb-2'>
                    <WrapItem>
                        <Avatar name={username} />
                    </WrapItem>
                </div>
                <div className='d-flex justify-content-center mt-2 mb-2'>
                    <PublicWallet />
                </div>
                <div className='d-flex justify-content-center'>
                    {showUsername ? (
                        <Tag
                            size='lg'
                            backgroundColor={"CaptionText"}
                            borderRadius='full'>
                            Username: {username}
                        </Tag>
                    ) : (
                        <div className='d-flex justify-content-center'>
                            <Button
                                size={"sm"}
                                border={"solid"}
                                borderColor={"white"}
                                backgroundColor={"black"}
                                colorScheme={"whiteAlpha"}
                                onClick={() => setIsUserModalOpen(true)}>
                                Assign Username
                            </Button>
                        </div>
                    )}
                </div>
                {!showUsername && (
                    <div className='mt-2 p-1 border rounded'>
                        <p className='d-flex justify-content-center align-items-center'>
                            <WarningTwoIcon me={3} textColor={"red.500"} />
                            You must assign username to play the game
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const PublicWallet = () => {
    const { userWallet } = usePlayer();
    const { onCopy, setValue, hasCopied } = useClipboard("");

    const truncatedPublicWallet = userWallet ? (userWallet.length > 10 ? userWallet.substring(0, 10) + '...' : userWallet) : "";

    useEffect(() => {
        if (userWallet) {
            setValue(userWallet.toString());
        }
    }, [userWallet]);

    return (
        <Tag size='lg' backgroundColor={"CaptionText"} borderRadius='full'>
            Public Wallet: {truncatedPublicWallet}
            <Button
                ms={2}
                size={"xs"}
                colorScheme={"facebook"}
                onClick={onCopy}>
                {hasCopied ? "Copied!" : "Copy"}
            </Button>
        </Tag>
    );
};