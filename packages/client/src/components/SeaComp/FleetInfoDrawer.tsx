import smallShip from '../../images/shipAssets/small_ship.png'
import mediumShip from '../../images/shipAssets/medium_ship.png'
import largeShip from '../../images/shipAssets/large_ship.png'
import React, { useState, useEffect } from "react";
import { MdLocationPin } from 'react-icons/md'
import { Button, Tooltip } from "@chakra-ui/react";
import { usePlayer } from "../../context/PlayerContext";
import { useMyFleetPositions } from '../../hooks/SeaHooks/useMyFleetPositions';
import { useGame } from '../../context/GameContext';
import { GiShipBow } from 'react-icons/gi'

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

export const FleetInfoDrawer = ({ isInputFocused }: { isInputFocused: boolean }) => {
    const { userWallet } = usePlayer()
    const { gameID } = useGame();

    const [isOpen, setIsOpen] = useState(false);

    const myFleetPositions = useMyFleetPositions(userWallet, gameID);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'f' || event.key === 'F') {
            toggleDrawer();
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
            <Tooltip label='My Fleet Details' placement='top'>
                <button className="fleet-info-button" onClick={toggleDrawer}>
                    <GiShipBow />
                </button>
            </Tooltip>
            <div id="fleet-info-drawer" className={`fleet-info-drawer ${isOpen ? "open" : ""}`}>
                <div className="d-flex justify-between border-bottom mb-2 p-2">
                    <h5 className="font-extrabold">My Fleet Details</h5>
                    <button type="button" onClick={() => setIsOpen(false)}>&#10008;</button>
                </div>
                {(myFleetPositions && myFleetPositions.length > 0) ?
                    myFleetPositions.map((fleet: any, index: number) => {
                        return (
                            <React.Fragment key={index}>
                                <div className="row mt-1 p-2">
                                    <FleetInfoModalCard imageSource={smallShip}
                                        shipName={"Baron's Dagger"}
                                        shipCount={fleet.myFleetConfig.numSmall}
                                        imageHeight={"75px"}
                                        imageWidth={"75px"} />
                                    <FleetInfoModalCard imageSource={mediumShip}
                                        shipName={"Knight's Galley"}
                                        shipCount={fleet.myFleetConfig.numMedium}
                                        imageHeight={"75px"}
                                        imageWidth={"75px"} />
                                    <FleetInfoModalCard imageSource={largeShip}
                                        shipName={"King's Leviathan"}
                                        shipCount={fleet.myFleetConfig.numBig}
                                        imageHeight={"75px"}
                                        imageWidth={"75px"} />
                                </div>
                                <div className="row mt-1 mb-1 justify-content-center">
                                    <Button
                                        colorScheme="linkedin"
                                        className="w-50"
                                        onClick={() => {
                                            handleClick(`${fleet.myFleetPosition.y},${fleet.myFleetPosition.x}`);
                                            setIsOpen(false)
                                        }}
                                    >
                                        Find on Map<MdLocationPin className="ms-2 text-xl" />
                                    </Button>
                                </div>
                                <hr />
                            </React.Fragment>)
                    })
                    : <p className="text-center text-warning">You have no fleet!</p>
                }
            </div>
        </>
    )
}

const FleetInfoModalCard = ({ imageSource, imageHeight, imageWidth, shipName, shipCount }: {
    imageSource: string,
    imageHeight: string,
    imageWidth: string,
    shipName: string,
    shipCount: number
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
                <ShipInfo shipCount={shipCount} shipName={shipName} />
            </div>
        </div>
    )
}


const ShipInfo = ({ shipName, shipCount }: { shipName: string, shipCount: number }) => {
    return <p style={{ fontSize: "12px" }}>{shipName}: {shipCount}</p>
}