import { useState, useEffect } from 'react'
import { Button } from "@chakra-ui/react";
import { FaUsers } from 'react-icons/fa'
import { useUsernameWithColors } from '../../hooks/IdentityHooks/useUsernamesWithColors';
import { colorPath } from '../../utils/constants/constants';

export const UsersInGameDrawer = () => {
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

    const settingsDrawerButtonStyle: any = {
        zIndex: 6,
        height: "60px",
        width: "60px",
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        marginTop: "220px",
        fontSize: "30px"
    }

    return (
        <>
            <Button colorScheme="yellow" style={settingsDrawerButtonStyle} onClick={toggleDrawer}>
                <FaUsers />
            </Button>
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

interface UserInGameDrawerHeaderPropTypes {
    toggleDrawer: () => void
}

const UserInGameDrawerHeader = (props: UserInGameDrawerHeaderPropTypes) => {
    return (
        <div className='d-flex justify-between border-bottom mb-2 p-2'>
            <h5 className="font-extrabold">Players</h5>
            <button type="button" onClick={props.toggleDrawer}>&#10008;</button>
        </div>
    )
}

interface UserInfoRowPropTypes {
    username: string,
    color: string
}

const UserInfoRow = (props: UserInfoRowPropTypes) => {
    return (
        <div className='row mt-2'>
            <div className='col-8 text-lg'>
                {props.username}
            </div>
            <div className='col-4'>
                <span className='player-color-circle'
                    style={{ backgroundColor: `${props.color}` }}>
                </span>
            </div>
        </div>
    )
}
