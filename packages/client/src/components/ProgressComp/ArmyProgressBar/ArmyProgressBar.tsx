import { ArmyProgress } from './ArmyProgress';
import { FleetProgress } from './FleetProgress';

export const ArmyProgressBar = () => {
    return (
        <div className="army-progress-bar">
            <ArmyProgress />
            <FleetProgress />
        </div>
    )
}