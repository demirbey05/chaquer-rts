import React, { useEffect } from 'react';
import { AiOutlineZoomIn, AiOutlineZoomOut } from 'react-icons/ai';

interface ZoomHandlerPropTypes {
    zoomLevel: number;
    setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
}

export const ZoomHandler = (props: ZoomHandlerPropTypes) => {
    const handleZoomIn = () => {
        if (props.zoomLevel < 1.3) {
            props.setZoomLevel(props.zoomLevel + 0.1);
        }
    };

    const handleZoomOut = () => {
        if (props.zoomLevel > 0.5) {
            props.setZoomLevel(props.zoomLevel - 0.1);
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
    }, [props.zoomLevel]);

    return (
        <>
            <button className="zoom-buttons" style={{ right: "45%" }} onClick={handleZoomIn}><AiOutlineZoomIn /></button>
            <button className="zoom-buttons" style={{ left: "45%" }} onClick={handleZoomOut}><AiOutlineZoomOut /></button>
        </>
    );
};
