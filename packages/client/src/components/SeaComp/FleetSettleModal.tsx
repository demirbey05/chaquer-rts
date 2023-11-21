import smallShipImg from "../../images/shipAssets/small_ship.png";
import mediumShipImg from "../../images/shipAssets/medium_ship.png";
import largeShipImg from "../../images/shipAssets/large_ship.png";
import { useState, useEffect, useRef } from "react";
import { Button, Alert, AlertIcon, AlertTitle } from "@chakra-ui/react";
import { EventProgressBar } from "../ProgressComp/EventProgressBar";
import { useMUD } from "../../context/MUDContext";
import { usePlayer } from "../../context/PlayerContext";
import { useError } from "../../context/ErrorContext";
import { useFleet } from "../../context/FleetContext";
import { useGame } from "../../context/GameContext";
import { useCredit } from "../../hooks/EconomyHooks/useCredit";
import { getNumberFromBigInt } from "../../utils/helperFunctions/CustomFunctions/getNumberFromBigInt";
import { getIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/getIDFromPosition";
import { useNumberOfWood } from "../../hooks/ResourceHooks/useNumberOfResource";
import fleetSettleSoundEffect from '../../sounds/soundEffects/fleet-settle-effect.mp3'

export const FleetSettleModal = () => {
    const { systemCalls, components } = useMUD();
    const { userWallet } = usePlayer();
    const { fleetPosition, setFleetSettleStage, dockPositionForFleetSettlement } = useFleet();
    const { setErrorMessage, setErrorTitle, setShowError } = useError();
    const { gameID } = useGame();

    const [smallShipCount, setSmallShipCount] = useState<string>("");
    const [mediumShipCount, setMediumShipCount] = useState<string>("");
    const [largeShipCount, setLargeShipCount] = useState<string>("");

    const [isDisabled, setIsDisabled] = useState(true);
    const [enoughCredit, setEnoughCredit] = useState(true);
    const [enoughWood, setEnoughWood] = useState(true);
    const [totalCreditCharge, setTotalCreditCharge] = useState<number>(0);
    const [totalWoodCharge, setTotalWoodCharge] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const dockID = useRef<string>("0");

    const fleetPrices = {
        smallShipCredit: 10,
        smallShipWood: 100,
        mediumShipCredit: 20,
        mediumShipWood: 200,
        bigShipCredit: 30,
        bigShipWood: 300
    }

    const myCredit = useCredit(gameID, userWallet);
    const numberOfWood = useNumberOfWood()

    useEffect(() => {
        if (Number.isNaN(parseInt(smallShipCount))) {
            setSmallShipCount("0")
        }

        if (Number.isNaN(parseInt(mediumShipCount))) {
            setMediumShipCount("0")
        }

        if (Number.isNaN(parseInt(largeShipCount))) {
            setLargeShipCount("0")
        }

        if (smallShipCount.length === 0 && mediumShipCount.length === 0 && largeShipCount.length === 0 || Number(smallShipCount) + Number(mediumShipCount) + Number(largeShipCount) === 0) {
            setIsDisabled(true);
            setEnoughCredit(true);
            setEnoughWood(true);
            return;
        }

        const parsedSmallShipCount = Number(smallShipCount);
        const parsedMediumShipCount = Number(mediumShipCount);
        const parsedLargeShipCount = Number(largeShipCount);

        const totalTroops = parsedSmallShipCount + parsedMediumShipCount + parsedLargeShipCount;

        const totalCharge =
            parsedSmallShipCount * fleetPrices.smallShipCredit +
            parsedMediumShipCount * fleetPrices.mediumShipCredit +
            parsedLargeShipCount * fleetPrices.bigShipCredit;

        const totalWoodCharge = parsedSmallShipCount * fleetPrices.smallShipWood +
            parsedMediumShipCount * fleetPrices.mediumShipWood +
            parsedLargeShipCount * fleetPrices.bigShipWood;

        if (totalTroops <= 0 || totalTroops > 300) {
            setIsDisabled(true);
            setTotalCreditCharge(totalCharge);
            setTotalWoodCharge(totalWoodCharge)
        } else if (!myCredit) {
            setIsDisabled(true);
        } else {
            if (totalWoodCharge >= numberOfWood && totalCharge >= Number(getNumberFromBigInt(myCredit))) {
                setIsDisabled(true);
                setEnoughWood(false);
                setEnoughCredit(false)
                setTotalWoodCharge(totalWoodCharge)
                setTotalCreditCharge(totalCreditCharge)
            }
            else if (totalCharge >= Number(getNumberFromBigInt(myCredit))) {
                setIsDisabled(true);
                setEnoughCredit(false);
                setEnoughWood(true)
                setTotalCreditCharge(totalCharge);
            }
            else if (totalWoodCharge >= numberOfWood) {
                setIsDisabled(true);
                setEnoughWood(false);
                setEnoughCredit(true)
                setTotalWoodCharge(totalWoodCharge)
            }
            else {
                setIsDisabled(false);
                setEnoughCredit(true);
                setEnoughWood(true);
            }
        }
    }, [smallShipCount, mediumShipCount, largeShipCount, myCredit, numberOfWood]);


    const handleClick = async () => {
        const _dockID = [...getIDFromPosition(
            dockPositionForFleetSettlement,
            components.Position,
            gameID
        )];

        if (_dockID !== null) {
            dockID.current = [..._dockID][0];
        }

        setFleetSettleStage(false);
        var targetDiv = document.getElementById(`${fleetPosition.y},${fleetPosition.x}`);
        targetDiv?.classList.add("animate-border-settle");

        setIsLoading(true)

        const audio = new Audio(fleetSettleSoundEffect);
        audio.volume = 0.4;
        audio.play();

        const tx = await systemCalls.settleFleet(
            fleetPosition.x,
            fleetPosition.y,
            dockID.current,
            parseInt(smallShipCount),
            parseInt(mediumShipCount),
            parseInt(largeShipCount),
            gameID
        );
        if (tx) {
            setSmallShipCount('');
            setMediumShipCount('');
            setLargeShipCount('');

            const isTask = localStorage.getItem("fleetSettlementTask")
            !isTask && localStorage.setItem("fleetSettlementTask", "true")
            window.dispatchEvent(new Event('localDataStorage'));
        } else {
            setErrorMessage("You have no enough credit!")
            setErrorTitle("Fleet Settlement Error")
            setShowError(true)
        }

        setIsLoading(false)
        targetDiv?.classList.remove("animate-border-settle");
    };

    if (isLoading) {
        return <EventProgressBar text={"Fleet is moving towards water..."} />
    }

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
                        <h1 className="modal-title text-2xl" id="fleetSettleModalLabel">
                            Fleet Settlement
                        </h1>
                    </div>
                    <div className="modal-body">
                        <div className="container-fluid">
                            {
                                !enoughCredit &&
                                <Alert status='warning' color={"black"}>
                                    <AlertIcon />
                                    <AlertTitle>You have no enough credit, sell some resources! Total Credit Charge: {totalCreditCharge} 💰</AlertTitle>
                                </Alert>
                            }
                            {
                                !enoughWood &&
                                <Alert status='warning' color={"black"}>
                                    <AlertIcon />
                                    <AlertTitle>You have no enough wood, capture some wood resource! Total Wood Charge: {totalWoodCharge} 🪵</AlertTitle>
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