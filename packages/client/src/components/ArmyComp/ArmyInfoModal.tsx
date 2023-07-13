import React, { useState } from "react";
import archerImg from "../../images/archer.png";
import cavalryImg from "../../images/cavalry.png";
import swordsmanImg from "../../images/swordsman.png";
import { Button } from "@chakra-ui/react";
import { useMyArmy } from "../../hooks/useMyArmy";
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

export const ArmyInfoModal = () => {
    const { userWallet } = usePlayer()
    const myArmyPosition: any = useMyArmy(userWallet!.address.toLocaleLowerCase())[0];

    // Find the army on the map
    const handleClick = (targetId: any) => {
        scrollToDiv(targetId);

        var myDiv = document.getElementById(targetId);
        myDiv?.classList.add("animate-border");

        setTimeout(function () {
            myDiv?.classList.remove("animate-border");
        }, 1500);
    };

    // Army Info Drag-able functions
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [pos3, setPos3] = useState(0);
    const [pos4, setPos4] = useState(0);

    const dragMouseDown = (e: any) => {
        e.preventDefault();
        setPos3(e.clientX);
        setPos4(e.clientY);

        const elementDrag = (e: any) => {
            e.preventDefault();
            const dx = pos3 - e.clientX;
            const dy = pos4 - e.clientY;
            const newX = pos.x - dx;
            const newY = pos.y - dy;
            setPos({ x: newX, y: newY });
            setPos3(e.clientX);
            setPos4(e.clientY);
        };

        const closeDragElement = () => {
            document.onmouseup = null;
            document.onmousemove = null;
        };

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    };

    const armyInfoModalButtonStyles: any = {
        zIndex: 1,
        height: "60px",
        width: "60px",
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        marginTop: "90px",
        fontSize: "30px"
    }

    const armyInfoModalOffcanvasDivStyles = {
        height: "625px",
        marginTop: "90px",
        padding: "10px",
        top: pos.y,
        left: pos.x
    }

    return (
        <>
            <Button style={armyInfoModalButtonStyles}
                type="button"
                colorScheme="yellow"
                data-bs-toggle="offcanvas"
                data-bs-target="#armyInfoModal"
                aria-controls="armyInfoModal">
                ⚔️
            </Button>

            <div style={armyInfoModalOffcanvasDivStyles} onMouseDown={dragMouseDown} className="offcanvas offcanvas-start" data-bs-keyboard="false" data-bs-backdrop="false" id="armyInfoModal" aria-labelledby="armyInfoModal">
                <div className="offcanvas-header" style={{ cursor: "move" }}>
                    <ArmyInfoModalHeader />
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
                                                    <ArmyInfoModalCard imageSource={swordsmanImg}
                                                        soldierName={"Swordsman"}
                                                        soliderCount={army.armyConfig.numSwordsman}
                                                        imageHeight={"75px"}
                                                        imageWidth={"65px"} />
                                                </div>
                                                <div className="col align-items-center">
                                                    <ArmyInfoModalCard imageSource={archerImg}
                                                        soldierName={"Archer"}
                                                        soliderCount={army.armyConfig.numArcher}
                                                        imageHeight={"75px"}
                                                        imageWidth={"65px"} />
                                                </div>
                                                <div className="col align-items-center">
                                                    <ArmyInfoModalCard imageSource={cavalryImg}
                                                        soldierName={"Cavalry"}
                                                        soliderCount={army.armyConfig.numCavalry}
                                                        imageHeight={"75px"}
                                                        imageWidth={"100px"} />
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

const ArmyInfoModalHeader = () => {
    return (
        <>
            <h5 className="offcanvas-title" id="staticBackdropLabel">My Army Details</h5>
            <button type="button" data-bs-dismiss="offcanvas" aria-label="Close">&#10008;</button>
        </>
    )
}

interface ArmyInfoModalCardPropTypes {
    imageSource: string,
    imageHeight: string,
    imageWidth: string,
    soldierName: string,
    soliderCount: number
}

const ArmyInfoModalCard = (props: ArmyInfoModalCardPropTypes) => {
    return (
        <>
            <div className="row justify-content-center">
                <img
                    src={props.imageSource}
                    style={{ height: props.imageHeight, width: props.imageWidth }}
                />
            </div>
            <div className="row justify-content-center text-center border-1 mt-2">
                <SoliderInfo soliderCount={props.soliderCount} soliderName={props.soldierName} />
            </div>
        </>
    )
}

interface SoliderInfoPropTypes {
    soliderName: string,
    soliderCount: number
}

const SoliderInfo = (props: SoliderInfoPropTypes) => {
    return <p style={{ fontSize: "12px" }}>{props.soliderName}: {props.soliderCount}</p>
}