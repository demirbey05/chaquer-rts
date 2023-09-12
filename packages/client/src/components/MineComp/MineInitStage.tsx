import { Progress, Tooltip } from '@chakra-ui/react'
import { useMUD } from '../../context/MUDContext';
import { useError } from '../../context/ErrorContext';
import { useIsMineInitialized } from '../../hooks/ResourceHooks/useIsMineInitialized';

export const MineInitStage = () => {
    const { systemCalls } = useMUD();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();

    const isMineInited = useIsMineInitialized(1)

    const InitResources = async () => {
        if (!isMineInited) {
            const tx = await systemCalls.resourceSystemInit(1);
            if (tx == null) {
                setErrorMessage("An error occurred while initializing the mines.")
                setErrorTitle("Mine Initialize Error")
                setShowError(true)
                return
            }
        }
    }

    return (
        <div id="overlay" className="waiting-for-players-fade-overlay">
            <div className="waiting-for-players-message-container">
                {
                    !isMineInited &&
                    <>
                        <Tooltip placement='top' hasArrow label='Click button to initalize resources on map!' bg='blue.600'>
                            <button onClick={() => InitResources()}
                                className="waiting-for-players-info-message btn btn-outline-light">
                                Initialize Resources
                            </button>
                        </Tooltip>
                        <Progress size='sm' colorScheme={"whatsapp"} isIndeterminate />
                    </>
                }
            </div>
        </div >
    )
}
