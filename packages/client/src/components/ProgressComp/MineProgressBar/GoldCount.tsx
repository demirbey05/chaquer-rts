import { usePlayer } from '../../../context/PlayerContext';
import { useNumberOfResource } from '../../../hooks/ResourceHooks/useNumberOfResource';

export const GoldCount = () => {
    const { userWallet } = usePlayer();
    const numberOfResource = useNumberOfResource(userWallet, 1);

    return (
        <div className="col-4 mine-progress-bar-col">
            ⛏️: {numberOfResource ? Number(numberOfResource.numOfGold) : 300}
        </div>
    )
}