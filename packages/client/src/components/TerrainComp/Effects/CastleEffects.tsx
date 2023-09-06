import { useEffect } from "react";

export const CastleEffects = (myCastlePosition: any[], setIsCastleSettled: (value: boolean) => void, castlePositions: any[], isCastleSettled: boolean | undefined) => {
    // Check if castle settled before and deploy castle emojis
    useEffect(() => {
        //Checks that if the user has already settled the castle
        if (myCastlePosition && myCastlePosition.length > 0) {
            myCastlePosition.map((position: any) => {
                document.getElementById(`${position.y},${position.x}`)!.style.border = "2px solid rgb(245, 169, 6)";
            });
            setIsCastleSettled(true);
        }

        return () => {
            if (myCastlePosition && myCastlePosition.length > 0) {
                myCastlePosition.map((position: any) => {
                    if (document.getElementById(`${position.y},${position.x}`)) {
                        document.getElementById(`${position.y},${position.x}`)!.style.border = "0.5px solid rgba(0, 0, 0, 0.1)";
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
                    document.getElementById(`${data.y},${data.x}`)!.innerHTML = "🏰";
                    document.getElementById(`${data.y},${data.x}`)!.style.pointerEvents = "none";
                }
            );
        }
    }, [castlePositions])

    // Make castles unclickable during castle settlement
    useEffect(() => {
        if (castlePositions && !isCastleSettled) {
            castlePositions.map(
                (data) => {
                    document.getElementById(`${data.y},${data.x}`)!.style.pointerEvents = "none";
                }
            );
        }

        if (isCastleSettled) {
            castlePositions.map(
                (data) => {
                    document.getElementById(`${data.y},${data.x}`)!.style.pointerEvents = "auto";
                }
            );
        }
    }, [castlePositions, isCastleSettled])
}