import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { useSyncProgress } from '../../hooks/useSyncProgress';

export const ProtectedGame = ({ isUserValid }: { isUserValid: boolean | undefined }) => {
    const { gameID } = useGame();

    const progress = useSyncProgress();

    if (progress && progress.percentage !== 100) {
        return <Navigate to="/" />
    }

    if (gameID <= 0) {
        return <Navigate to="/" />
    }

    if (isUserValid === true || isUserValid === false) {
        return <Outlet />
    } else {
        return <Navigate to="/" />
    }
}