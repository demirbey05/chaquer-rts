import { useEffect } from 'react';
import { Avatar, WrapItem, Button, Tag, useClipboard } from '@chakra-ui/react';
import { usePlayer } from '../../context/PlayerContext';
import { WarningTwoIcon, EditIcon } from "@chakra-ui/icons";

export const PlayerInfoCard = ({ username, setIsUserModalOpen }: { username: string, setIsUserModalOpen: (value: boolean) => void }) => {
    const showUsername = username;

    return (
        <div className='row d-flex justify-center playerCardMargin'>
            <div className="player-card-info-modal">
                <div className='d-flex justify-content-center mb-2'>
                    <WrapItem>
                        <Avatar name={username} />
                    </WrapItem>
                </div>
                <div className='d-flex justify-content-center align-items-center mt-2 mb-2'>
                    <PublicWallet />
                </div>
                <div className='d-flex justify-content-center align-items-center'>
                    {showUsername ? (
                        <>
                            <Tag
                                padding={"10px"}
                                size='lg'
                                backgroundColor={"blue.800"}
                                borderRadius='full'>
                                Username: {username}
                            </Tag>
                            <Button
                                border={"2px"}
                                padding={"10px"}
                                ms={2}
                                backgroundColor={"blue.800"}
                                colorScheme={"facebook"}
                                onClick={() => setIsUserModalOpen(true)}>
                                <EditIcon />
                            </Button>
                        </>
                    ) : (
                        <div className='d-flex justify-content-center'>
                            <Button
                                border={"2px"}
                                padding={"10px"}
                                backgroundColor={"blue.800"}
                                colorScheme={"facebook"}
                                onClick={() => setIsUserModalOpen(true)}>
                                Assign Username
                            </Button>
                        </div>
                    )}
                </div>
                {!showUsername && (
                    <div className='mt-2'>
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
        <>
            <Tag
                padding={"10px"}
                size='lg'
                backgroundColor={"blue.800"}
                borderRadius='full'>
                Public Wallet: {truncatedPublicWallet}
            </Tag>
            <Button
                border={"2px"}
                padding={"10px"}
                ms={2}
                colorScheme={"facebook"}
                backgroundColor={"blue.800"}
                onClick={onCopy}>
                {hasCopied ? "Copied!" : "Copy"}
            </Button>
        </>
    );
};