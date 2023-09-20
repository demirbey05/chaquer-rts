import { useState, useEffect } from 'react'
import { FaUsers } from 'react-icons/fa'
import { useUsernameWithColors } from '../../hooks/IdentityHooks/useUsernamesWithColors';
import { colorPath } from '../../utils/constants/constants';

export const PlayerListDrawer = () => {
    const [isOpen, setIsOpen] = useState(false);

    const users = useUsernameWithColors();

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
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [isOpen]);

    return (
        <>
            <button className='players-list-button' onClick={toggleDrawer}>
                <FaUsers />
            </button>
            <div id="players-in-game-drawer" className={`players-in-game-drawer ${isOpen ? "open" : ""}`}>
                <UserInGameDrawerHeader toggleDrawer={toggleDrawer} />
                <div className='ms-2'>
                    {
                        users ?
                            users.map((user: any, key) => {
                                return <UserInfoRow key={key} username={user.userName} color={colorPath[Number(user.colorIndex)]} />
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
