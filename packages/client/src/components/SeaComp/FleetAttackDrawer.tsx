import { Button } from "@chakra-ui/react";
import { useMUD } from "../../MUDContext";
import { findIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/findIDFromPosition";
import { useError } from "../../context/ErrorContext";
import { useFleet } from "../../context/FleetContext";

export const FleetAttackDrawer = () => {
    const { components, systemCalls } = useMUD();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();
    const { myFleetConfig,
        setMyFleetConfig,
        setEnemyFleetConfig,
        enemyFleetConfig,
        setIsFleetAttackStage,
        attackerFleetPosition,
        targetFleetPosition } = useFleet();

    const handleAttackLater = () => {
        setIsFleetAttackStage(false);
        setMyFleetConfig(undefined);
        setEnemyFleetConfig(undefined);
    };

    const handleAttack = async () => {
        const attackFromArmyId = [...findIDFromPosition(
            attackerFleetPosition,
            components.Position,
        )];

        const attackToArmyId = [...findIDFromPosition(
            targetFleetPosition,
            components.Position,
        )];

        if (attackFromArmyId.length != 1 || attackToArmyId.length != 1) {
            setErrorMessage("An error occurred while trying to attack to fleet.")
            setErrorTitle("Fleet Attack Error")
            setShowError(true)
            return
        }

        const tx = await systemCalls.attackFleet(attackFromArmyId[0] as string, attackToArmyId[0] as string, 1)

        if (tx == null) {
            setErrorMessage("An error occurred while trying to attack to fleet.")
            setErrorTitle("Fleet Attack Error")
            setShowError(true)
            return
        }

        document.getElementById(`${targetFleetPosition.y},${targetFleetPosition.x}`)!.setAttribute("data-bs-toggle", "");
        document.getElementById(`${targetFleetPosition.y},${targetFleetPosition.x}`)!.setAttribute("data-bs-target", "");

        setIsFleetAttackStage(false);
        setMyFleetConfig(undefined);
        setEnemyFleetConfig(undefined);
    };

    const fleetAttackOffCanvasDivStyles: any = {
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
            style={fleetAttackOffCanvasDivStyles}
            tabIndex={-1}
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
                        Attack to the Enemy
                    </Button>
                    <Button
                        colorScheme="red"
                        border="solid"
                        textColor="dark"
                        data-bs-dismiss="offcanvas"
                        onClick={handleAttackLater}
                        className="ml-2">
                        Wait and Attack Later
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface FleetAttackModalHeaderPropTypes {
    headerText: string
};

const FleetAttackModalHeader = (props: FleetAttackModalHeaderPropTypes) => {
    return (
        <h5 className="offcanvas-title text-center" id="fleetAttackDrawerLabel">
            {props.headerText}
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
            <h1 className={`text-center bg-${props.titleBg}  text-white p-2`}>
                {props.title}
            </h1>
            <FleetAttackModalCardRow numShip={props.numSmall} shipName={"Baron's Dagger"} />
            <FleetAttackModalCardRow numShip={props.numMedium} shipName={"Knight's Galley"} />
            <FleetAttackModalCardRow numShip={props.numBig} shipName={"King's Leviathan"} />
        </div>
    )
}

interface FleetAttackModalCardRowPropTypes {
    numShip: number,
    shipName: string
}

const FleetAttackModalCardRow = (props: FleetAttackModalCardRowPropTypes) => {
    return (
        <div className="row">
            <div className="row text-center mt-2">
                <p>
                    {props.shipName && props.shipName}: {props.numShip && props.numShip}
                </p>
            </div>
        </div>
    )

}