import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { useSyncProgress } from '../../hooks/useSyncProgress';
import { useGameData } from '../../hooks/useGameData';

export const ProtectedSpectator = ({ username }: { username: string }) => {
    const { gameID } = useGame();
    const progress = useSyncProgress();
    const gameData = useGameData(gameID)

    if (progress && progress.percentage !== 100) {
        return <Navigate to="/" />
    }

    if (gameID <= 0) {
        return <Navigate to="/" />
    }

    if (gameData && (gameData.state === 0 || gameData.state === 1 || gameData.state === 2)) {
        return <Navigate to="/" />
    }

    if (username) {
        return <Outlet />
    } else {
        return <Navigate to="/" />
    }
}