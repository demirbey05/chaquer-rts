import artilleryMoveEffect from '../../../sounds/soundEffects/artillery-move-effect.mp3'
import { getArtilleyIDFromPosition } from "../../../utils/helperFunctions/CustomFunctions/getArtilleryIDFromPosition";

export const ArtilleryMoveEvent = async (
    fromArtilleryPositionRef: any,
    setIsArtilleryMoveStage: (value: boolean) => void,
    toArtilleryPositionRef: any,
    isArtilleryMoveStage: boolean | undefined,
    setFromArtilleryPosition: any,
    components: any,
    movingArtilleryId: any,
    systemCalls: any,
    setErrorMessage: any,
    setErrorTitle: any,
    setShowError: any,
    setIsLoading: (value: boolean) => void,
    gameID: number
) => {
    setIsArtilleryMoveStage(false);

    const movingArtilleryIdMap = getArtilleyIDFromPosition(
        fromArtilleryPositionRef.current,
        components.Position,
        components.ArtilleryOwnable,
        gameID
    );

    if (movingArtilleryIdMap !== null) {
        movingArtilleryId.current = [...movingArtilleryIdMap][0];
    }

    if (toArtilleryPositionRef.current && isArtilleryMoveStage) {
        setIsLoading(true);

        const audio = new Audio(artilleryMoveEffect);
        audio.volume = 0.2;
        audio.play();

        var targetDiv = document.getElementById(`${toArtilleryPositionRef.current.y},${toArtilleryPositionRef.current.x}`);
        targetDiv?.classList.add("animate-artillery-move");

        const tx = await systemCalls.moveArtillery(
            movingArtilleryId.current,
            toArtilleryPositionRef.current.x,
            toArtilleryPositionRef.current.y,
            gameID
        );

        if (tx) {
            setFromArtilleryPosition(undefined);
            toArtilleryPositionRef.current = { x: -1, y: -1 };
            fromArtilleryPositionRef.current = { x: "-1", y: "-1" };
        } else {
            setErrorMessage("You need 30 food + 30 diomand to move your artillery.");
            setErrorTitle("Artillery Move Warning");
            setShowError(true);
        }

        setIsLoading(false);
        targetDiv?.classList.remove("animate-artillery-move");
    }
};