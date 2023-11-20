import { useEffect } from 'react';

export const ZoomHandler = ({ isInputFocused, zoomLevel, setZoomLevel }:
    { isInputFocused: boolean, zoomLevel: number, setZoomLevel: (value: number) => void }) => {
    const handleZoomIn = () => {
        if (zoomLevel < 2.5) {
            setZoomLevel(zoomLevel + 0.1);
        }
    };

    const handleZoomOut = () => {
        if (zoomLevel > 0.5) {
            setZoomLevel(zoomLevel - 0.1);
        }
    };

    const handleWheel = (event: WheelEvent) => {
        if (!isInputFocused) {
            if (event.deltaY < 0) {
                handleZoomIn();
            } else {
                handleZoomOut();
            }
            event.preventDefault();
        }
    };

    useEffect(() => {
        if (!isInputFocused) {
            window.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, [zoomLevel, isInputFocused]);

    return <></>
};
