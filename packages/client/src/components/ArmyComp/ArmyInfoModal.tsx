import { Button } from "@chakra-ui/react";
import archerImg from "../../images/archer.png";
import cavalryImg from "../../images/cavalry.png";
import swordsmanImg from "../../images/swordsman.png";
import { useMyArmy } from "../../hooks/useMyArmy";
import React, { useState } from "react";
import { usePlayer } from "../../context/PlayerContext";

// Scroll to div by id as middle of the screen
const scrollToDiv = (targetId: any) => {
    const targetDiv = document.getElementById(targetId);
    const scrollOptions: any = {
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
    };

    if (targetDiv) {
        targetDiv.scrollIntoView(scrollOptions);
    }
};

function ArmyInfoModal() {
    const {userWallet} = usePlayer()
    const myArmyPosition: any = useMyArmy(userWallet!.address.toLocaleLowerCase())[0];
    

    // Find the army on the map
    const handleClick = (targetId: any) => {
        scrollToDiv(targetId);

        var myDiv = document.getElementById(targetId);
        myDiv?.classList.add("animate-border");

        setTimeout(function () {
            myDiv?.classList.remove("animate-border");
        }, 6000);
    };

    // Army Info Drag-able functions
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const dragMouseDown = (e: any) => {
        e.preventDefault();
        const pos3 = e.clientX;
        const pos4 = e.clientY;

        const elementDrag = (e: any) => {
            e.preventDefault();
            const dx = pos3 - e.clientX;
            const dy = pos4 - e.clientY;
            const newX = pos.x - dx;
            const newY = pos.y - dy;
            setPos({ x: newX, y: newY });
            pos3 = e.clientX;
            pos4 = e.clientY;
        };

        const closeDragElement = () => {
            document.onmouseup = null;
            document.onmousemove = null;
        };

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    };

    return (
        <>
            <Button style={{
                zIndex: 1,
                height: "60px",
                width: "60px",
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                marginTop: "90px",
                fontSize: "30px"
            }} type="button" colorScheme="yellow" data-bs-toggle="offcanvas" data-bs-target="#armyInfoModal" aria-controls="staticBackdrop">
                ⚔️
            </Button>

            <div style={{ height: "625px", marginTop: "90px", padding: "10px", top: pos.y, left: pos.x }} onMouseDown={dragMouseDown} className="offcanvas offcanvas-start" data-bs-keyboard="false" data-bs-backdrop="false" id="armyInfoModal" aria-labelledby="staticBackdropLabel">
                <div className="offcanvas-header" style={{ cursor: "move" }}>
                    <h5 className="offcanvas-title" id="staticBackdropLabel">My Army Details</h5>
                    <button type="button" data-bs-dismiss="offcanvas" aria-label="Close">&#10008;</button>
                </div>
                <hr></hr>
                <div className="offcanvas-body">
                    {myArmyPosition.length === 0 ? (<p>You have no army!</p>) :
                        (
                            <>
                                {
                                    myArmyPosition.map((army: any, index: number) => {
                                        return (<React.Fragment key={index}>
                                            <div className="row mt-2">
                                                <div className="col align-items-center">
                                                    <div className="row justify-content-center">
                                                        <img
                                                            src={swordsmanImg}
                                                            style={{ height: "75px", width: "65px" }}
                                                        />
                                                    </div>
                                                    <div className="row justify-content-center text-center border-1 mt-2">
                                                        <p style={{ fontSize: "12px" }}>Swordsman: {army.armyConfig.numSwordsman}</p>
                                                    </div>
                                                </div>
                                                <div className="col align-items-center">
                                                    <div className="row justify-content-center">
                                                        <img
                                                            src={archerImg}
                                                            style={{ height: "75px", width: "65px" }}
                                                        />
                                                    </div>
                                                    <div className="row justify-content-center text-center border-1 mt-2">
                                                        <p style={{ fontSize: "12px" }}>Archer: {army.armyConfig.numArcher}</p>
                                                    </div>
                                                </div>
                                                <div className="col align-items-center">
                                                    <div className="row justify-content-center">
                                                        <img
                                                            src={cavalryImg}
                                                            style={{ height: "75px", width: "75px" }}
                                                        />
                                                    </div>
                                                    <div className="row justify-content-center text-center border-1 mt-2">
                                                        <p style={{ fontSize: "12px" }}>Cavalry: {army.armyConfig.numCavalry}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mt-2 align-items-center justify-content-center">
                                                <Button
                                                    colorScheme="linkedin"
                                                    style={{ width: "100px", marginBottom: "5px" }}
                                                    data-bs-toggle="offcanvas"
                                                    data-bs-target="#armyInfoModal"
                                                    onClick={() => handleClick(`${army.position.y},${army.position.x}`)}
                                                >
                                                    Find on Map
                                                </Button>
                                            </div>
                                            <hr></hr>
                                        </React.Fragment>)
                                    })
                                }
                            </>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default ArmyInfoModal
