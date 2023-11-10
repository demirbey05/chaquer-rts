import { useGame } from '../../../context/GameContext';
import { Tooltip } from '@chakra-ui/react';
import { usePlayer } from '../../../context/PlayerContext';
import { useNumberOfResource } from '../../../hooks/ResourceHooks/useNumberOfResource';
import diomandIcon from '../../../images/resourceAssets/diomand_icon.png'

export const GoldCount = () => {
    const { userWallet } = usePlayer();
    const { gameID } = useGame();
    const numberOfResource = useNumberOfResource(userWallet, gameID);

    return (
        <div className="col-3 mine-progress-bar-col">
            <Tooltip label='Diomand' placement='bottom' >
                <img className='me-2' src={diomandIcon} width={"30px"} height={"30px"} alt="food-icon" />
            </Tooltip>
            : {numberOfResource ? Number(numberOfResource.numOfGold) : 0}
        </div>
    )
}