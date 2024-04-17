import { useEffect } from "react";
import { getBorderColor } from "../../../utils/constants/getBorderColors";
import customCastle from '../../../images/castleAssets/custom-castle.png'

export const CastleEffects = (fleetSettleStage: boolean,
    myCastlePosition: any[],
    setIsCastleSettled: (value: boolean) => void,
    castlePositions: any[],
    isCastleSettled: boolean | undefined,
    userValid: boolean | undefined
) => {
    // Check if castle settled before
    useEffect(() => {
        if (myCastlePosition && myCastlePosition.length > 0) {
            setIsCastleSettled(true)
        } else {
            if (userValid !== undefined && userValid === true) {
                setIsCastleSettled(false)
            } else if (userValid !== undefined && userValid === false) {
                setIsCastleSettled(true)
            } else {
                setIsCastleSettled(false)
            }
        }
    }, [myCastlePosition, userValid])

    // Deploy castle emojis
    useEffect(() => {
        //Checks that if the user has already settled the castle
        if (myCastlePosition && myCastlePosition.length > 0) {
            myCastlePosition.map((position: any) => {
                document.getElementById(`${position.myCastlePosition.y},${position.myCastlePosition.x}`)!.style.border = "4px solid";
                document.getElementById(`${position.myCastlePosition.y},${position.myCastlePosition.x}`)!.style.borderColor = getBorderColor(Number(position.myCastleColor.colorIndex));
            });
        }

        return () => {
            if (myCastlePosition && myCastlePosition.length > 0) {
                myCastlePosition.map((position: any) => {
                    if (document.getElementById(`${position.myCastlePosition.y},${position.myCastlePosition.x}`)) {
                        document.getElementById(`${position.myCastlePosition.y},${position.myCastlePosition.x}`)!.style.border = "";
                    }
                });
            }
        };
    }, [myCastlePosition]);

    //Puts the castle emojis to castle positions
    useEffect(() => {
        if (castlePositions) {
            castlePositions.forEach((data) => {
                const element = document.getElementById(`${data.castlePosition.y},${data.castlePosition.x}`);
                if (element) {
                    const imgElement = document.createElement("img");
                    imgElement.src = customCastle;
                    imgElement.style.transform = "rotateX(-60deg) rotateZ(-25deg) rotateY(45deg)"
                    imgElement.style.height = "100px"
                    imgElement.style.width = "75px"
                    imgElement.style.scale = "1.25"
                    imgElement.style.marginBottom = "25px"
                    imgElement.style.marginRight = "25px"
                    imgElement.style.zIndex = "1"
                    imgElement.style.pointerEvents = "none"

                    element.appendChild(imgElement);
                    element.style.border = "4px solid";
                    element.style.borderColor = getBorderColor(Number(data.castleColor.colorIndex));
                    element.setAttribute("data-toggle", "tooltip");
                    element.setAttribute("data-placement", "top");
                    element.setAttribute("title", Number(data.castleHP.castleHP).toString() + " HP");
                }
            });
        }


        return () => {
            if (castlePositions && castlePositions.length > 0) {
                castlePositions.forEach((position) => {
                    const elementToClear = document.getElementById(`${position.castlePosition.y},${position.castlePosition.x}`);
                    if (elementToClear) {
                        elementToClear.innerHTML = "";
                        elementToClear.style.border = "";
                    }
                });
            }
        };
    }, [castlePositions]);

    // Make castles unclickable during army settlement
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

    // Make castles unclickable during fleet settlement
    useEffect(() => {
        if (castlePositions && fleetSettleStage) {
            castlePositions.map(
                (data) => {
                    document.getElementById(`${data.castlePosition.y},${data.castlePosition.x}`)!.style.pointerEvents = "none";
                }
            );
        }

        if (castlePositions && !fleetSettleStage) {
            castlePositions.map(
                (data) => {
                    document.getElementById(`${data.castlePosition.y},${data.castlePosition.x}`)!.style.pointerEvents = "auto";
                }
            );
        }
    }, [castlePositions, fleetSettleStage])
}