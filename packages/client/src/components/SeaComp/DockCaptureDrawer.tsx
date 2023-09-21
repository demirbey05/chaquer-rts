import { useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";
import { EventProgressBar } from "../ProgressComp/EventProgressBar";
import { useError } from "../../context/ErrorContext";
import { useSea } from "../../context/SeaContext";
import { useMUD } from "../../context/MUDContext";
import { useAttack } from "../../context/AttackContext";
import { findCastleCloseArmies } from "../../utils/helperFunctions/CastleFunctions/findCastleCloseArmies";
import { findIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/findIDFromPosition";

export const DockCaptureDrawer = () => {
    const { components, systemCalls } = useMUD();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();
    const { setMyArmyConfig,
        setEnemyArmyConfig,
        myArmyConfig } = useAttack();
    const { targetDockPosition, dockAttackerArmyPosition, setDockCaptureStage } = useSea();

    const [dockArmy, setDockArmy] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleAttackLater = () => {
        setDockCaptureStage(false);
        setMyArmyConfig(undefined);
        setEnemyArmyConfig(undefined);
    };

    useEffect(() => {
        if (targetDockPosition) {
            const dockId = [...findIDFromPosition(
                targetDockPosition,
                components.Position,
            )];

            setDockArmy(findCastleCloseArmies(dockId[0], components.Position, components.DockOwnable, components.ArmyOwnable, components.ArmyConfig))
        }
    }, [targetDockPosition])

    const handleAttack = async () => {
        const attackFromArmyId = [...findIDFromPosition(
            dockAttackerArmyPosition,
            components.Position,
        )];

        const attackToDockID = [...findIDFromPosition(
            targetDockPosition,
            components.Position,
        )];

        findCastleCloseArmies(attackToDockID[0], components.Position, components.DockOwnable, components.ArmyOwnable, components.ArmyConfig)

        if (attackFromArmyId.length != 1 || attackToDockID.length != 1) {
            setErrorMessage("An error occurred while trying to capture the dock.")
            setErrorTitle("Dock Capture Error")
            setShowError(true)
            return
        }

        try {
            setIsLoading(true)
            const tx = await systemCalls.captureDock(attackFromArmyId[0], attackToDockID[0])
        } catch (error) {
            setErrorMessage("An error occurred while trying to capture the dock.")
            setErrorTitle("Dock Capture Error")
            setShowError(true)
        } finally {
            setDockCaptureStage(false);
            setMyArmyConfig(undefined);
            setEnemyArmyConfig(undefined);
            setIsLoading(false)
        }
    };

    if (isLoading) {
        return <EventProgressBar text="Armies are capturing the dock..." />
    }

    return (
        <div
            className="offcanvas offcanvas-bottom attack-drawer"
            data-bs-keyboard="false"
            data-bs-backdrop="false"
            id="dockCaptureDrawer"
            aria-labelledby="dockCaptureDrawerLabel"
        >
            <DockAttackDrawerHeader />
            <div className="offcanvas-body small">
                <div className="row">
                    <DockDrawerArmyCard title={"My Army"} titleBg={"success"}
                        numSwordsman={myArmyConfig && myArmyConfig.myArmyConfig.numSwordsman}
                        numArcher={myArmyConfig && myArmyConfig.myArmyConfig.numArcher}
                        numCavalry={myArmyConfig && myArmyConfig.myArmyConfig.numCavalry} />
                    <DockDrawerArmyCard title={"Enemy Army"} titleBg={"danger"}
                        numSwordsman={dockArmy && dockArmy.numSwordsman}
                        numArcher={dockArmy && dockArmy.numArcher}
                        numCavalry={dockArmy && dockArmy.numCavalry} />
                </div>
            </div>
            <div className="d-flex justify-content-evenly">
                <Button
                    colorScheme="whatsapp"
                    border="solid"
                    textColor="dark"
                    data-bs-dismiss="offcanvas"
                    onClick={handleAttack}
                >
                    Capture the Dock
                </Button>
                <Button
                    colorScheme="red"
                    border="solid"
                    textColor="dark"
                    data-bs-dismiss="offcanvas"
                    onClick={handleAttackLater}
                >
                    Wait and Capture Later
                </Button>
            </div>
        </div>
    );
}

interface DockDrawerArmyCardPropTypes {
    title: string,
    titleBg: string,
    numSwordsman: number,
    numArcher: number,
    numCavalry: number
}

const DockDrawerArmyCard = (props: DockDrawerArmyCardPropTypes) => {
    return (
        <div className="col-6" style={{ overflow: "hidden" }}>
            <h1 className={`text-center p-2 bg-${props.titleBg}`}>
                {props.title}
            </h1>
            <DockDrawerArmyCardRow soldierNum={props.numSwordsman} soldierName={"Swordsman"} />
            <DockDrawerArmyCardRow soldierNum={props.numArcher} soldierName={"Archer"} />
            <DockDrawerArmyCardRow soldierNum={props.numCavalry} soldierName={"Cavalry"} />
        </div>
    )
}

const DockDrawerArmyCardRow = ({ soldierName, soldierNum }: {
    soldierNum: number,
    soldierName: string
}) => {
    return (
        <div className="row text-center mt-2">
            <p>
                {soldierName && soldierName}: {soldierNum && soldierNum}
            </p>
        </div>
    )
}

const DockAttackDrawerHeader = () => {
    return (
        <h5 className="offcanvas-title text-center" id="dockCaptureDrawerLabel">
            Dock Capture | War - Army Information
        </h5>
    )
}