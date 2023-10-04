import { Progress } from "@chakra-ui/react";

export const DataFetchProgress = ({ progress }: any) => {
    return (
        <div className="loader-box">
            <div className="d-flex justify-content-center pt-3">
                <Progress colorScheme="linkedin"
                    borderRadius={"25px"}
                    width={"75%"}
                    height='32px'
                    hasStripe
                    isAnimated
                    value={progress ? progress.percentage * 100 : 0} />
            </div>
            <div className="text-center p-3">
                <p className="text-white text-2xl">{progress ? (progress.percentage !== 100 ? progress.percentage * 100 : 100) : 0}%</p>
                <p className="text-white text-xl">{progress ? progress.message : "Fetching data from blockchain"}...</p>
            </div>
        </div>
    )
}