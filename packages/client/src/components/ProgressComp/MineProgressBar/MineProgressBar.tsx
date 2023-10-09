import { useEffect, useState } from "react";
import { useMUD } from "../../../context/MUDContext";
import { useGame } from "../../../context/GameContext";
import { Button, Tooltip } from "@chakra-ui/react";
import { FoodCount } from "../MineProgressBar/FoodCount";
import { WoodCount } from "../MineProgressBar/WoodCount";
import { GoldCount } from '../MineProgressBar/GoldCount';
import { useLastResourceCollectBlock } from "../../../hooks/ResourceHooks/useLastResourceCollectBlock";
import { usePlayer } from "../../../context/PlayerContext";

export const MineProgressBar = () => {
    return (
        <div className="mine-progress-bar">
            <FoodCount />
            <WoodCount />
            <GoldCount />
            <CollectButton />
        </div>
    )
}

const CollectButton = () => {
    const { systemCalls } = useMUD();
    const { gameID } = useGame();
    const { userWallet } = usePlayer();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(true);

    const lastCollectBlock = useLastResourceCollectBlock(gameID, userWallet);

    useEffect(() => {
        if (lastCollectBlock >= 5) {
            setIsDisabled(false)
        } else {
            setIsDisabled(true)
        }
    }, [lastCollectBlock])

    const handleCollect = async () => {
        setIsLoading(true)
        await systemCalls.collectResource(gameID)
        setIsLoading(false)
    }
    return (
        <div className="col-3 mine-progress-bar-col">
            <Tooltip
                hasArrow
                fontSize='md'
                bg={"Highlight"}
                label='Resources ready...'
                placement='right'
                isOpen={!isDisabled}>
                <Button
                    isDisabled={isDisabled}
                    isLoading={isLoading}
                    loadingText={"Collecting"}
                    size={"sm"}
                    textColor={"black"}
                    colorScheme={"whatsapp"}
                    border={"solid"}
                    onClick={handleCollect}>
                    Collect
                </Button>
            </Tooltip>

        </div>
    )
}