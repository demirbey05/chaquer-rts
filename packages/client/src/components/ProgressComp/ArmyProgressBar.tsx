
import shipEmoji from '../../images/ship_emoji.png';
import { Tooltip, Progress, ProgressLabel } from '@chakra-ui/react'
import { useArmy } from '../../context/ArmyContext';
import { usePlayer } from '../../context/PlayerContext';
import { useMyDockPositions } from '../../hooks/SeaHooks/useMyDockPositions';
import { useMyFleetPositions } from '../../hooks/SeaHooks/useMyFleetPositions';

export const ArmyProgressBar = () => {
    const { numberOfArmy } = useArmy();
    const { userWallet } = usePlayer();
    const myFleetPositions = useMyFleetPositions(userWallet);
    const myDockPositions = useMyDockPositions(userWallet);

    return (
        <div className="army-progress-bar">
            <Tooltip label='Your army size is full.' fontSize='md' bg='red.500' closeDelay={2000} isDisabled={numberOfArmy !== 5}>
                <div className='col-md-6 me-1'>
                    <Progress border={"2px"} bgColor={"transparent"} hasStripe isAnimated height={"32px"} value={numberOfArmy} max={5} borderRadius="10px" colorScheme="green">
                        <ProgressLabel fontSize="15px" className='text-dark'>
                            ⚔️ {numberOfArmy} / 5 ⚔️
                        </ProgressLabel>
                    </Progress>
                </div>
            </Tooltip>
            <Tooltip label='Your fleet size is full. Deploy or Capture a dock to increase fleet capacity!' fontSize='md' bg='red.500' closeDelay={2000} isDisabled={myDockPositions && myFleetPositions && (myDockPositions.length !== myFleetPositions.length)}>
                <div className='col-md-6 ms-1'>
                    <Progress border={"2px"} bgColor={"transparent"} hasStripe isAnimated height={"32px"} value={myFleetPositions ? myFleetPositions.length : 0} max={(myDockPositions && myDockPositions!.length !== 0) ? myDockPositions?.length : 1} borderRadius="10px">
                        <ProgressLabel fontSize="15px" className='text-dark d-flex justify-center align-items-center'>
                            <img className='me-2' src={shipEmoji} alt="ship-emoji" width={"20px"} height={"20px"} />
                            {myFleetPositions ? myFleetPositions.length : 0} / {myDockPositions ? myDockPositions?.length : 0}
                            <img className='ms-2' src={shipEmoji} alt="ship-emoji" width={"20px"} height={"20px"} />
                        </ProgressLabel>
                    </Progress>
                </div>
            </Tooltip>
        </div>
    )
}