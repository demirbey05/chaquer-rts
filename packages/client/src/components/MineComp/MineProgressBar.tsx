import "../../styles/globals.css";
import { usePlayer } from '../../context/PlayerContext';
import { useNumberOfResource } from '../../hooks/ResourceHooks/useNumberOfResource';

export const MineProgressBar = () => {
    const { userWallet } = usePlayer();

    const numberOfResource = useNumberOfResource(userWallet, 1);

    return (
        <div className="mine-progress-bar">
            <div className="row">
                <div className="col-4 mine-progress-bar-col">
                    🌽: {numberOfResource ? Number(numberOfResource.numOfFood) : 300}
                </div>
                <div className="col-4 mine-progress-bar-col">
                    🪓: {numberOfResource ? Number(numberOfResource.numOfWood) : 100}
                </div>
                <div className="col-4 mine-progress-bar-col">
                    ⛏️: {numberOfResource ? Number(numberOfResource.numOfGold) : 300}
                </div>
            </div>
        </div>
    )
}