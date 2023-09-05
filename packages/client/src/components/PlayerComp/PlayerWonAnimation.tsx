import '../../styles/globals.css';
import winnerAnimation from '../../images/gifs/winner_animation.gif';

export const PlayerWonAnimation = () => {
    return (
        <div className='winnerModal'>
            <div className='winnerModal-content'>
                <img src={winnerAnimation} alt="winner_animation" width={"768px"} />
            </div>
        </div>
    )
}