import { useState } from "react";
import { useMUD } from "../../../context/MUDContext";
import { useGame } from "../../../context/GameContext";
import { Button } from "@chakra-ui/react";
import { FoodCount } from "../MineProgressBar/FoodCount";
import { WoodCount } from "../MineProgressBar/WoodCount";
import { GoldCount } from '../MineProgressBar/GoldCount';

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

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleCollect = async () => {
        setIsLoading(true)
        await systemCalls.collectResource(gameID)
        setIsLoading(false)
    }
    return (
        <div className="col-3 mine-progress-bar-col">
            <Button
                isLoading={isLoading}
                loadingText={"Collecting"}
                size={"sm"}
                textColor={"black"}
                colorScheme={"whatsapp"}
                border={"solid"}
                onClick={handleCollect}>
                Collect
            </Button>
        </div>
    )
}