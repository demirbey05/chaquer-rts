import { usePlayer } from '../../context/PlayerContext';
import { useScoreTable } from '../../hooks/useScoreTable'

function WarResultComp() {
    const warResults = useScoreTable(5);
    const { userWallet } = usePlayer();

    return (
        <div className="war-result-bar">
            <h4 className='text-white text-center mt-2 mb-2 border-bottom-1'>War Results</h4>
            {warResults && warResults.data.map((data, key) => {
                if (data?.isDraw === true) {
                    return <p className='text-white p-2 bg-primary' key={key}>No body has won the war. Draw!</p>
                }
                else if (data?.winner === userWallet?.address.toLocaleLowerCase()) {
                    return <p className='text-white p-2 bg-success' key={key}>You have won the war. Win!</p>
                }
                else if (data?.loser === userWallet?.address.toLocaleLowerCase()) {
                    return <p className='text-white p-2 bg-danger' key={key}>You have lost the war. Lose!</p>
                }
                return null;
            })}
        </div>
    )
}

export default WarResultComp