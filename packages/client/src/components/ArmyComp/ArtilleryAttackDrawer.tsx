import artilleryShootEffect from '../../sounds/soundEffects/artillery-shoot-effect.mp3'
import { useEffect, useState } from "react";
import { EventProgressBar } from "../ProgressComp/EventProgressBar";
import { Button } from "@chakra-ui/react";
import { useMUD } from "../../context/MUDContext";
import { useAttack } from "../../context/AttackContext";
import { useError } from "../../context/ErrorContext";
import { useGame } from "../../context/GameContext";
import { getIDFromPosition } from "../../utils/helperFunctions/CustomFunctions/getIDFromPosition";
import { getCastleHPbyPosition } from "../../utils/helperFunctions/CastleFunctions/getCastleHPbyPosition";
import { useCastlePositions } from "../../hooks/CastleHooks/useCastlePositions";

export const ArtilleryAttackDrawer = () => {
    const { components, systemCalls } = useMUD();
    const { gameID } = useGame();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();
    const { setMyArtilleryConfig,
        myArtilleryConfig,
        attackToArtilleryPositionToCastle,
        setAttackToArtilleryPositionToCastle,
        attackFromArtilleryPositionToCastle,
        setAttackFromArtilleryPositionToCastle,
        setArtilleryAttackStage } = useAttack();

    const castlePositions = useCastlePositions(gameID)

    const [castleHP, setCastleHP] = useState(100)
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (attackToArtilleryPositionToCastle && castlePositions) {
            const castleHP = getCastleHPbyPosition(castlePositions, attackToArtilleryPositionToCastle)
            setCastleHP(castleHP)
        }
    }, [attackToArtilleryPositionToCastle])

    const handleAttackLater = () => {
        setArtilleryAttackStage(false);
        setMyArtilleryConfig(0);
    };

    const handleAttack = async () => {
        const attackFromArmyId = [...getIDFromPosition(
            attackFromArtilleryPositionToCastle,
            components.Position,
            gameID
        )];

        const attackToCastleId = [...getIDFromPosition(
            attackToArtilleryPositionToCastle,
            components.Position,
            gameID
        )];

        if (attackFromArmyId.length != 1 || attackToCastleId.length != 1) {
            setErrorMessage("An error occurred while trying to attack to castle.")
            setErrorTitle("Artillery to Castle Attack Error")
            setShowError(true)
            return
        }

        const audio = new Audio(artilleryShootEffect);
        audio.volume = 0.4;
        audio.play();

        setIsLoading(true)
        const tx = await systemCalls.captureCastle(attackFromArmyId[0], attackToCastleId[0])

        if (tx === null) {
            setErrorMessage("An error occurred while trying to attack to castle.")
            setErrorTitle("Artillery to Castle Attack Error")
            setShowError(true)
        }

        setIsLoading(false)
        setArtilleryAttackStage(false);
        setMyArtilleryConfig(0);
        setAttackFromArtilleryPositionToCastle(undefined)
        setAttackToArtilleryPositionToCastle(undefined)
    };

    if (isLoading) {
        return <EventProgressBar text="Artillery are trying to destroy castle walls..." />
    }

    return (
        <div
            className="offcanvas offcanvas-bottom attack-drawer h-25"
            data-bs-keyboard="false"
            data-bs-backdrop="false"
            id="attackArtilleryToCastleDrawer"
            aria-labelledby="attackArtilleryToCastleDrawerLabe"
        >
            <ArtilleryAttackModalHeader />
            <div className="offcanvas-body small">
                <div className="row justify-conten-center ">
                    <div className="col text-center text-2xl">
                        Artillery: {myArtilleryConfig}
                    </div>
                    <div className="col text-center text-2xl">
                        Castle HP: {castleHP}
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-evenly">
                <Button
                    colorScheme="whatsapp"
                    borderRadius={"15px"}
                    boxShadow={"0px 5px 0px 0px #33550F"}
                    data-bs-dismiss="offcanvas"
                    onClick={handleAttack}
                >
                    Attack to the Castle
                </Button>
                <Button
                    colorScheme="red"
                    borderRadius={"15px"}
                    boxShadow={"0px 5px 0px 0px #7E2918"}
                    data-bs-dismiss="offcanvas"
                    onClick={handleAttackLater}
                >
                    Wait and Attack Later
                </Button>
            </div>
        </div>
    );
}

const ArtilleryAttackModalHeader = () => {
    return (
        <h5 className="offcanvas-title text-center" id="attackArtilleryToCastleDrawerLabel">
            Castle Capture | Artillery Information
        </h5>
    )
}