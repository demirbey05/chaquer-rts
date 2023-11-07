import { useGame } from '../../../context/GameContext';
import { usePlayer } from '../../../context/PlayerContext';
import { useNumberOfResource } from '../../../hooks/ResourceHooks/useNumberOfResource';
import woodIcon from '../../../images/resourceAssets/wood_icon.png'

export const WoodCount = () => {
    const { userWallet } = usePlayer();
    const { gameID } = useGame();
    const numberOfResource = useNumberOfResource(userWallet, gameID);

    return (
        <div className="col-3 mine-progress-bar-col">
            <img className='me-2' src={woodIcon} width={"25px"} height={"10px"} alt="food-icon" />: {numberOfResource ? Number(numberOfResource.numOfWood) : 0}
        </div>
    )
}