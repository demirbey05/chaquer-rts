import { useEffect } from 'react';
import { AiOutlineZoomIn, AiOutlineZoomOut } from 'react-icons/ai';

export const ZoomHandler = ({ isInputFocused, zoomLevel, setZoomLevel }:
    { isInputFocused: boolean, zoomLevel: number, setZoomLevel: (value: number) => void }) => {
    const handleZoomIn = () => {
        if (zoomLevel < 1.3) {
            setZoomLevel(zoomLevel + 0.1);
        }
    };

    const handleZoomOut = () => {
        if (zoomLevel > 0.5) {
            setZoomLevel(zoomLevel - 0.1);
        }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'ı' || event.key === 'I') {
            handleZoomIn();
        } else if (event.key === 'o' || event.key === 'O') {
            handleZoomOut();
        }
    };

    useEffect(() => {
        if (!isInputFocused) {
            window.addEventListener('keydown', handleKeyPress);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [zoomLevel, isInputFocused]);

    return (
        <>
            <button className="zoom-in-button" onClick={handleZoomIn}>
                <AiOutlineZoomIn />
            </button>
            <button className="zoom-out-button" onClick={handleZoomOut}>
                <AiOutlineZoomOut />
            </button>
        </>
    );
};
