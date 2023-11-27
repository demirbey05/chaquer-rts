import { FoodCount } from "../MineProgressBar/FoodCount";
import { WoodCount } from "../MineProgressBar/WoodCount";
import { GoldCount } from '../MineProgressBar/GoldCount';

export const MineProgressBar = () => {
    return (
        <div className="mine-progress-bar">
            <FoodCount />
            <WoodCount />
            <GoldCount />
        </div>
    )
}
