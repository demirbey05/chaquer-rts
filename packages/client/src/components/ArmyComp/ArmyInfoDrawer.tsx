import archerImg from "../../images/armyAssets/archer.png";
import cavalryImg from "../../images/armyAssets/cavalry.png";
import swordsmanImg from "../../images/armyAssets/swordsman.png";
import React, { useState, useEffect } from "react";
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
        }, 2000);
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
                                <div className="row mt-1 p-2">
                                    <ArmyInfoModalCard imageSource={swordsmanImg}
                                        soldierName={"Swordsman"}
                                        soldierCount={army.myArmyConfig.numSwordsman}
                                        imageHeight={"75px"}
                                        imageWidth={"65px"} />
                                    <ArmyInfoModalCard imageSource={archerImg}
                                        soldierName={"Archer"}
                                        soldierCount={army.myArmyConfig.numArcher}
                                        imageHeight={"75px"}
                                        imageWidth={"65px"} />
                                    <ArmyInfoModalCard imageSource={cavalryImg}
                                        soldierName={"Cavalry"}
                                        soldierCount={army.myArmyConfig.numCavalry}
                                        imageHeight={"75px"}
                                        imageWidth={"100px"} />
                                </div>
                                <div className="row mt-1 mb-1 justify-content-center">
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

const ArmyInfoModalCard = ({ imageSource, imageHeight, imageWidth, soldierName, soldierCount }: {
    imageSource: string,
    imageHeight: string,
    imageWidth: string,
    soldierName: string,
    soldierCount: number
}) => {
    return (
        <div className="col align-items-center">
            <div className="row justify-content-center">
                <img
                    src={imageSource}
                    style={{ height: imageHeight, width: imageWidth }}
                />
            </div>
            <div className="row justify-content-center text-center border-1 mt-2 p-1">
                <SoldierInfo soldierCount={soldierCount} soldierName={soldierName} />
            </div>
        </div>
    )
}


const SoldierInfo = ({ soldierName, soldierCount }: { soldierName: string, soldierCount: number }) => {
    return <p style={{ fontSize: "12px" }}>{soldierName}: {soldierCount}</p>
}