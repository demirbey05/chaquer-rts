import { Tooltip, Progress, ProgressLabel } from '@chakra-ui/react'
import { usePlayer } from '../../../context/PlayerContext';
import { useMyDockPositions } from '../../../hooks/SeaHooks/useMyDockPositions';
import { useMyFleetPositions } from '../../../hooks/SeaHooks/useMyFleetPositions';
import { useGame } from '../../../context/GameContext';
import { GiShipBow } from 'react-icons/gi'

export const FleetProgress = () => {
    const { userWallet } = usePlayer();
    const { gameID } = useGame();
    const myFleetPositions = useMyFleetPositions(userWallet, gameID);
    const myDockPositions = useMyDockPositions(userWallet, gameID);
    return (
        <Tooltip
            label='Your Fleet Size'
            fontSize='md'>
            <div className='col-md-6 ms-1'>
                <Progress
                    border={"1px"}
                    backgroundColor={"transparent"}
                    height={"32px"}
                    value={myFleetPositions ? myFleetPositions.length : 0}
                    max={(myDockPositions && myDockPositions!.length !== 0) ? myDockPositions?.length : 1}
                    borderRadius="10px">
                    <ProgressLabel fontSize="15px" className='d-flex justify-center align-items-center'>
                        <GiShipBow className='me-2' />
                        {myFleetPositions ? myFleetPositions.length : 0} / {myDockPositions ? myDockPositions?.length : 0}
                        <GiShipBow className='ms-2' />
                    </ProgressLabel>
                </Progress>
            </div>
        </Tooltip>
    )
}