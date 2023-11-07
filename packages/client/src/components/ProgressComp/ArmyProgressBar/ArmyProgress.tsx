import { Tooltip, Progress, ProgressLabel } from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import { useArmy } from '../../../context/ArmyContext';
import { useGame } from '../../../context/GameContext';
import { usePlayer } from '../../../context/PlayerContext';
import { useMyCastlePositions } from '../../../hooks/CastleHooks/useMyCastlePositions';

export const ArmyProgress = () => {
    const { userWallet } = usePlayer();
    const { numberOfArmy } = useArmy();
    const { gameID } = useGame();
    const myCastlePositions = useMyCastlePositions(userWallet, gameID);

    const [maxArmySize, setMaxArmySize] = useState<number>(5);

    useEffect(() => {
        if (myCastlePositions) {
            setMaxArmySize(5 + (myCastlePositions.length - 1))
        } else {
            setMaxArmySize(5)
        }
    }, [myCastlePositions, numberOfArmy])
    return (
        <Tooltip
            label='Your army size is full.'
            fontSize='md'
            bg='red.500'
            isDisabled={numberOfArmy !== maxArmySize}>
            <div className='col-md-6 me-1'>
                <Progress
                    border={"1px"}
                    backgroundColor={"transparent"}
                    height={"32px"}
                    value={numberOfArmy}
                    max={maxArmySize}
                    borderRadius="10px"
                    colorScheme={"whatsapp"}>
                    <ProgressLabel fontSize="15px" className='text-white'>
                        ⚔️ {numberOfArmy} / {maxArmySize} ⚔️
                    </ProgressLabel>
                </Progress>
            </div>
        </Tooltip>
    )
}