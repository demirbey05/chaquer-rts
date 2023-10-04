import { Route, Redirect } from 'react-router-dom'
import { useGame } from '../context/GameContext';
import { useSyncProgress } from '../hooks/useSyncProgress';

export const ProtectedRoutes = ({ isUserValid, component: Component, ...rest }: any) => {
    const progress = useSyncProgress();
    const { gameID } = useGame();

    return (
        <Route {...rest} render={(props) => {

            if (progress && progress.percentage !== 100) {
                return <Redirect to={{ pathname: "/" }} ></Redirect>;
            }

            if (gameID === 0) {
                return <Redirect to={{ pathname: "/" }} ></Redirect>;
            }

            if (isUserValid === true || isUserValid === false) {
                return <Component {...props}></Component>;
            }

            return <Redirect to={{ pathname: "/" }} ></Redirect>;
        }} />
    )
}