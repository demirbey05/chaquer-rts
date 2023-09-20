import React, { useEffect } from 'react';
import { AiOutlineZoomIn, AiOutlineZoomOut } from 'react-icons/ai';

export const ZoomHandler = ({ zoomLevel, setZoomLevel }: { zoomLevel: number, setZoomLevel: React.Dispatch<React.SetStateAction<number>> }) => {
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
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [zoomLevel]);

    return (
        <>
            <button className="zoom-buttons" style={{ right: "45%" }} onClick={handleZoomIn}><AiOutlineZoomIn /></button>
            <button className="zoom-buttons" style={{ left: "45%" }} onClick={handleZoomOut}><AiOutlineZoomOut /></button>
        </>
    );
};
