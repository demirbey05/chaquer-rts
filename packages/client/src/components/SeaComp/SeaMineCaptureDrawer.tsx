import { useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";
import { EventProgressBar } from "../ProgressComp/EventProgressBar";
import { useError } from "../../context/ErrorContext";
import { useSea } from "../../context/SeaContext";
import { useFleet } from "../../context/FleetContext";
import { useMUD } from "../../context/MUDContext";
import { findIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/findIDFromPosition";
import { findCastleCloseArmies } from "../../utils/helperFunctions/CastleFunctions/findCastleCloseArmies";
import { getResourceTypeByPosition } from "../../utils/helperFunctions/ResourceFuntions/getResourceTypeByPosition";
import { useResources } from "../../hooks/ResourceHooks/useResources";
import { useGame } from "../../context/GameContext";

export const SeaMineCaptureDrawer = () => {
    const { components, systemCalls } = useMUD();
    const { targetSeaMinePosition, setSeaMineStage, seaMineAttackerFleetPosition } = useSea();
    const { setMyFleetConfig, setEnemyFleetConfig, myFleetConfig } = useFleet();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();
    const { gameID } = useGame();

    const [mineFleet, setMineFleet] = useState<any>();
    const [isLoading, setIsLoading] = useState<any>(false);

    const resources = useResources(gameID);

    const handleCaptureLater = () => {
        setSeaMineStage(false);
        setMyFleetConfig(undefined);
        setEnemyFleetConfig(undefined);
    };

    useEffect(() => {
        if (targetSeaMinePosition) {
            const mineId = [...findIDFromPosition(
                targetSeaMinePosition,
                components.Position,
            )];

            setMineFleet(findCastleCloseArmies(mineId[0], components.Position, components.ResourceOwnable, components.FleetOwnable, components.FleetConfig))
        }
    }, [targetSeaMinePosition])

    const handleCapture = async () => {
        const attackFromFleetId = [...findIDFromPosition(
            seaMineAttackerFleetPosition,
            components.Position,
        )];

        const attackToMineId = [...findIDFromPosition(
            targetSeaMinePosition,
            components.Position,
        )];

        findCastleCloseArmies(attackToMineId[0], components.Position, components.ResourceOwnable, components.FleetOwnable, components.ArmyConfig)

        if (attackFromFleetId.length != 1 || attackToMineId.length != 1) {
            setErrorMessage("An error occurred while trying to capture a sea mine.")
            setErrorTitle("Sea Mine Capture Error")
            setShowError(true)
            return
        }

        try {
            setIsLoading(true)
            const tx = await systemCalls.captureMine(attackFromFleetId[0], attackToMineId[0], 1)
        } catch (error) {
            setErrorMessage("An error occurred while trying to capture a sea mine.")
            setErrorTitle("Sea Mine Capture Error")
            setShowError(true)
        } finally {
            setSeaMineStage(false);
            setMyFleetConfig(undefined);
            setEnemyFleetConfig(undefined);
            setIsLoading(false)
        }
    };

    if (isLoading) {
        return <EventProgressBar text={"Fleet is capturing the resources..."} />
    }

    return (
        <div
            className="offcanvas offcanvas-bottom attack-drawer"
            data-bs-keyboard="false"
            data-bs-backdrop="false"
            id="seaMineCaptureDrawer"
            aria-labelledby="seaMineCaptureDrawerLabel"
        >
            <MineCaptureModalHeader resourceType={getResourceTypeByPosition(resources, targetSeaMinePosition)} />
            <div className="offcanvas-body small">
                <div className="row">
                    <SeaMineAttackFleetCard title={"My Fleet"} titleBg={"success"}
                        numSmall={myFleetConfig && myFleetConfig.myFleetConfig.numSmall}
                        numMedium={myFleetConfig && myFleetConfig.myFleetConfig.numMedium}
                        numBig={myFleetConfig && myFleetConfig.myFleetConfig.numBig} />
                    <SeaMineAttackFleetCard title={"Enemy Fleet"} titleBg={"danger"}
                        numSmall={mineFleet && mineFleet.numSwordsman}
                        numMedium={mineFleet && mineFleet.numArcher}
                        numBig={mineFleet && mineFleet.numCavalry} />
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
                    Capture the Sea Mine
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

interface SeaMineAttackFleetCardPropTypes {
    title: string,
    titleBg: string,
    numSmall: number,
    numMedium: number,
    numBig: number
}

const SeaMineAttackFleetCard = (props: SeaMineAttackFleetCardPropTypes) => {
    return (
        <div className="col-6">
            <h1 className={`text-center p-2 bg-${props.titleBg}`}>
                {props.title}
            </h1>
            <div className="row">
                <div className="row text-center mt-2">
                    <p>
                        Baron's Dagger: {props.numSmall && props.numSmall}
                    </p>
                </div>
            </div>
            <div className="row">
                <div className="row text-center mt-2">
                    <p>
                        Knight's Galley: {props.numMedium && props.numMedium}
                    </p>
                </div>
            </div>
            <div className="row">
                <div className="row text-center mt-2">
                    <p>
                        King's Leviathan: {props.numBig && props.numBig}
                    </p>
                </div>
            </div>
        </div>
    )
}