import { Route, Redirect } from 'react-router-dom'
import { usePlayer } from '../context/PlayerContext';

export const ProtectedRoutes = ({ component: Component, ...rest }: any) => {
    const { userName } = usePlayer();
    return (
        <Route {...rest} render={(props) => {

            if (userName) {
                return <Component {...props}></Component>;
            }

            return <Redirect to={{ pathname: "/" }} ></Redirect>;
        }} />
    )
}