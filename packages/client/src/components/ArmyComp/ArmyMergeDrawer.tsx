import { useEffect, useState } from "react";
import { Button, Alert, AlertIcon } from "@chakra-ui/react";
import { EventProgressBar } from "../ProgressComp/EventProgressBar";
import { useMUD } from "../../context/MUDContext";
import { useError } from "../../context/ErrorContext";
import { findIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/findIDFromPosition";
import { useArmy } from "../../context/ArmyContext";
import { getMyArmyConfigByPosition } from "../../utils/helperFunctions/ArmyFunctions/getArmyConfigByPosition";
import { useMyArmy } from "../../hooks/ArmyHooks/useMyArmy";
import { usePlayer } from "../../context/PlayerContext";

export const ArmyMergeDrawer = () => {
    const { components, systemCalls } = useMUD();
    const { userWallet } = usePlayer();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();
    const { setIsArmyMergeStage,
        mergeTargetArmyPosition,
        setMergeTargetArmyPosition,
        mergeFromArmyPosition,
        setMergeFromArmyPosition } = useArmy();

    const [armyOneConfig, setArmyOneConfig] = useState<any>({ numSwordsman: 0, numArcher: 0, numCavalry: 0 });
    const [armyTwoConfig, setArmyTwoConfig] = useState<any>({ numSwordsman: 0, numArcher: 0, numCavalry: 0 });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalArmy, setTotalArmy] = useState<number>(0);

    const myArmyPositions = useMyArmy(userWallet);

    useEffect(() => {
        if (armyOneConfig && armyTwoConfig) {
            const armyOneNumber = armyOneConfig.numSwordsman + armyOneConfig.numArcher + armyOneConfig.numCavalry;
            const armyTwoNumber = armyTwoConfig.numSwordsman + armyTwoConfig.numArcher + armyTwoConfig.numCavalry;
            setTotalArmy(armyOneNumber + armyTwoNumber)
        }
    }, [armyOneConfig, armyTwoConfig])

    useEffect(() => {
        if (mergeTargetArmyPosition && myArmyPositions) {
            if (getMyArmyConfigByPosition({ x: mergeTargetArmyPosition.x, y: mergeTargetArmyPosition.y }, myArmyPositions)) {
                setArmyTwoConfig(getMyArmyConfigByPosition({ x: mergeTargetArmyPosition.x, y: mergeTargetArmyPosition.y }, myArmyPositions).myArmyConfig)
            }
        } else {
            setArmyTwoConfig({ numSwordsman: 0, numArcher: 0, numCavalry: 0 })
        }

        if (mergeFromArmyPosition && myArmyPositions) {
            if (getMyArmyConfigByPosition({ x: mergeFromArmyPosition.x, y: mergeFromArmyPosition.y }, myArmyPositions)) {
                setArmyOneConfig(getMyArmyConfigByPosition({ x: mergeFromArmyPosition.x, y: mergeFromArmyPosition.y }, myArmyPositions).myArmyConfig)
            }
        }
        else {
            setArmyOneConfig({ numSwordsman: 0, numArcher: 0, numCavalry: 0 })
        }
    }, [mergeTargetArmyPosition, mergeFromArmyPosition])

    const handleMergeLater = () => {
        setIsArmyMergeStage(false);
        setArmyOneConfig({ numSwordsman: 0, numArcher: 0, numCavalry: 0 });
        setArmyTwoConfig({ numSwordsman: 0, numArcher: 0, numCavalry: 0 });
    };

    const handleMerge = async () => {
        const armyOneID = [...findIDFromPosition(
            mergeFromArmyPosition,
            components.Position,
        )];

        const armyTwoID = [...findIDFromPosition(
            mergeTargetArmyPosition,
            components.Position,
        )];

        if (armyOneID.length != 1 || armyTwoID.length != 1) {
            setErrorMessage("An error occurred while trying to merge the armies.")
            setErrorTitle("Army Merge Error")
            setShowError(true)
            return
        }

        try {
            setIsArmyMergeStage(false);
            setIsLoading(true);
            await systemCalls.mergeArmy(armyOneID[0] as string, armyTwoID[0] as string, 1);
        } catch (error) {
            setErrorMessage("An error occurred while trying to merge the armies.");
            setErrorTitle("Army Merge Error");
            setShowError(true);
        } finally {
            setMergeTargetArmyPosition(undefined)
            setMergeFromArmyPosition(undefined);
            setArmyOneConfig({ numSwordsman: 0, numArcher: 0, numCavalry: 0 });
            setArmyTwoConfig({ numSwordsman: 0, numArcher: 0, numCavalry: 0 });
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <EventProgressBar text={"Armies are coming together..."} />
    }

    return (
        <div
            className="offcanvas offcanvas-bottom attack-drawer"
            data-bs-keyboard="false"
            data-bs-backdrop="false"
            id="armyMergeDrawer"
            aria-labelledby="armyMergeDrawerLabel"
        >
            <ArmyMergeDrawerHeader headerText={"Army Merge Information"} />
            <div className="offcanvas-body small">

                <div className="row">
                    <ArmyMergeDrawerCard
                        numSwordsman={armyOneConfig.numSwordsman}
                        numArcher={armyOneConfig.numArcher}
                        numCavalry={armyOneConfig.numCavalry}
                        title={"Army I"}
                        titleBg={"success"} />
                    < ArmyMergeDrawerCard
                        numSwordsman={armyTwoConfig.numSwordsman}
                        numArcher={armyTwoConfig.numArcher}
                        numCavalry={armyTwoConfig.numCavalry}
                        title={"Army II"}
                        titleBg={"success"} />
                    {
                        totalArmy > 500 &&
                        <Alert status='warning' p={1} mt={2}>
                            <AlertIcon />
                            Total soldier number is bigger than 500. You cannot merge!
                        </Alert>
                    }
                </div>
            </div>
            <div className="d-flex justify-content-evenly">
                <Button
                    colorScheme="whatsapp"
                    border="solid"
                    textColor="dark"
                    data-bs-dismiss="offcanvas"
                    isDisabled={totalArmy > 500}
                    onClick={handleMerge}>
                    Merge the Armies
                </Button>
                <Button
                    colorScheme="red"
                    border="solid"
                    textColor="dark"
                    data-bs-dismiss="offcanvas"
                    onClick={handleMergeLater}>
                    Wait and Merge Later
                </Button>
            </div>
        </div>
    );
}

const ArmyMergeDrawerHeader = ({ headerText }: { headerText: string }) => {
    return (
        <h5 className="offcanvas-title text-center" id="armyMergeDrawerLabel">
            {headerText}
        </h5>
    )
}

const ArmyMergeDrawerCard = ({ title, titleBg, numSwordsman, numArcher, numCavalry }: {
    title: string,
    titleBg: string,
    numSwordsman: number,
    numArcher: number,
    numCavalry: number
}) => {
    return (
        <div className="col">
            <h1 className={`text-center bg-${titleBg} p-2`}>
                {title}
            </h1>
            <ArmyMergeDrawerCardRow numSoldier={numSwordsman} soliderName={"Swordsman"} />
            <ArmyMergeDrawerCardRow numSoldier={numArcher} soliderName={"Archer"} />
            <ArmyMergeDrawerCardRow numSoldier={numCavalry} soliderName={"Cavalry"} />
        </div>
    )
}

const ArmyMergeDrawerCardRow = ({ numSoldier, soliderName }: { numSoldier: number, soliderName: string }) => {
    return (
        <div className="row text-center mt-2">
            <p>
                {soliderName && soliderName}: {numSoldier && numSoldier}
            </p>
        </div>
    )
}