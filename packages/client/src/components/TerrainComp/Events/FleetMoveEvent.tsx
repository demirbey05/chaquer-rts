import { getIDFromPosition } from "../../../utils/helperFunctions/CustomFunctions/getIDFromPosition";
import fleetMoveSoundEffect from '../../../sounds/soundEffects/fleet-move-effect.mp3'

export const FleetMoveEvent = async (
    setIsFleetMoveStage: (value: boolean) => void,
    setSeaMineStage: (value: boolean) => void,
    setIsFleetAttackStage: (value: boolean) => void,
    fromFleetPositionRef: any,
    toFleetPositionRef: any,
    isFleetMoveStage: boolean,
    fromFleetPosition: any,
    setFromFleetPosition: any,
    components: any,
    movingFleetID: any,
    systemCalls: any,
    setErrorMessage: any,
    setErrorTitle: any,
    setShowError: any,
    setIsLoading: (value: boolean) => void,
    gameID: number
) => {
    setSeaMineStage(false)
    setIsFleetAttackStage(false)

    const _fleetID = getIDFromPosition(
        fromFleetPositionRef.current,
        components.Position,
        gameID
    );

    if (_fleetID !== null) {
        movingFleetID.current = [..._fleetID][0];
    }

    setIsFleetMoveStage(false);

    if (toFleetPositionRef.current && isFleetMoveStage) {
        setIsLoading(true)
        var targetDiv = document.getElementById(`${toFleetPositionRef.current.y},${toFleetPositionRef.current.x}`);
        targetDiv?.classList.add("animate-border-fleet-move");

        const tx = await systemCalls.moveFleet(
            movingFleetID.current,
            toFleetPositionRef.current.x,
            toFleetPositionRef.current.y
        )

        if (tx) {
            const audio = new Audio(fleetMoveSoundEffect);
            audio.volume = 0.2;
            audio.play();

            const isTask = localStorage.getItem("fleetMovementTask")
            !isTask && localStorage.setItem("fleetMovementTask", "true")

            setFromFleetPosition(undefined);
            toFleetPositionRef.current = { x: -1, y: -1 };
            fromFleetPositionRef.current = { x: "-1", y: "-1" };
        } else {
            setErrorMessage("You need 50 food + 50 diomand to move your fleet.")
            setErrorTitle("Fleet Move Warning")
            setShowError(true)
        }

        setIsLoading(false)
        targetDiv?.classList.remove("animate-border-fleet-move");
    }
}