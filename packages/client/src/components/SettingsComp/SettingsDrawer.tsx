import soundTrack from '../../sounds/chaquerSoundTrack.mp3'
import { useState, useEffect, useRef } from 'react'
import { Button } from "@chakra-ui/react";
import { SettingsIcon } from '@chakra-ui/icons'
import { FaPlay, FaStop } from 'react-icons/fa'
import { RiArrowGoBackFill } from 'react-icons/ri'
import { Link } from 'react-router-dom';

export const SettingsDrawer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<any>();

    useEffect(() => {
        const audioElement = audioRef.current;

        const handleEnded = () => {
            if (audioElement) {
                audioElement.currentTime = 0;
                audioElement.play();
            }
        };

        if (audioElement) {
            audioElement.addEventListener('ended', handleEnded);
            audioElement.play();
        }

        return () => {
            if (audioElement) {
                audioElement.removeEventListener('ended', handleEnded);
            }
        };
    }, []);

    useEffect(() => {
        if (localStorage.getItem('audioPaused')) {
            setIsPlaying(true);
        }
    }, [])

    useEffect(() => {
        const handleKeyPress = (event: any) => {
            if (event.key === 's' || event.key === 'S') {
                const offcanvasElement = document.getElementById('settingsDrawer');
                if (offcanvasElement && !offcanvasElement.classList.contains("show")) {
                    offcanvasElement.classList.add('show');
                }
                else if (offcanvasElement) {
                    offcanvasElement.classList.remove('show');
                }
            } else if (event.key === 'Escape') {
                const offcanvasElement = document.getElementById('settingsDrawer');
                if (offcanvasElement) {
                    offcanvasElement.classList.remove('show');
                }
            }
        };
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    const handlePlay = () => {
        setIsPlaying(false);
    };

    const handleStop = () => {
        setIsPlaying(true);
        if (!localStorage.getItem('audioPaused')) {
            localStorage.setItem('audioPaused', "true")
        }
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
        height: "300px",
        width: "400px",
        marginTop: "25px",
        padding: "5px"
    }

    return (
        <div>
            <Button style={audioOffCanvasButtonStyle}
                type="button"
                colorScheme="yellow"
                data-bs-toggle="offcanvas"
                data-bs-target="#settingsDrawer"
                aria-controls="staticBackdrop">
                <SettingsIcon />
            </Button>

            <div style={audioOffcanvasDivStyle}
                className="offcanvas offcanvas-start"
                data-bs-keyboard="false"
                data-bs-backdrop="false"
                id="settingsDrawer"
                aria-labelledby="settingsDrawerLabel">
                <div className="offcanvas-header">
                    <AudioControlCompHeader />
                </div>
                <hr />
                <div className="offcanvas-body">
                    <h5 className="offcanvas-title mb-2" id="settingsDrawerLabel">Music Settings</h5>
                    <PlayMusicButton handlePlay={handlePlay} />
                    <PauseMusicButton handleStop={handleStop} />
                    <hr className='mt-4' />
                    <h5 className="offcanvas-title mb-2 mt-2" id="settingsDrawerLabel2">Back to Menu</h5>
                    <BackToMenuButton />
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
            <h5 className="offcanvas-title font-extrabold" id="staticBackdropLabel">Settings</h5>
            <button type="button" data-bs-dismiss="offcanvas" aria-label="Close">&#10008;</button>
        </>
    )
}

const BackToMenuButton = () => {
    return (
        <Link to='/'>
            <Button colorScheme='blue'
                variant='outline'
                style={{ height: "40px" }}
                data-bs-dismiss="offcanvas"
                aria-label="Close">
                Back to Menu
                <RiArrowGoBackFill className='ms-2' />
            </Button>
        </Link>
    )
}

const PlayMusicButton = ({ handlePlay }: any) => {
    return (
        <Button colorScheme='whatsapp'
            variant='outline'
            style={{ height: "40px", marginRight: "10px" }}
            onClick={handlePlay}
            data-bs-dismiss="offcanvas"
            aria-label="Close">
            Play Music
            <FaPlay className='ms-2' />
        </Button>
    )
}

const PauseMusicButton = ({ handleStop }: any) => {
    return (
        <Button colorScheme='red'
            variant='outline'
            style={{ height: "40px" }}
            onClick={handleStop}
            data-bs-dismiss="offcanvas"
            aria-label="Close">
            Pause Music
            <FaStop className='ms-2' />
        </Button>
    )
}