import "../../styles/globals.css";
import { useEffect } from 'react'
import { useMyArmy } from '../../hooks/useMyArmy';
import { Tooltip } from '@chakra-ui/react'
import { useArmy } from '../../context/ArmyContext';
import { usePlayer } from '../../context/PlayerContext';

export const ArmyProgressBar = () => {
    const { numberOfArmy, isArmyMoveStage } = useArmy();
    const { userWallet } = usePlayer()
    const myArmyPosition: any = useMyArmy(userWallet)[0];

    useEffect(() => {
        if (numberOfArmy === 1) {
            document.getElementById('army1')!.style.backgroundColor = "green";
            document.getElementById('army2')!.style.backgroundColor = "lightgray";
            document.getElementById('army3')!.style.backgroundColor = "lightgray";
        }
        else if (numberOfArmy === 2) {
            document.getElementById('army1')!.style.backgroundColor = "green";
            document.getElementById('army2')!.style.backgroundColor = "green";
            document.getElementById('army3')!.style.backgroundColor = "lightgray";
        }
        else if (numberOfArmy === 3) {
            document.getElementById('army1')!.style.backgroundColor = "green";
            document.getElementById('army2')!.style.backgroundColor = "green";
            document.getElementById('army3')!.style.backgroundColor = "green";
        }
        else {
            document.getElementById('army1')!.style.backgroundColor = "lightgray";
            document.getElementById('army2')!.style.backgroundColor = "lightgray";
            document.getElementById('army3')!.style.backgroundColor = "lightgray";
        }
    }, [numberOfArmy, myArmyPosition])

    return (
        <Tooltip hasArrow label='You have placed your all army' openDelay={300} closeDelay={300} bg='red.600' placement='right-start' isDisabled={numberOfArmy !== 3 || (isArmyMoveStage && !isArmyMoveStage)}>
            <div className="progress-bar">
                <div id="army1" className="progress progress-text">⚔️</div>
                <div id="army2" className="progress progress-text">⚔️</div>
                <div id="army3" className="progress progress-text">⚔️</div>
            </div>
        </Tooltip>

    )
}