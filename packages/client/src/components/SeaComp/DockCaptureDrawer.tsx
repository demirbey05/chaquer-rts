import { Button } from "@chakra-ui/react";
import { findIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/findIDFromPosition";
import { useMUD } from "../../context/MUDContext";
import { useAttack } from "../../context/AttackContext";
import { findCastleCloseArmies } from "../../utils/helperFunctions/CastleFunctions/findCastleCloseArmies";
import { useEffect, useState } from "react";
import { useError } from "../../context/ErrorContext";
import { useSea } from "../../context/SeaContext";

export const DockCaptureDrawer = () => {
    const { components, systemCalls } = useMUD();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();
    const { setMyArmyConfig,
        setEnemyArmyConfig,
        myArmyConfig } = useAttack();
    const { targetDockPosition, dockAttackerArmyPosition, setDockCaptureStage } = useSea();
    const [dockArmy, setDockArmy] = useState<any>();

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
        const tx = await systemCalls.captureDock(attackFromArmyId[0], attackToDockID[0])
        if (tx == null) {
            setErrorMessage("An error occurred while trying to capture the dock.")
            setErrorTitle("Dock Capture Error")
            setShowError(true)
            return
        }

        setDockCaptureStage(false);
        setMyArmyConfig(undefined);
        setEnemyArmyConfig(undefined);
    };

    const dockCaptureOffCanvasDivStyle: any = {
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
            style={dockCaptureOffCanvasDivStyle}
            tabIndex={-1}
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
            <div className="d-flex justify-content-center">
                <div className="flex-column align-items-center">
                    <Button
                        colorScheme="whatsapp"
                        border="solid"
                        textColor="dark"
                        data-bs-dismiss="offcanvas"
                        onClick={handleAttack}
                        className="mr-2"
                    >
                        Capture Dock
                    </Button>
                    <Button
                        colorScheme="red"
                        border="solid"
                        textColor="dark"
                        data-bs-dismiss="offcanvas"
                        onClick={handleAttackLater}
                        className="ml-2"
                    >
                        Wait and Capture Later
                    </Button>
                </div>
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
        <>
            <div className="col-6" style={{ overflow: "hidden" }}>
                <h1 className={`text-center text-white p-2 bg-${props.titleBg}`}>
                    {props.title}
                </h1>
                <DockDrawerArmyCardRow soliderNum={props.numSwordsman} soliderName={"Swordsman"} />
                <DockDrawerArmyCardRow soliderNum={props.numArcher} soliderName={"Archer"} />
                <DockDrawerArmyCardRow soliderNum={props.numCavalry} soliderName={"Cavalry"} />
            </div>
        </>
    )
}

interface DockDrawerArmyCardRowPropTypes {
    soliderNum: number,
    soliderName: string
}

const DockDrawerArmyCardRow = (props: DockDrawerArmyCardRowPropTypes) => {
    return (
        <div className="row">
            <div className="row text-center mt-2">
                <p>
                    {props.soliderName && props.soliderName}: {props.soliderNum && props.soliderNum}
                </p>
            </div>
        </div>
    )
}

const DockAttackDrawerHeader = () => {
    return (
        <h5 className="offcanvas-title text-center text-white" id="dockCaptureDrawerLabel">
            Dock Capture | War - Army Information
        </h5>
    )
}