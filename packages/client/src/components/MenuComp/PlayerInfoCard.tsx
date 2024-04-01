import { useEffect } from 'react';
import { Avatar, WrapItem, Button, Tag, useClipboard } from '@chakra-ui/react';
import { usePlayer } from '../../context/PlayerContext';
import { IoMdWarning } from "react-icons/io";
import { FaEdit } from "react-icons/fa";

export const PlayerInfoCard = ({ username, setIsUserModalOpen }: { username: string, setIsUserModalOpen: (value: boolean) => void }) => {
    const showUsername = username;

    return (
        <div className='d-flex justify-center playerCardMargin'>
            <div className="player-card-info-modal">
                <div className='d-flex justify-content-center mb-2'>
                    <WrapItem>
                        <Avatar name={username} />
                    </WrapItem>
                </div>
                <div className='d-flex flex-column align-items-center'>
                    {
                        showUsername ? (
                            <>
                                <Tag
                                    size='lg'
                                    backgroundColor={" #0E3C4B"}
                                    textColor={"white"}
                                    justifyContent={"center"}
                                    width={"100%"}
                                    clipPath={"polygon(100% 0, 100% 100%, 0% 100%, 10% 52%, 0% 0%)"}
                                >
                                    {username.toLocaleUpperCase()}
                                </Tag>
                                <Button
                                    mt={2}
                                    borderRadius={"15px"}
                                    boxShadow={"0px 5px 0px 0px #0E3C4B"}
                                    backgroundColor={"#17667F"}
                                    colorScheme={"facebook"}
                                    onClick={() => setIsUserModalOpen(true)}
                                >
                                    <FaEdit />
                                </Button>
                            </>
                        ) : (
                            <div className='d-flex justify-content-center'>
                                <Button
                                    borderRadius={"15px"}
                                    boxShadow={"0px 5px 0px 0px #0E3C4B"}
                                    backgroundColor={"#17667F"}
                                    colorScheme={"facebook"}
                                    onClick={() => setIsUserModalOpen(true)}
                                >
                                    Assign Username
                                </Button>
                            </div>
                        )}
                </div>
                {!showUsername && (
                    <div className='mt-2'>
                        <p className='d-flex justify-content-center align-items-center'>
                            <IoMdWarning className="me-2 text-danger text-2xl" />
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

    const truncatedPublicWallet = userWallet ? (userWallet.length > 20 ? userWallet.substring(0, 20) + '...' : userWallet) : "";

    useEffect(() => {
        if (userWallet) {
            setValue(userWallet.toString());
        }
    }, [userWallet]);

    return (
        <>
            <Tag
                size={"lg"}
                backgroundColor={"#0E3C4B"}
                textColor={"white"}
            >
                {truncatedPublicWallet}
            </Tag>
            <Button
                mt={2}
                boxShadow={"0px 5px 0px 0px #0E3C4B"}
                borderRadius={"15px"}
                backgroundColor={"#17667F"}
                colorScheme={"facebook"}
                onClick={onCopy}
            >
                {hasCopied ? "Copied!" : "Copy"}
            </Button>
        </>
    );
};