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
        const armyElements = Array.from({ length: 5 }, (_, index) =>
            document.getElementById(`army${index + 1}`)
        );

        armyElements.forEach((element, index) => {
            if (index < numberOfArmy) {
                element!.style.backgroundColor = 'green';
            } else {
                element!.style.backgroundColor = 'lightgray';
            }
        });
    }, [numberOfArmy, myArmyPosition]);

    return (
        <Tooltip hasArrow label='You have placed your all army' openDelay={300} closeDelay={300} bg='red.600' placement='right-start' isDisabled={numberOfArmy !== 5 || (isArmyMoveStage && !isArmyMoveStage)}>
            <div className="progress-bar">
                <div id="army1" className="progress progress-text">⚔️</div>
                <div id="army2" className="progress progress-text">⚔️</div>
                <div id="army3" className="progress progress-text">⚔️</div>
                <div id="army4" className="progress progress-text">⚔️</div>
                <div id="army5" className="progress progress-text">⚔️</div>
            </div>
        </Tooltip>

    )
}