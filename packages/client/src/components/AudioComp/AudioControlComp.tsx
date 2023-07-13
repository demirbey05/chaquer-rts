import soundTrack from '../../sounds/chaquerSoundTrack.mp3'
import { useState, useEffect, useRef } from 'react'
import { Button } from "@chakra-ui/react";
import { SettingsIcon } from '@chakra-ui/icons'
import { FaPlay, FaStop } from 'react-icons/fa'

export const AudioControlComp = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<any>();

    useEffect(() => {
        const audioElement = audioRef.current;

        const handleEnded = () => {
            if (audioElement) {
                audioElement.currentTime = 0; // Reset the playback to the beginning
                audioElement.play(); // Start playing again
            }
        };

        if (audioElement) {
            audioElement.addEventListener('ended', handleEnded);
            audioElement.play(); // Start playing initially
        }

        // Clean up the event listener on component unmount
        return () => {
            if (audioElement) {
                audioElement.removeEventListener('ended', handleEnded);
            }
        };
    }, []);

    const handlePlay = () => {
        setIsPlaying(false);
    };

    const handleStop = () => {
        setIsPlaying(true);
    };

    const audioOffCanvasButtonStyle: any = {
        zIndex: 1,
        height: "60px",
        width: "60px",
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        marginTop: "25px",
        fontSize: "30px"
    }

    const audioOffcanvasDivStyle: any = {
        height: "120px",
        width: "160px",
        marginTop: "25px",
        padding: "5px"
    }

    return (
        <div>
            <Button style={audioOffCanvasButtonStyle} type="button" colorScheme="yellow" data-bs-toggle="offcanvas" data-bs-target="#audioControlModal" aria-controls="staticBackdrop">
                <SettingsIcon />
            </Button>

            <div style={audioOffcanvasDivStyle} className="offcanvas offcanvas-start" data-bs-keyboard="false" data-bs-backdrop="false" id="audioControlModal" aria-labelledby="staticBackdropLabel">
                <div className="offcanvas-header" style={{ height: "40px" }}>
                    <AudioControlCompHeader />
                </div>
                <hr></hr>
                <div className="offcanvas-body" style={{ overflow: "hidden" }}>
                    <Button colorScheme='whatsapp' variant='outline' style={{ height: "40px", marginRight: "10px" }} onClick={handlePlay} data-bs-dismiss="offcanvas" aria-label="Close"><FaPlay /></Button>
                    <Button colorScheme='red' variant='outline' style={{ height: "40px" }} onClick={handleStop} data-bs-dismiss="offcanvas" aria-label="Close"><FaStop /></Button>
                </div>
            </div>
            <audio ref={audioRef} autoPlay muted={isPlaying} >
                <source src={soundTrack} type="audio/mp3" />
            </audio>
        </div >
    );
}

const AudioControlCompHeader = () => {
    return (
        <>
            <h5 className="offcanvas-title" id="staticBackdropLabel">Audio Control</h5>
            <button type="button" data-bs-dismiss="offcanvas" aria-label="Close">&#10008;</button>
        </>
    )
}