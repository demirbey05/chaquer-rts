import { useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";
import { EventProgressBar } from "../ProgressComp/EventProgressBar";
import { useError } from "../../context/ErrorContext";
import { useMUD } from "../../context/MUDContext";
import { useAttack } from "../../context/AttackContext";
import { useGame } from "../../context/GameContext";
import { getDefenderArmyConfig } from "../../utils/helperFunctions/CustomFunctions/getDefenderArmyConfig";
import { getIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/getIDFromPosition";
import { getArtilleyIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/getArtilleryIDFromPosition";
import { useArmy } from "../../context/ArmyContext";

export const ArtilleryCaptureDrawer = () => {
    const { components, systemCalls } = useMUD();
    const { gameID } = useGame();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();
    const { setMyArmyConfig, setEnemyArmyConfig, myArmyConfig } = useAttack();
    const { targetArtilleryPosition, artilleryAttackerArmyPosition, setArtilleryCaptureStage } = useArmy();

    const [artilleryArmy, setArtilleryArmy] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleAttackLater = () => {
        setArtilleryCaptureStage(false);
        setMyArmyConfig(undefined);
        setEnemyArmyConfig(undefined);
    };

    useEffect(() => {
        if (targetArtilleryPosition) {
            const artillerId = [...getArtilleyIDFromPosition(
                targetArtilleryPosition,
                components.Position,
                components.ArtilleryOwnable,
                gameID
            )];

            setArtilleryArmy(getDefenderArmyConfig(artillerId[0], components.Position, components.ArtilleryOwnable, components.ArmyOwnable, components.ArmyConfig, gameID))
        }
    }, [targetArtilleryPosition])

    const handleAttack = async () => {
        const attackFromArmyId = [...getIDFromPosition(
            artilleryAttackerArmyPosition,
            components.Position,
            gameID
        )];

        const attackToArtilleryID = [...getArtilleyIDFromPosition(
            targetArtilleryPosition,
            components.Position,
            components.ArtilleryOwnable,
            gameID
        )];

        if (attackFromArmyId.length != 1 || attackToArtilleryID.length != 1) {
            setErrorMessage("An error occurred while trying to capture the artillery.")
            setErrorTitle("Artillery Capture Error")
            setShowError(true)
            return
        }

        setIsLoading(true)
        const tx = await systemCalls.attackToArtillery(attackFromArmyId[0], attackToArtilleryID[0])

        if (tx === null) {
            setErrorMessage("An error occurred while trying to capture the artillery.")
            setErrorTitle("Artillery Capture Error")
            setShowError(true)
        } else {
            const isTask = localStorage.getItem("attackCaptureTask")
            !isTask && localStorage.setItem("attackCaptureTask", "true")
            window.dispatchEvent(new Event('localDataStorage'));
        }

        setIsLoading(false)
        setArtilleryCaptureStage(false);
        setMyArmyConfig(undefined);
        setEnemyArmyConfig(undefined);
    };

    if (isLoading) {
        return <EventProgressBar text="Armies are capturing the artillery..." />
    }

    return (
        <div
            className="offcanvas offcanvas-bottom attack-drawer"
            data-bs-keyboard="false"
            data-bs-backdrop="false"
            id="artilleryCaptureDrawer"
            aria-labelledby="artilleryCaptureDrawerLabel"
        >
            <ArtilleryAttackDrawerHeader />
            <div className="offcanvas-body small">
                <div className="row">
                    <DockDrawerArmyCard title={"My Army"} titleBg={"success"}
                        numSwordsman={myArmyConfig && myArmyConfig.myArmyConfig.numSwordsman}
                        numArcher={myArmyConfig && myArmyConfig.myArmyConfig.numArcher}
                        numCavalry={myArmyConfig && myArmyConfig.myArmyConfig.numCavalry} />
                    <DockDrawerArmyCard title={"Enemy Army"} titleBg={"danger"}
                        numSwordsman={artilleryArmy && artilleryArmy.numSwordsman}
                        numArcher={artilleryArmy && artilleryArmy.numArcher}
                        numCavalry={artilleryArmy && artilleryArmy.numCavalry} />
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
                    Capture the Artillery
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
            <ArtilleryDrawerArmyCardRow soldierNum={props.numSwordsman} soldierName={"Swordsman"} />
            <ArtilleryDrawerArmyCardRow soldierNum={props.numArcher} soldierName={"Archer"} />
            <ArtilleryDrawerArmyCardRow soldierNum={props.numCavalry} soldierName={"Cavalry"} />
        </div>
    )
}

const ArtilleryDrawerArmyCardRow = ({ soldierName, soldierNum }: {
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

const ArtilleryAttackDrawerHeader = () => {
    return (
        <h5 className="offcanvas-title text-center" id="artilleryCaptureDrawerLabel">
            Artillery Capture | War - Army Information
        </h5>
    )
}