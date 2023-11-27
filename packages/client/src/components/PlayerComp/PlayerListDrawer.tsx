import { useState, useEffect } from 'react'
import { Tooltip } from '@chakra-ui/react';
import { FaUsers } from 'react-icons/fa'
import { useGame } from '../../context/GameContext';
import { useUsernameWithColors } from '../../hooks/IdentityHooks/useUsernamesWithColors';
import { getBorderColor } from '../../utils/constants/getBorderColors';

export const PlayerListDrawer = ({ isSpectator }: { isSpectator: boolean }) => {
    const { gameID, isInputFocused } = useGame();
    const [isOpen, setIsOpen] = useState(true);

    const users = useUsernameWithColors(gameID);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'u' || event.key === 'U') {
            toggleDrawer();
        } else if (event.key === 'Escape') {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (!isInputFocused) {
            window.addEventListener('keydown', handleKeyPress);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [isOpen, isInputFocused]);

    return (
        <>
            <Tooltip label='Player List' placement='top'>
                <button
                    className='players-list-button'
                    style={isSpectator ? { marginTop: "90px" } : {}}
                    onClick={toggleDrawer}>
                    <FaUsers />
                </button>
            </Tooltip>
            <div id="players-in-game-drawer" className={`players-in-game-drawer ${isOpen ? "open" : ""}`}>
                <UserInGameDrawerHeader toggleDrawer={toggleDrawer} />
                <div className='ms-2'>
                    {
                        users ?
                            users.map((user: any, key: number) => {
                                return <UserInfoRow key={key} username={user.userName} color={getBorderColor(Number(user.colorIndex))} />
                            }) :
                            "No available user"
                    }
                </div>
            </div>
        </>
    );
}

const UserInGameDrawerHeader = ({ toggleDrawer }: { toggleDrawer: () => void }) => {
    return (
        <div className='d-flex justify-between border-bottom mb-2 p-2'>
            <h5 className="font-extrabold">Players</h5>
            <button type="button" onClick={toggleDrawer}>&#10008;</button>
        </div>
    )
}

const UserInfoRow = ({ username, color }: {
    username: string,
    color: string
}) => {
    return (
        <div className='row mt-2'>
            <div className='col-8 text-lg'>
                {username}
            </div>
            <div className='col-4'>
                <span className='player-color-circle'
                    style={{ backgroundColor: `${color}` }}>
                </span>
            </div>
        </div>
    )
}
