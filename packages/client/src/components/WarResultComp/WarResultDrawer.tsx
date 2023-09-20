import warResultIcon from '../../images/customAssets/warResult.png';
import { useState } from "react";
import { usePlayer } from '../../context/PlayerContext';
import { useWarResult } from '../../hooks/useWarResult';
import { useMyUsername } from "../../hooks/IdentityHooks/useMyUsername";

export const WarResultDrawer = () => {
    const [isOpen, setIsOpen] = useState(true);

    const { userWallet } = usePlayer();

    const warResults = useWarResult(4);
    const username = useMyUsername(1, userWallet)

    const toggleOffcanvas = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <button className="war-result-button" onClick={toggleOffcanvas}>
                <img src={warResultIcon} width={"30px"} height={"30px"}></img>
            </button>
            <div id="warResultDrawer" className={`my-war-result-drawer ${isOpen ? "open" : ""}`}>
                <h4 className="text-center text-white p-2 mb-2 border-bottom">War Results</h4>
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
        </div>
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
        <span className={`${props.myBgColor} p-2`}>
            {props.username && props.username.length < 9 ? props.username : "You"}
        </span>
        <span className="me-2 ms-2">
            {props.text}
        </span>
        <span className={`${props.enemyBgColor} p-2`}>
            Enemy
        </span>
        <span className="ms-2">
            ({props.resultText})
        </span>
    </p>
}