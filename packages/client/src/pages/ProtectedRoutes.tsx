import { Route, Redirect } from 'react-router-dom'
import { usePlayer } from '../context/PlayerContext';
import { useNumberOfUsers } from '../hooks/IdentityHooks/useNumberOfUsers';
import { usePlayerIsValid } from '../hooks/IdentityHooks/usePlayerIsValid';
import { limitOfUser } from '../utils/constants/constants';
import { useSyncProgress } from '../hooks/useSyncProgress';

export const ProtectedRoutes = ({ component: Component, ...rest }: any) => {
    const { userWallet } = usePlayer();
    const userValid = usePlayerIsValid(1, userWallet);
    const numberOfPlayers = useNumberOfUsers(1);
    const progress = useSyncProgress();

    return (
        <Route {...rest} render={(props) => {

            if (progress && progress.percentage !== 100) {
                return <Redirect to={{ pathname: "/" }} ></Redirect>;
            }

            if (!(!userValid && numberOfPlayers === limitOfUser)) {
                return <Component {...props}></Component>;
            }

            return <Redirect to={{ pathname: "/" }} ></Redirect>;
        }} />
    )
}