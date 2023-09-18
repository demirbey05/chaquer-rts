import { Tooltip, Progress, ProgressLabel } from '@chakra-ui/react'
import { useArmy } from '../../../context/ArmyContext';

export const ArmyProgress = () => {
    const { numberOfArmy } = useArmy();
    return (
        <Tooltip label='Your army size is full.' fontSize='md' bg='red.500' closeDelay={2000} isDisabled={numberOfArmy !== 5}>
            <div className='col-md-6 me-1'>
                <Progress border={"2px"} bgColor={"transparent"} hasStripe isAnimated height={"32px"} value={numberOfArmy} max={5} borderRadius="10px" colorScheme="green">
                    <ProgressLabel fontSize="15px" className='text-dark'>
                        ⚔️ {numberOfArmy} / 5 ⚔️
                    </ProgressLabel>
                </Progress>
            </div>
        </Tooltip>
    )
}