import { Progress } from "@chakra-ui/react";
import { useSyncProgress } from "../../hooks/useSyncProgress";

export const DataFetchProgress = () => {
    return (
        <div className="loader-box">
            <div className="d-flex justify-content-center pt-3">
                <ProgressBar />
            </div>
            <div className="d-flex flex-column align-items-center p-3">
                <ProgressInfo />
            </div>
        </div>
    )
}

const ProgressBar = () => {
    const progress = useSyncProgress();
    return (
        <Progress colorScheme="linkedin"
            borderRadius={"25px"}
            width={"75%"}
            height='32px'
            hasStripe
            isAnimated
            value={progress ? progress.percentage * 100 : 0} />
    )
}

const ProgressInfo = () => {
    const progress = useSyncProgress();
    return (
        <>
            <p className="text-white text-2xl">{progress ? (progress.percentage !== 100 ? progress.percentage * 100 : 100) : 0}%</p>
            <p className="text-white text-xl">{progress ? progress.message : "Fetching data from blockchain"}...</p>
        </>
    )
}