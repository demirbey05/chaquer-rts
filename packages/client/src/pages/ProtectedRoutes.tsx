import { Route, Redirect } from 'react-router-dom'
import { usePlayer } from '../context/PlayerContext';
import { useNumberOfUsers } from '../hooks/useNumberOfUsers';
import { usePlayerIsValid } from '../hooks/usePlayerIsValid';
import { limitOfUser } from '../utils/constants/constants';

export const ProtectedRoutes = ({ component: Component, ...rest }: any) => {
    const { userWallet } = usePlayer();
    const userValid = usePlayerIsValid(1, userWallet);
    const numberOfPlayers = useNumberOfUsers(1);
    return (
        <Route {...rest} render={(props) => {

            if (!(!userValid && numberOfPlayers === limitOfUser)) {
                return <Component {...props}></Component>;
            }

            return <Redirect to={{ pathname: "/" }} ></Redirect>;
        }} />
    )
}