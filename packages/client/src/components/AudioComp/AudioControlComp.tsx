import { useState, useEffect } from 'react'
import soundTrack from '../../sounds/chaquerSoundTrack.mp3'
import { Button } from "@chakra-ui/react";
import { SettingsIcon } from '@chakra-ui/icons'
import { FaPlay, FaStop } from 'react-icons/fa'

function AudioControlComp() {
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        setIsPlaying(true); // Start playing the audio when the component mounts
        return () => {
            setIsPlaying(false); // Stop playing the audio when the component unmounts
        };
    }, []);

    const handlePlay = () => {
        setIsPlaying(true);
    };

    const handleStop = () => {
        setIsPlaying(false);
    };

    return (
        <div>
            <Button style={{
                zIndex: 1,
                height: "60px",
                width: "60px",
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                marginTop: "25px",
                fontSize: "30px"
            }} type="button" colorScheme="yellow" data-bs-toggle="offcanvas" data-bs-target="#audioControlModal" aria-controls="staticBackdrop">
                <SettingsIcon />
            </Button>

            <div style={{ height: "120px", width: "160px", marginTop: "25px", padding: "5px" }} className="offcanvas offcanvas-start" data-bs-keyboard="false" data-bs-backdrop="false" id="audioControlModal" aria-labelledby="staticBackdropLabel">
                <div className="offcanvas-header" style={{ height: "40px" }}>
                    <h5 className="offcanvas-title" id="staticBackdropLabel">Audio Control</h5>
                    <button type="button" data-bs-dismiss="offcanvas" aria-label="Close">&#10008;</button>
                </div>
                <hr></hr>
                <div className="offcanvas-body" style={{ overflow: "hidden" }}>
                    <Button colorScheme='whatsapp' variant='outline' style={{ height: "40px", marginRight: "10px" }} onClick={handlePlay} data-bs-dismiss="offcanvas" aria-label="Close"><FaPlay /></Button>
                    <Button colorScheme='red' variant='outline' style={{ height: "40px" }} onClick={handleStop} data-bs-dismiss="offcanvas" aria-label="Close"><FaStop /></Button>
                </div>
            </div>
            {isPlaying && <audio src={soundTrack} autoPlay />}
        </div >
    );
}

export default AudioControlComp
