import { Button } from "@chakra-ui/react";
import { findIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/findIDFromPosition";
import { useMUD } from "../../MUDContext";
import { useEffect, useState } from "react";
import { useMine } from "../../context/MineContext";
import { useAttack } from "../../context/AttackContext";
import { useResources } from "../../hooks/useResources";
import { findCastleCloseArmies } from "../../utils/helperFunctions/CastleFunctions/findCastleCloseArmies";
import { getResourceTypeByPosition } from "../../utils/helperFunctions/ResourceFuntions/getResourceTypeByPosition";
import { useError } from "../../context/ErrorContext";

export const MineCaptureDrawer = () => {
    const { components, systemCalls } = useMUD();
    const { targetMinePosition, setIsMineStage, attackFromArmyPositionToMine } = useMine();
    const { setMyArmyConfig, setEnemyArmyConfig, myArmyConfig } = useAttack();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();

    const [mineArmy, setMineArmy] = useState<any>();
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
            attackFromArmyPositionToMine,
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
            setShowError(true)
            return
        }
        const tx = await systemCalls.captureMine(attackFromArmyId[0], attackToMineId[0], 0)
        if (tx == null) {
            setErrorMessage("An error occurred while trying to capture a mine.")
            setErrorTitle("Mine Capture Error")
            setShowError(true)
            return
        }

        setIsMineStage(false);
        setMyArmyConfig(undefined);
        setEnemyArmyConfig(undefined);
    };

    const mineCaptureCanvasStyles = {
        width: "500px",
        left: "0",
        right: "0",
        margin: "auto",
        bottom: "25px",
        padding: "10px",
        backgroundColor: "rgb(148, 163, 184, 0.5)"
    }

    return (
        <div
            className="offcanvas offcanvas-bottom rounded-4 font-bold text-white"
            data-bs-keyboard="false"
            data-bs-backdrop="false"
            style={mineCaptureCanvasStyles}
            tabIndex={-1}
            id="mineCaptureDrawer"
            aria-labelledby="mineCaptureDrawerLabel"
        >
            <MineCaptureModalHeader resourceType={getResourceTypeByPosition(resources, targetMinePosition)} />
            <div className="offcanvas-body small">
                <div className="row">
                    <CastleAttackModalArmyCard title={"My Army"} titleBg={"success"}
                        numSwordsman={myArmyConfig && myArmyConfig.armyConfig.numSwordsman}
                        numArcher={myArmyConfig && myArmyConfig.armyConfig.numArcher}
                        numCavalry={myArmyConfig && myArmyConfig.armyConfig.numCavalry} />
                    <CastleAttackModalArmyCard title={"Enemy Army"} titleBg={"danger"}
                        numSwordsman={mineArmy && mineArmy.numSwordsman}
                        numArcher={mineArmy && mineArmy.numArcher}
                        numCavalry={mineArmy && mineArmy.numCavalry} />
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <div className="flex-column align-items-center">
                    <Button
                        colorScheme="whatsapp"
                        border="solid"
                        textColor="dark"
                        data-bs-dismiss="offcanvas"
                        onClick={handleCapture}
                        className="mr-2"
                    >
                        Capture the Mine
                    </Button>
                    <Button
                        colorScheme="red"
                        border="solid"
                        textColor="dark"
                        data-bs-dismiss="offcanvas"
                        onClick={handleCaptureLater}
                        className="ml-2"
                    >
                        Wait and Capture Later
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface MineCaptureModalHeaderProps {
    resourceType: number
}

const MineCaptureModalHeader = ({ resourceType }: MineCaptureModalHeaderProps) => {
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

interface CastleAttackModalArmyCardPropTypes {
    title: string,
    titleBg: string,
    numSwordsman: number,
    numArcher: number,
    numCavalry: number
}

const CastleAttackModalArmyCard = (props: CastleAttackModalArmyCardPropTypes) => {
    return (
        <>
            <div className="col-6">
                <h1 className={`text-center text-white p-2 bg-${props.titleBg}`}>
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
        </>
    )
}