import '../../styles/globals.css'
import React, { useState, useEffect } from "react";
import archerImg from "../../images/archer.png";
import cavalryImg from "../../images/cavalry.png";
import swordsmanImg from "../../images/swordsman.png";
import { MdLocationPin } from 'react-icons/md'
import { Button } from "@chakra-ui/react";
import { useMyArmy } from "../../hooks/ArmyHooks/useMyArmy";
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

export const ArmyInfoDrawer = () => {
    const { userWallet } = usePlayer()
    const [isOpen, setIsOpen] = useState(false);

    const myArmyPosition = useMyArmy(userWallet);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'a' || event.key === 'A') {
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

    // Find the army on the map
    const handleClick = (targetId: any) => {
        scrollToDiv(targetId);

        var myDiv = document.getElementById(targetId);
        myDiv?.classList.add("animate-border");

        setTimeout(function () {
            myDiv?.classList.remove("animate-border");
        }, 1500);
    };

    return (
        <>
            <button className="army-info-button" onClick={toggleDrawer}>
                ⚔️
            </button>
            <div id="army-info-drawer" className={`army-info-drawer ${isOpen ? "open" : ""}`}>
                <div className="d-flex justify-between border-bottom mb-2 p-2">
                    <h5 className="font-extrabold">My Army Details</h5>
                    <button type="button" onClick={() => setIsOpen(false)}>&#10008;</button>
                </div>
                {myArmyPosition.length !== 0 ?
                    myArmyPosition.map((army: any, index: number) => {
                        return (
                            <React.Fragment key={index}>
                                <div className="row mt-2">
                                    <ArmyInfoModalCard imageSource={swordsmanImg}
                                        soldierName={"Swordsman"}
                                        soliderCount={army.myArmyConfig.numSwordsman}
                                        imageHeight={"75px"}
                                        imageWidth={"65px"} />
                                    <ArmyInfoModalCard imageSource={archerImg}
                                        soldierName={"Archer"}
                                        soliderCount={army.myArmyConfig.numArcher}
                                        imageHeight={"75px"}
                                        imageWidth={"65px"} />
                                    <ArmyInfoModalCard imageSource={cavalryImg}
                                        soldierName={"Cavalry"}
                                        soliderCount={army.myArmyConfig.numCavalry}
                                        imageHeight={"75px"}
                                        imageWidth={"100px"} />
                                </div>
                                <div className="row mt-2 mb-2 align-items-center justify-content-center">
                                    <Button
                                        colorScheme="linkedin"
                                        className="w-50"
                                        onClick={() => {
                                            handleClick(`${army.myArmyPosition.y},${army.myArmyPosition.x}`);
                                            setIsOpen(false)
                                        }}
                                    >
                                        Find on Map<MdLocationPin className="ms-2 text-xl" />
                                    </Button>
                                </div>
                                <hr />
                            </React.Fragment>)
                    })
                    : <p className="text-center text-warning">You have no army!</p>
                }
            </div>
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
        <div className="col align-items-center">
            <div className="row justify-content-center">
                <img
                    src={props.imageSource}
                    style={{ height: props.imageHeight, width: props.imageWidth }}
                />
            </div>
            <div className="row justify-content-center text-center border-1 mt-2">
                <SoliderInfo soliderCount={props.soliderCount} soliderName={props.soldierName} />
            </div>
        </div>
    )
}

interface SoliderInfoPropTypes {
    soliderName: string,
    soliderCount: number
}

const SoliderInfo = (props: SoliderInfoPropTypes) => {
    return <p style={{ fontSize: "12px" }}>{props.soliderName}: {props.soliderCount}</p>
}