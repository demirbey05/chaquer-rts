import { useGame } from '../../../context/GameContext';
import { Tooltip } from '@chakra-ui/react';
import { usePlayer } from '../../../context/PlayerContext';
import { useNumberOfResource } from '../../../hooks/ResourceHooks/useNumberOfResource';
import foodIcon from '../../../images/resourceAssets/corn_icon.png'

export const FoodCount = () => {
    const { userWallet } = usePlayer();
    const { gameID } = useGame();
    const numberOfResource = useNumberOfResource(userWallet, gameID);

    return (
        <div className="col-3 mine-progress-bar-col">
            <Tooltip label='Food' placement='bottom' >
                <img className='me-2' src={foodIcon} width={"30px"} height={"30px"} alt="food-icon" />
            </Tooltip>
            : {numberOfResource ? Number(numberOfResource.numOfFood) : 0}
        </div>
    )
}