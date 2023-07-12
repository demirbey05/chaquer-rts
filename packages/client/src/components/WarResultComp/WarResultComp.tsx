import { useState } from "react";
import { usePlayer } from '../../context/PlayerContext';
import { useWarResult } from '../../hooks/useWarResult';
import warResultIcon from '../../images/warResult.png';
import { Button } from "@chakra-ui/react";
import "../../styles/globals.css";

const WarResultComp = () => {
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
            <div className={`mywarresultcanvas ${isOpen ? "open" : ""}`}>
                <h4 className="text-center text-white p-2 mb-2 border-bottom">War Results</h4>
                <div >
                    {warResults && warResults.data.map((data, key) => {
                        console.log(data)
                        if (data.type === "army") {
                            if (data.data?.isDraw === true) {
                                return <p className='text-white mb-3' key={key}><span className='bg-primary p-2'>You</span> ⚔️ <span className='bg-primary p-2'>Enemy</span> (Draw)</p>
                            }
                            else if (data.data?.winner === userWallet?.address.toLocaleLowerCase()) {
                                return <p className='text-white mb-3' key={key}><span className='bg-success p-2'>You</span> ⚔️ <span className='bg-danger p-2'>Enemy</span> (Win)</p>
                            }
                            else if (data.data?.loser === userWallet?.address.toLocaleLowerCase()) {
                                return <p className='text-white mb-3' key={key}><span className='bg-danger p-2'>You</span> ⚔️ <span className='bg-success p-2'>Enemy</span> (Lose)</p>
                            }
                            return null;
                        }
                        else {
                            if (data.data?.isDraw === true) {
                                return <p className='text-white mb-3' key={key}><span className='bg-primary p-2'>You</span> ⚔️🏰 <span className='bg-primary p-2'>Enemy</span> (Draw)</p>
                            }
                            else if (data.data?.winner === userWallet?.address.toLocaleLowerCase()) {
                                return <p className='text-white mb-3' key={key}><span className='bg-success p-2'>You</span> ⚔️🏰 <span className='bg-danger p-2'>Enemy</span> (Win)</p>
                            }
                            else if (data.data?.loser === userWallet?.address.toLocaleLowerCase()) {
                                return <p className='text-white mb-3' key={key}><span className='bg-danger p-2'>You</span> ⚔️🏰 <span className='bg-success p-2'>Enemy</span> (Lose)</p>
                            }
                            return null;
                        }
                    })}
                </div>
            </div>
        </div>
    );
};

export default WarResultComp;
