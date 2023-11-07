import { useGame } from '../../../context/GameContext';
import { Tooltip } from '@chakra-ui/react';
import { usePlayer } from '../../../context/PlayerContext';
import { useNumberOfResource } from '../../../hooks/ResourceHooks/useNumberOfResource';
import stoneIcon from '../../../images/resourceAssets/stone_icon.png'

export const GoldCount = () => {
    const { userWallet } = usePlayer();
    const { gameID } = useGame();
    const numberOfResource = useNumberOfResource(userWallet, gameID);

    return (
        <div className="col-3 mine-progress-bar-col">
            <Tooltip label='Diomand' placement='bottom' >
                <img className='me-2' src={stoneIcon} width={"25px"} height={"10px"} alt="food-icon" />
            </Tooltip>
            : {numberOfResource ? Number(numberOfResource.numOfGold) : 0}
        </div>
    )
}