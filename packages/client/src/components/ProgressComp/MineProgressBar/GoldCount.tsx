import { useGame } from '../../../context/GameContext';
import { usePlayer } from '../../../context/PlayerContext';
import { useNumberOfResource } from '../../../hooks/ResourceHooks/useNumberOfResource';

export const GoldCount = () => {
    const { userWallet } = usePlayer();
    const { gameID } = useGame();
    const numberOfResource = useNumberOfResource(userWallet, gameID);

    return (
        <div className="col-4 mine-progress-bar-col">
            ⛏️: {numberOfResource ? Number(numberOfResource.numOfGold) : 300}
        </div>
    )
}