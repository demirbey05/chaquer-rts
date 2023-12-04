import fleetBattleEffect from '../../sounds/soundEffects/fleet-battle-effect.mp3'
import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { EventProgressBar } from "../ProgressComp/EventProgressBar";
import { useMUD } from "../../context/MUDContext";
import { useError } from "../../context/ErrorContext";
import { useFleet } from "../../context/FleetContext";
import { useGame } from "../../context/GameContext";
import { getFleetIDFromPosition } from '../../utils/helperFunctions/CustomFunctions/getFleetIDFromPosition';

export const FleetAttackDrawer = () => {
    const { components, systemCalls } = useMUD();
    const { gameID } = useGame();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();
    const { myFleetConfig,
        setMyFleetConfig,
        setEnemyFleetConfig,
        enemyFleetConfig,
        setIsFleetAttackStage,
        attackerFleetPosition,
        targetFleetPosition } = useFleet();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleAttackLater = () => {
        setIsFleetAttackStage(false);
        setMyFleetConfig(undefined);
        setEnemyFleetConfig(undefined);
    };

    const handleAttack = async () => {
        const attackFromArmyId = [...getFleetIDFromPosition(
            attackerFleetPosition,
            components.Position,
            components.FleetOwnable,
            gameID
        )];

        const attackToArmyId = [...getFleetIDFromPosition(
            targetFleetPosition,
            components.Position,
            components.FleetOwnable,
            gameID
        )];

        if (attackFromArmyId.length != 1 || attackToArmyId.length != 1) {
            setErrorMessage("An error occurred while trying to attack to fleet.")
            setErrorTitle("Fleet Attack Error")
            setShowError(true)
            return
        }

        setIsLoading(true)

        const audio = new Audio(fleetBattleEffect);
        audio.volume = 0.2;
        audio.play();

        const tx = await systemCalls.attackFleet(attackFromArmyId[0] as string, attackToArmyId[0] as string, gameID)

        if (tx) {
            document.getElementById(`${targetFleetPosition!.y},${targetFleetPosition!.x}`)!.setAttribute("data-bs-toggle", "");
            document.getElementById(`${targetFleetPosition!.y},${targetFleetPosition!.x}`)!.setAttribute("data-bs-target", "");

            const isTask = localStorage.getItem("attackCaptureTask")
            !isTask && localStorage.setItem("attackCaptureTask", "true")
            window.dispatchEvent(new Event('localDataStorage'));
        } else {
            setErrorMessage("An error occurred while trying to attack to fleet.")
            setErrorTitle("Fleet Attack Error")
            setShowError(true)
        }

        setIsLoading(false)
        setIsFleetAttackStage(false);
        setMyFleetConfig(undefined);
        setEnemyFleetConfig(undefined);
    };

    if (isLoading) {
        return <EventProgressBar text="Ships are fighting..." />
    }

    return (
        <div
            className="offcanvas offcanvas-bottom attack-drawer"
            data-bs-keyboard="false"
            data-bs-backdrop="false"
            id="fleetAttackDrawer"
            aria-labelledby="fleetAttackDrawerLabel"
        >
            <FleetAttackModalHeader headerText={"War - Fleet Information"} />
            <div className="offcanvas-body small">
                <div className="row">
                    <FleetAttackModalCard
                        numSmall={myFleetConfig && myFleetConfig.myFleetConfig.numSmall}
                        numMedium={myFleetConfig && myFleetConfig.myFleetConfig.numMedium}
                        numBig={myFleetConfig && myFleetConfig.myFleetConfig.numBig}
                        title={"My Fleet"}
                        titleBg={"success"} />
                    <FleetAttackModalCard
                        numSmall={enemyFleetConfig && enemyFleetConfig.fleetConfig.numSmall}
                        numMedium={enemyFleetConfig && enemyFleetConfig.fleetConfig.numMedium}
                        numBig={enemyFleetConfig && enemyFleetConfig.fleetConfig.numBig}
                        title={"Enemy Fleet"}
                        titleBg={"danger"} />
                </div>
            </div>
            <div className="d-flex justify-content-evenly">
                <Button
                    colorScheme="whatsapp"
                    border="solid"
                    textColor="dark"
                    data-bs-dismiss="offcanvas"
                    onClick={handleAttack}>
                    Attack to the Fleet
                </Button>
                <Button
                    colorScheme="red"
                    border="solid"
                    textColor="dark"
                    data-bs-dismiss="offcanvas"
                    onClick={handleAttackLater}>
                    Wait and Attack Later
                </Button>
            </div>
        </div>
    );
}

const FleetAttackModalHeader = ({ headerText }: { headerText: string }) => {
    return (
        <h5 className="offcanvas-title text-center" id="fleetAttackDrawerLabel">
            {headerText}
        </h5>
    )
}

interface FleetAttackModalCardPropTypes {
    title: string,
    titleBg: string,
    numSmall: number,
    numMedium: number,
    numBig: number
};

const FleetAttackModalCard = (props: FleetAttackModalCardPropTypes) => {
    return (
        <div className="col-6">
            <h1 className={`text-center bg-${props.titleBg} p-2`}>
                {props.title}
            </h1>
            <FleetAttackModalCardRow numShip={props.numSmall} shipName={"Baron's Dagger"} />
            <FleetAttackModalCardRow numShip={props.numMedium} shipName={"Knight's Galley"} />
            <FleetAttackModalCardRow numShip={props.numBig} shipName={"King's Leviathan"} />
        </div>
    )
}

const FleetAttackModalCardRow = ({ numShip, shipName }: { numShip: number, shipName: string }) => {
    return (
        <div className="row text-center mt-2">
            <p>
                {shipName && shipName}: {numShip && numShip}
            </p>
        </div>
    )
}