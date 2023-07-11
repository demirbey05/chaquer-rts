import { useScoreTable } from '../../hooks/useScoreTable'

function WarResultComp() {
    const warResults = useScoreTable(5);

    return (
        <div className="war-result-bar">

        </div>
    )
}

export default WarResultComp