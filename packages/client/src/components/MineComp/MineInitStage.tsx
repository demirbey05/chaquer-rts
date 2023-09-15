import { Tooltip, CircularProgress } from '@chakra-ui/react'
import { useMUD } from '../../context/MUDContext';
import { useError } from '../../context/ErrorContext';
import { useIsMineInitialized } from '../../hooks/ResourceHooks/useIsMineInitialized';
import { useState } from 'react';

export const MineInitStage = () => {
    const { systemCalls } = useMUD();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isMineInited = useIsMineInitialized(1)

    const InitResources = async () => {
        if (!isMineInited) {
            setIsLoading(true)
            const tx = await systemCalls.resourceSystemInit(1);
            if (tx == null) {
                setErrorMessage("An error occurred while initializing the mines.")
                setErrorTitle("Mine Initialize Error")
                setShowError(true)
                setIsLoading(false)
                return
            }
        }
        setIsLoading(false)
    }

    return (
        <div id="overlay" className="waiting-for-players-fade-overlay">
            <div className="waiting-for-players-message-container d-flex align-items-center justify-center">
                {
                    !isMineInited &&
                    <div>
                        <Tooltip placement='top' hasArrow label='Click button to initalize resources on map!' bg='blue.600'>
                            <button disabled={isLoading} onClick={() => InitResources()}
                                className="waiting-for-players-info-message btn btn-outline-light">
                                Initialize Resources
                            </button>
                        </Tooltip>
                        {isLoading && <div className='text-center mt-4'><CircularProgress isIndeterminate color='green.300' /></div>}
                    </div>
                }

            </div>
        </div >
    )
}
