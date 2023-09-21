import archerImg from "../../images/armyAssets/archer.png"
import cavalryImg from "../../images/armyAssets/cavalry.png";
import swordsmanImg from "../../images/armyAssets/swordsman.png";
import { useState, useEffect } from "react";
import { Button, Alert, AlertIcon, AlertTitle } from "@chakra-ui/react";
import { EventProgressBar } from "../ProgressComp/EventProgressBar";
import { useArmy } from "../../context/ArmyContext";
import { useError } from "../../context/ErrorContext";
import { usePlayer } from "../../context/PlayerContext";
import { useMUD } from "../../context/MUDContext";
import { useCastle } from "../../context/CastleContext";
import { useArmyPrices } from '../../hooks/EconomyHooks/useArmyPrices';
import { useCredit } from "../../hooks/EconomyHooks/useCredit";
import { useMyArmy } from "../../hooks/ArmyHooks/useMyArmy";
import { getNumberFromBigInt } from "../../utils/helperFunctions/CustomFunctions/getNumberFromBigInt";
import { findIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/findIDFromPosition";
import { getMyArmyConfigByPosition } from "../../utils/helperFunctions/ArmyFunctions/getArmyConfigByPosition";

export const ArmyUpdateModal = () => {
    const { systemCalls, components } = useMUD();
    const { userWallet } = usePlayer();
    const { setIsArmyUpdateStage, armyPositionUpdate, setIsArmySettleStage, setArmyPositionUpdate } = useArmy();
    const { setErrorMessage, setErrorTitle, setShowError } = useError();
    const { castlePosition, setCastlePosition } = useCastle();

    const [swordsmanCount, setSwordsmanCount] = useState<string>("");
    const [archerCount, setArcherCount] = useState<string>("");
    const [cavalryCount, setCavalryCount] = useState<string>("");

    const [isDisabled, setIsDisabled] = useState(true);
    const [enoughCredit, setEnoughCredit] = useState(true);
    const [lessThanPrevArmySize, setLessThenPrevArmySize] = useState<boolean>(true)
    const [totalCharge, setTotalCharge] = useState<number>(0);

    const [armyConfig, setArmyConfig] = useState<any>({ numSwordsman: 0, numArcher: 0, numCavalry: 0 });

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const armyPrices = useArmyPrices(1);
    const myCredit = useCredit(1, userWallet);
    const myArmyPositions = useMyArmy(userWallet);

    useEffect(() => {
        if (armyPositionUpdate && myArmyPositions) {
            setArmyConfig(getMyArmyConfigByPosition({ x: armyPositionUpdate.x, y: armyPositionUpdate.y }, myArmyPositions).myArmyConfig)
        }
    }, [armyPositionUpdate, myArmyPositions])

    useEffect(() => {
        if (armyConfig) {
            setSwordsmanCount(`${armyConfig.numSwordsman}`);
            setArcherCount(`${armyConfig.numArcher}`);
            setCavalryCount(`${armyConfig.numCavalry}`);
            (document.getElementById('SwordsmanUpdate') as HTMLInputElement).value = `${armyConfig.numSwordsman}`;
            (document.getElementById('CavalryUpdate') as HTMLInputElement).value = `${armyConfig.numCavalry}`;
            (document.getElementById('ArcherUpdate') as HTMLInputElement).value = `${armyConfig.numArcher}`;
        }
    }, [armyConfig])

    useEffect(() => {
        if (Number.isNaN(parseInt(swordsmanCount))) {
            setSwordsmanCount("0")
        }

        if (Number.isNaN(parseInt(archerCount))) {
            setArcherCount("0")
        }

        if (Number.isNaN(parseInt(cavalryCount))) {
            setCavalryCount("0")
        }

        if (armyConfig) {
            if (Number(swordsmanCount) + Number(archerCount) + Number(cavalryCount) < armyConfig.numSwordsman + armyConfig.numCavalry + armyConfig.numArcher) {
                setIsDisabled(true);
                setLessThenPrevArmySize(false)
                return;
            } else {
                setIsDisabled(false);
                setLessThenPrevArmySize(true)
            }
        }

        if (swordsmanCount.length === 0 && archerCount.length === 0 && cavalryCount.length === 0) {
            setIsDisabled(true);
            return;
        }

        const parsedSwordsmanCount = parseInt(swordsmanCount);
        const parsedArcherCount = parseInt(archerCount);
        const parsedCavalryCount = parseInt(cavalryCount);

        const totalTroops = parsedSwordsmanCount + parsedArcherCount + parsedCavalryCount;

        if (armyPrices) {
            const totalCharge =
                (parsedSwordsmanCount - armyConfig.numSwordsman) * Number(getNumberFromBigInt(armyPrices.priceSwordsman)) +
                (parsedArcherCount - armyConfig.numArcher) * Number(getNumberFromBigInt(armyPrices.priceArcher)) +
                (parsedCavalryCount - armyConfig.numCavalry) * Number(getNumberFromBigInt(armyPrices.priceCavalry));

            if (totalTroops <= 0 || totalTroops > 500) {
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
        }
    }, [swordsmanCount, archerCount, cavalryCount, armyPrices, myCredit, armyConfig]);

    const handleBackMap = () => {
        setArmyConfig({ numSwordsman: 0, numArcher: 0, numCavalry: 0 })
    }

    const handleClick = async () => {
        setIsArmyUpdateStage(false);
        setIsArmySettleStage(false)
        setIsLoading(true);

        var targetDiv = document.getElementById(`${armyPositionUpdate.y},${armyPositionUpdate.x}`);
        targetDiv?.classList.add("animate-border-settle");

        const castleID = [...findIDFromPosition(
            castlePosition,
            components.Position,
        )];

        const armyID = [...findIDFromPosition(
            armyPositionUpdate,
            components.Position,
        )];

        if (castleID.length != 1 || armyID.length != 1) {
            setErrorMessage("An error occurred while trying to update an army.")
            setErrorTitle("Army Update Error")
            setShowError(true)
            setIsLoading(false)
        }

        if ((document.getElementById('SwordsmanUpdate') as HTMLInputElement).value === "") {
            setSwordsmanCount("0");
        }

        if ((document.getElementById('CavalryUpdate') as HTMLInputElement).value === "") {
            setCavalryCount("0");
        }

        if ((document.getElementById('ArcherUpdate') as HTMLInputElement).value === "") {
            setArcherCount("0");
        }

        try {
            const tx = await systemCalls.updateArmy(
                armyID.toString(),
                Number(swordsmanCount),
                Number(archerCount),
                Number(cavalryCount),
                castleID.toString(),
                1
            );

            if (tx) {
                setArmyPositionUpdate(undefined)
                setCastlePosition(undefined)
            }
        } catch (error) {
            setErrorMessage("An error occurred during army update.");
            setErrorTitle("Army Update Error");
            setShowError(true);
        } finally {
            setIsLoading(false);
            targetDiv?.classList.remove("animate-border-settle");
        }
    };

    return (
        <>
            {isLoading && <EventProgressBar text="New soldiers are joining to the army..." />}
            <div
                className="modal fade"
                id="armyUpdateModal"
                data-bs-backdrop="static"
                aria-labelledby="armyUpdateModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content bg-dark text-white">
                        <div className="modal-header justify-center">
                            <h1 className="modal-title text-2xl" id="armyUpdateModalLabel">
                                Army Update
                            </h1>
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
                                {
                                    !lessThanPrevArmySize &&
                                    <Alert status='warning' color={"black"}>
                                        <AlertIcon />
                                        <AlertTitle>Soldier number in the army must be bigger or equal to previous soldier number.</AlertTitle>
                                    </Alert>
                                }
                                <div className="row mt-2">
                                    <ArmySettleInputBody imageSource={swordsmanImg}
                                        soldierName={"Swordsman"}
                                        setSoliderCount={setSwordsmanCount}
                                        imageHeight={"100px"}
                                        imageWidth={"75px"} />
                                    <ArmySettleInputBody imageSource={archerImg}
                                        soldierName={"Archer"}
                                        setSoliderCount={setArcherCount}
                                        imageHeight={"100px"}
                                        imageWidth={"85px"} />
                                    <ArmySettleInputBody imageSource={cavalryImg}
                                        soldierName={"Cavalry"}
                                        setSoliderCount={setCavalryCount}
                                        imageHeight={"100px"}
                                        imageWidth={"125px"} />
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
                                Update Army
                            </Button>
                            <Button
                                colorScheme="red"
                                border="solid"
                                textColor="dark"
                                data-bs-dismiss="modal"
                                onClick={() => handleBackMap()}
                            >
                                Back to Map
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

interface ArmySettleInputBody {
    imageSource: string,
    imageHeight: string,
    imageWidth: string,
    soldierName: string,
    setSoliderCount: React.Dispatch<React.SetStateAction<string>>
}

const ArmySettleInputBody = (props: ArmySettleInputBody) => {
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
                    id={props.soldierName + `Update`}
                    onChange={(e: any) => props.setSoliderCount(e.target.value)}
                    onClick={(e: any) => e.target.select()} />
            </div>
        </div>
    )
}