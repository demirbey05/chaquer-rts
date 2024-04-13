import { useState, useEffect } from "react";
import { Tooltip, Text } from "@chakra-ui/react";
import { usePlayer } from '../../context/PlayerContext';
import { useWarResult } from '../../hooks/useWarResult';
import { useMyUsername } from "../../hooks/IdentityHooks/useMyUsername";
import { useGame } from '../../context/GameContext';

export const WarResultDrawer = () => {
    const [isOpen, setIsOpen] = useState(true);

    const { userWallet } = usePlayer();
    const { gameID, isInputFocused } = useGame();

    const warResults = useWarResult(4, gameID);
    const username = useMyUsername(userWallet)

    const toggleOffcanvas = () => {
        setIsOpen(!isOpen);
    };

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'w' || event.key === 'W') {
            toggleOffcanvas();
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
            <Tooltip label='War Results' placement='top'>
                <button className="war-result-button" onClick={toggleOffcanvas}>
                    💥
                </button>
            </Tooltip>
            <div id="warResultDrawer" className={`my-war-result-drawer ${isOpen ? "open" : ""}`}>
                <div className='d-flex justify-between align-items-center border-bottom mb-3 p-2'>
                    <Text fontSize={"20px"}>War Results</Text>
                    <button type="button" className="me-4" onClick={toggleOffcanvas}>&#10008;</button>
                </div>
                <div>
                    {
                        warResults && warResults.map((data, key) => {
                            if (data.clashType === 3) {
                                return <WarResult username={username} text={"⚔️"} data={data} userWallet={userWallet} key={key} />
                            }
                            else if (data.clashType === 1) {
                                return <WarResult username={username} text={"⚔️💰"} data={data} userWallet={userWallet} key={key} />
                            }
                            else if (data.clashType === 2) {
                                return <WarResult username={username} text={"⚔️⚓"} data={data} userWallet={userWallet} key={key} />
                            }
                            else if (data.clashType === 0) {
                                return <WarResult username={username} text={"⚔️🏰"} data={data} userWallet={userWallet} key={key} />
                            }
                            else {
                                return <WarResult username={username} text={"⚔️🌊"} data={data} userWallet={userWallet} key={key} />
                            }
                        })
                    }
                </div>
            </div>
        </>
    );
};

interface WarResultPropTypes {
    text: string,
    data: any,
    userWallet: any,
    username: string
}

const WarResult = (props: WarResultPropTypes) => {
    if (props.data.isDraw === true) {
        return <Result text={props.text}
            data={props.data}
            userWallet={props.userWallet}
            username={props.username}
            resultText={"Draw"}
            myBgColor={"bg-primary"}
            enemyBgColor={"bg-primary"} />
    }
    else if (props.data.winner === props.userWallet) {
        return <Result text={props.text}
            data={props.data}
            userWallet={props.userWallet}
            username={props.username}
            resultText={"Win"}
            myBgColor={"bg-success"}
            enemyBgColor={"bg-danger"} />
    }
    else if (props.data.loser === props.userWallet) {
        return <Result text={props.text}
            data={props.data}
            userWallet={props.userWallet}
            username={props.username}
            resultText={"Lose"}
            myBgColor={"bg-danger"}
            enemyBgColor={"bg-success"} />
    }
    return null;
}

interface ResultPropTypes {
    text: string,
    data: any,
    userWallet: any,
    username: string,
    resultText: string,
    myBgColor: string,
    enemyBgColor: string
}

const Result = (props: ResultPropTypes) => {
    return <p className='text-white mb-3'>
        <span className={`${props.myBgColor} p-2 border-2 rounded`}>
            {props.username && props.username.length < 9 ? props.username : "You"}
        </span>
        <span className="me-2 ms-2">
            {props.text}
        </span>
        <span className={`${props.enemyBgColor} p-2 border-2 rounded`}>
            Enemy
        </span>
        <span className="ms-2">
            ({props.resultText})
        </span>
    </p>
}