import smallShipImg from "../../images/small_ship.png";
import mediumShipImg from "../../images/medium_ship.png";
import largeShipImg from "../../images/large_ship.png";
import { Button, Tooltip, Alert, AlertIcon, AlertTitle } from "@chakra-ui/react";
import { useMUD } from "../../MUDContext";
import { usePlayer } from "../../context/PlayerContext";
import { useError } from "../../context/ErrorContext";
import { useFleet } from "../../context/FleetContext";
import { useState, useEffect, useRef } from "react";
import { useArmyPrices } from '../../hooks/useArmyPrices';
import { useCredit } from "../../hooks/useCredit";
import { getNumberFromBigInt } from "../../utils/helperFunctions/CustomFunctions/getNumberFromBigInt";
import { findIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/findIDFromPosition";

export const FleetSettleModal = () => {
    const { userWallet } = usePlayer();
    const { fleetPosition, setFleetSettleStage, dockPositionForFleetSettlement, setDockPositionForFleetSettlement } = useFleet();
    const { setErrorMessage, setErrorTitle, setShowError } = useError();
    const { systemCalls, components } = useMUD();

    const [smallShipCount, setSmallShipCount] = useState<string>("");
    const [mediumShipCount, setMediumShipCount] = useState<string>("");
    const [largeShipCount, setLargeShipCount] = useState<string>("");

    const [isDisabled, setIsDisabled] = useState(true);
    const [enoughCredit, setEnoughCredit] = useState(true);
    const [totalCharge, setTotalCharge] = useState<number>(0);
    const dockID = useRef<string>("0");

    const armyPrices = useArmyPrices(1);
    const myCredit = useCredit(1, userWallet);

    useEffect(() => {
        if (!smallShipCount || !mediumShipCount || !largeShipCount) {
            setIsDisabled(true);
            return;
        }

        const parsedSmallShipCount = parseInt(smallShipCount);
        const parsedMediumShipCount = parseInt(mediumShipCount);
        const parsedLargeShipCount = parseInt(largeShipCount);

        const totalTroops = parsedSmallShipCount + parsedMediumShipCount + parsedLargeShipCount;

        const totalCharge =
            parsedSmallShipCount * Number(getNumberFromBigInt(armyPrices.priceSwordsman)) +
            parsedMediumShipCount * Number(getNumberFromBigInt(armyPrices.priceArcher)) +
            parsedLargeShipCount * Number(getNumberFromBigInt(armyPrices.priceCavalry));

        if (totalTroops <= 0 || totalTroops > 300) {
            setIsDisabled(true);
            setTotalCharge(totalCharge);
        } else if (!armyPrices || !myCredit) {
            setIsDisabled(true);
            setEnoughCredit(false);
            setTotalCharge(totalCharge);
        } else {
            if (totalCharge > parseInt(getNumberFromBigInt(myCredit))) {
                setIsDisabled(true);
                setEnoughCredit(false);
                setTotalCharge(totalCharge);
            } else {
                setIsDisabled(false);
                setEnoughCredit(true);
            }
        }
    }, [smallShipCount, mediumShipCount, largeShipCount, armyPrices, myCredit]);


    const handleClick = async () => {
        const _dockID = [...findIDFromPosition(
            dockPositionForFleetSettlement,
            components.Position,
        )];

        if (_dockID !== null) {
            dockID.current = [..._dockID][0];
        }

        setFleetSettleStage(false);

        const tx = await systemCalls.settleFleet(
            fleetPosition.x,
            fleetPosition.y,
            dockID.current,
            parseInt(smallShipCount),
            parseInt(mediumShipCount),
            parseInt(largeShipCount),
            1
        );
        if (tx) {
            setSmallShipCount('');
            setMediumShipCount('');
            setLargeShipCount('');

            (document.getElementById("Baron's Dagger") as HTMLInputElement).value = '';
            (document.getElementById("Knight's Galley") as HTMLInputElement).value = '';
            (document.getElementById("King's Leviathan") as HTMLInputElement).value = '';
        }
        else {
            setErrorMessage("You have no enough credit!")
            setErrorTitle("Fleet Settlement Error")
            setShowError(true)
        }
    };

    return (
        <div
            className="modal fade"
            id="fleetSettleModal"
            data-bs-backdrop="static"
            aria-labelledby="fleetSettleModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-dark text-white">
                    <div className="modal-header justify-center">
                        <Tooltip label="Please determine the number of war ships that will hold in
                  the fleet. You can deploy maximum 300 ships in a fleet." placement="top-start" bg="blue.400" fontSize="md">
                            <h1 className="modal-title text-2xl" id="fleetSettleModalLabel">
                                Fleet Settlement
                            </h1>
                        </Tooltip>
                    </div>
                    <div className="modal-body">
                        <div className="container-fluid">
                            {
                                !enoughCredit &&
                                <Alert status='warning' color={"black"}>
                                    <AlertIcon />
                                    <AlertTitle>You have no enough credit, sell some resources! Total Charge: {totalCharge} 💰</AlertTitle>
                                </Alert>
                            }
                            <div className="row mt-2">
                                <FleetSettleInputBody imageSource={smallShipImg}
                                    soldierName={"Baron's Dagger"}
                                    setSoliderCount={setSmallShipCount}
                                    imageHeight={"100px"}
                                    imageWidth={"100px"} />
                                <FleetSettleInputBody imageSource={mediumShipImg}
                                    soldierName={"Knight's Galley"}
                                    setSoliderCount={setMediumShipCount}
                                    imageHeight={"100px"}
                                    imageWidth={"100px"} />
                                <FleetSettleInputBody imageSource={largeShipImg}
                                    soldierName={"King's Leviathan"}
                                    setSoliderCount={setLargeShipCount}
                                    imageHeight={"100px"}
                                    imageWidth={"100px"} />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <Button
                            colorScheme="whatsapp"
                            border="solid"
                            textColor="dark"
                            data-bs-dismiss="modal"
                            isDisabled={isDisabled}
                            onClick={() => handleClick()}
                        >
                            Settle Fleet
                        </Button>
                        <Button
                            colorScheme="red"
                            border="solid"
                            textColor="dark"
                            data-bs-dismiss="modal"
                        >
                            Back to Map
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface FleetSettleInputBodyPropTypes {
    imageSource: string,
    imageHeight: string,
    imageWidth: string,
    soldierName: string,
    setSoliderCount: React.Dispatch<React.SetStateAction<string>>
}

const FleetSettleInputBody = (props: FleetSettleInputBodyPropTypes) => {
    return (
        <div className="col align-items-center">
            <div className="row justify-content-center">
                <img
                    src={props.imageSource}
                    style={{ height: props.imageHeight, width: props.imageWidth }}
                />
            </div>
            <div className="row justify-content-center text-center mt-2">
                <p>{props.soldierName}</p>
            </div>
            <div className="row justify-content-center mt-2">
                <input
                    className="form-control w-75"
                    type="number"
                    id={props.soldierName}
                    onChange={(e: any) => props.setSoliderCount(e.target.value)}
                    onClick={(e: any) => e.target.select()} />
            </div>
        </div>
    )
}