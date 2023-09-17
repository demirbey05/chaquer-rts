import "../../../styles/globals.css"
import { FoodCount } from "../MineProgressBar/FoodCount";
import { WoodCount } from "../MineProgressBar/WoodCount";
import { GoldCount } from '../MineProgressBar/GoldCount';

export const MineProgressBar = () => {
    return (
        <div className="mine-progress-bar">
            <div className="row">
                <FoodCount />
                <WoodCount />
                <GoldCount />
            </div>
        </div>
    )
}