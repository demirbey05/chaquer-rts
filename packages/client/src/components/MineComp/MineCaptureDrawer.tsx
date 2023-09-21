import { useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";
import { EventProgressBar } from "../ProgressComp/EventProgressBar";
import { useMUD } from "../../context/MUDContext";
import { useMine } from "../../context/MineContext";
import { useAttack } from "../../context/AttackContext";
import { useError } from "../../context/ErrorContext";
import { useResources } from "../../hooks/ResourceHooks/useResources";
import { findCastleCloseArmies } from "../../utils/helperFunctions/CastleFunctions/findCastleCloseArmies";
import { getResourceTypeByPosition } from "../../utils/helperFunctions/ResourceFuntions/getResourceTypeByPosition";
import { findIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/findIDFromPosition";

export const MineCaptureDrawer = () => {
    const { components, systemCalls } = useMUD();
    const { targetMinePosition, setIsMineStage, attackerArmyPosition } = useMine();
    const { setMyArmyConfig, setEnemyArmyConfig, myArmyConfig } = useAttack();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();

    const [mineArmy, setMineArmy] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const resources = useResources();

    const handleCaptureLater = () => {
        setIsMineStage(false);
        setMyArmyConfig(undefined);
        setEnemyArmyConfig(undefined);
    };

    useEffect(() => {
        if (targetMinePosition) {
            const mineId = [...findIDFromPosition(
                targetMinePosition,
                components.Position,
            )];

            setMineArmy(findCastleCloseArmies(mineId[0], components.Position, components.ResourceOwnable, components.ArmyOwnable, components.ArmyConfig))
        }
    }, [targetMinePosition])

    const handleCapture = async () => {
        const attackFromArmyId = [...findIDFromPosition(
            attackerArmyPosition,
            components.Position,
        )];

        const attackToMineId = [...findIDFromPosition(
            targetMinePosition,
            components.Position,
        )];

        findCastleCloseArmies(attackToMineId[0], components.Position, components.ResourceOwnable, components.ArmyOwnable, components.ArmyConfig)

        if (attackFromArmyId.length != 1 || attackToMineId.length != 1) {
            setErrorMessage("An error occurred while trying to capture a mine.")
            setErrorTitle("Mine Capture Error")
            return
        }

        try {
            setIsLoading(true)
            await systemCalls.captureMine(attackFromArmyId[0], attackToMineId[0], 0)
        } catch (error) {
            setErrorMessage("An error occurred while trying to capture a mine.")
            setErrorTitle("Mine Capture Error")
            setShowError(true)
        } finally {
            setIsMineStage(false);
            setMyArmyConfig(undefined);
            setEnemyArmyConfig(undefined);
            setIsLoading(false)
        }
    };

    return (
        <>
            {isLoading && <EventProgressBar text="Armies are capturing the resources..." />}
            <div
                className="offcanvas offcanvas-bottom attack-drawer"
                data-bs-keyboard="false"
                data-bs-backdrop="false"
                id="mineCaptureDrawer"
                aria-labelledby="mineCaptureDrawerLabel"
            >
                <MineCaptureModalHeader resourceType={getResourceTypeByPosition(resources, targetMinePosition)} />
                <div className="offcanvas-body small">
                    <div className="row">
                        <MineCaptureDrawerArmyCard title={"My Army"} titleBg={"success"}
                            numSwordsman={myArmyConfig && myArmyConfig.myArmyConfig.numSwordsman}
                            numArcher={myArmyConfig && myArmyConfig.myArmyConfig.numArcher}
                            numCavalry={myArmyConfig && myArmyConfig.myArmyConfig.numCavalry} />
                        <MineCaptureDrawerArmyCard title={"Enemy Army"} titleBg={"danger"}
                            numSwordsman={mineArmy && mineArmy.numSwordsman}
                            numArcher={mineArmy && mineArmy.numArcher}
                            numCavalry={mineArmy && mineArmy.numCavalry} />
                    </div>
                </div>
                <div className="d-flex justify-content-evenly">
                    <Button
                        colorScheme="whatsapp"
                        border="solid"
                        textColor="dark"
                        data-bs-dismiss="offcanvas"
                        onClick={handleCapture}
                    >
                        Capture the Mine
                    </Button>
                    <Button
                        colorScheme="red"
                        border="solid"
                        textColor="dark"
                        data-bs-dismiss="offcanvas"
                        onClick={handleCaptureLater}
                    >
                        Wait and Capture Later
                    </Button>
                </div>
            </div>
        </>
    );
}

const MineCaptureModalHeader = ({ resourceType }: { resourceType: number }) => {
    return (
        <h2 className="offcanvas-title text-center" id="mineCaptureDrawerLabel">
            {
                resourceType === 0 ? "Capture Food " :
                    resourceType === 1 ? "Capture Wood " :
                        "Capture Gold "
            }
            | War - Army Information
        </h2>
    )
}

interface MineCaptureDrawerArmyCardPropTypes {
    title: string,
    titleBg: string,
    numSwordsman: number,
    numArcher: number,
    numCavalry: number
}

const MineCaptureDrawerArmyCard = (props: MineCaptureDrawerArmyCardPropTypes) => {
    return (
        <div className="col-6">
            <h1 className={`text-center p-2 bg-${props.titleBg}`}>
                {props.title}
            </h1>
            <div className="row">
                <div className="row text-center mt-2">
                    <p>
                        Swordsman: {props.numSwordsman && props.numSwordsman}
                    </p>
                </div>
            </div>
            <div className="row">
                <div className="row text-center mt-2">
                    <p>
                        Archer: {props.numArcher && props.numArcher}
                    </p>
                </div>
            </div>
            <div className="row">
                <div className="row text-center mt-2">
                    <p>
                        Cavalry: {props.numCavalry && props.numCavalry}
                    </p>
                </div>
            </div>
        </div>
    )
}