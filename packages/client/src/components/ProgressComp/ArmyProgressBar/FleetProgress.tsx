import shipEmoji from '../../../images/ship_emoji.png';
import { Tooltip, Progress, ProgressLabel } from '@chakra-ui/react'
import { usePlayer } from '../../../context/PlayerContext';
import { useMyDockPositions } from '../../../hooks/SeaHooks/useMyDockPositions';
import { useMyFleetPositions } from '../../../hooks/SeaHooks/useMyFleetPositions';

export const FleetProgress = () => {
    const { userWallet } = usePlayer();
    const myFleetPositions = useMyFleetPositions(userWallet);
    const myDockPositions = useMyDockPositions(userWallet);
    return (
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
    )
}