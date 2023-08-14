import "../../styles/globals.css";
import { useState } from "react";
import { usePlayer } from '../../context/PlayerContext';
import { useWarResult } from '../../hooks/useWarResult';
import warResultIcon from '../../images/warResult.png';
import { Button } from "@chakra-ui/react";


export const WarResultDrawer = () => {
    const [isOpen, setIsOpen] = useState(true);
    const warResults = useWarResult(5);
    const { userWallet } = usePlayer();

    const toggleOffcanvas = () => {
        setIsOpen(!isOpen);
    };

    const drawerButtonStyles: any = {
        zIndex: 1,
        height: "60px",
        width: "60px",
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        marginTop: "25px",
        fontSize: "30px"
    }

    return (
        <div>
            <Button colorScheme="yellow" style={drawerButtonStyles} onClick={toggleOffcanvas}>
                <img src={warResultIcon} width={"30px"} height={"30px"}></img>
            </Button>
            <div id="warResultDrawer" className={`my-war-result-drawer ${isOpen ? "open" : ""}`}>
                <h4 className="text-center text-white p-2 mb-2 border-bottom">War Results</h4>
                <div >
                    {warResults && warResults.data.map((data, key) => {
                        if (data.type === "army") {
                            return <WarResult text={"⚔️"} data={data} userWallet={userWallet} key={key} />
                        }
                        else {
                            return <WarResult text={"⚔️🏰"} data={data} userWallet={userWallet} key={key} />
                        }
                    })}
                </div>
            </div>
        </div>
    );
};

interface WarResultPropTypes {
    text: string,
    data: any,
    userWallet: any,
    key: any
}

const WarResult = (props: WarResultPropTypes) => {
    if (props.data.data?.isDraw === true) {
        return <p className='text-white mb-3' key={props.key}><span className='bg-primary p-2'>You</span> {props.text} <span className='bg-primary p-2'>Enemy</span> (Draw)</p>
    }
    else if (props.data.data?.winner === props.userWallet?.address.toLocaleLowerCase()) {
        return <p className='text-white mb-3' key={props.key}><span className='bg-success p-2'>You</span> {props.text} <span className='bg-danger p-2'>Enemy</span> (Win)</p>
    }
    else if (props.data.data?.loser === props.userWallet?.address.toLocaleLowerCase()) {
        return <p className='text-white mb-3' key={props.key}><span className='bg-danger p-2'>You</span> {props.text} <span className='bg-success p-2'>Enemy</span> (Lose)</p>
    }
    return null;
}
