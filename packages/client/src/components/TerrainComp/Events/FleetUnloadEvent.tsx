import { getFleetIDFromPosition } from "../../../utils/helperFunctions/CustomFunctions/getFleetIDFromPosition";
import fleetMoveSoundEffect from '../../../sounds/soundEffects/fleet-move-effect.mp3'

export const FleetUnloadEvent = async (
    setIsFleetUnloadStage: (value: boolean) => void,
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
    isFleetLoaded: boolean,
    gameID: number
) => {
    setSeaMineStage(false)
    setIsFleetAttackStage(false)
    setIsFleetMoveStage(false);

    const _fleetID = getFleetIDFromPosition(
        fromFleetPositionRef.current,
        components.Position,
        components.FleetOwnable,
        gameID
    );

    if (_fleetID !== null) {
        movingFleetID.current = [..._fleetID][0];
    }

    setIsFleetUnloadStage(false)

    if (toFleetPositionRef.current && isFleetMoveStage && isFleetLoaded) {
        setIsLoading(true)

        var targetDiv = document.getElementById(`${toFleetPositionRef.current.y},${toFleetPositionRef.current.x}`);
        targetDiv?.classList.add("animate-border-fleet-move");

        const tx = await systemCalls.unloadArmy(
            movingFleetID.current,
            toFleetPositionRef.current.x,
            toFleetPositionRef.current.y,
            gameID
        )

        if (tx) {
            setFromFleetPosition(undefined);
            toFleetPositionRef.current = { x: -1, y: -1 };
            fromFleetPositionRef.current = { x: "-1", y: "-1" };
        }

        setIsLoading(false)
        targetDiv?.classList.remove("animate-border-fleet-move");
    }
}