import { useEffect } from "react";
import { colorPath } from "../../../utils/constants/constants";

export const CastleEffects = (myCastlePosition: any[], setIsCastleSettled: (value: boolean) => void, castlePositions: any[], isCastleSettled: boolean | undefined) => {
    // Check if castle settled before and deploy castle emojis
    useEffect(() => {
        //Checks that if the user has already settled the castle
        if (myCastlePosition && myCastlePosition.length > 0) {
            myCastlePosition.map((position: any) => {
                document.getElementById(`${position.myCastlePosition.y},${position.myCastlePosition.x}`)!.style.border = "2px solid";
                document.getElementById(`${position.myCastlePosition.y},${position.myCastlePosition.x}`)!.style.borderColor = colorPath[Number(position.myCastleColor.colorIndex)];
            });
            setIsCastleSettled(true);
        }

        return () => {
            if (myCastlePosition && myCastlePosition.length > 0) {
                myCastlePosition.map((position: any) => {
                    if (document.getElementById(`${position.myCastlePosition.y},${position.myCastlePosition.x}`)) {
                        document.getElementById(`${position.myCastlePosition.y},${position.myCastlePosition.x}`)!.style.border = "0.5px solid rgba(0, 0, 0, 0.1)";
                    }
                });
            }
        };
    }, [myCastlePosition]);

    //Puts the castle emojis to castle positions
    useEffect(() => {
        if (castlePositions) {
            castlePositions.map(
                (data) => {
                    document.getElementById(`${data.castlePosition.y},${data.castlePosition.x}`)!.innerHTML = "🏰";
                    document.getElementById(`${data.castlePosition.y},${data.castlePosition.x}`)!.style.border = "2px solid";
                    document.getElementById(`${data.castlePosition.y},${data.castlePosition.x}`)!.style.borderColor = colorPath[Number(data.castleColor.colorIndex)];
                    document.getElementById(`${data.castlePosition.y},${data.castlePosition.x}`)!.style.pointerEvents = "none";
                }
            );
        }
    }, [castlePositions])

    // Make castles unclickable during castle settlement
    useEffect(() => {
        if (castlePositions && !isCastleSettled) {
            castlePositions.map(
                (data) => {
                    document.getElementById(`${data.castlePosition.y},${data.castlePosition.x}`)!.style.pointerEvents = "none";
                }
            );
        }

        if (isCastleSettled) {
            castlePositions.map(
                (data) => {
                    document.getElementById(`${data.castlePosition.y},${data.castlePosition.x}`)!.style.pointerEvents = "auto";
                }
            );
        }
    }, [castlePositions, isCastleSettled])
}