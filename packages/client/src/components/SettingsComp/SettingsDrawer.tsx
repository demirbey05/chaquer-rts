import soundTrack from '../../sounds/chaquerSoundTrack.mp3'
import { useState, useEffect, useRef } from 'react'
import { Button } from "@chakra-ui/react";
import { SettingsIcon } from '@chakra-ui/icons'
import { FaPlay, FaStop } from 'react-icons/fa'
import { RiArrowGoBackFill } from 'react-icons/ri'
import { Link } from 'react-router-dom';

export const SettingsDrawer = ({ isInputFocused }: { isInputFocused: boolean }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
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

    const handlePlay = () => {
        setIsPlaying(false);
    };

    const handleStop = () => {
        setIsPlaying(true);
        if (!localStorage.getItem('audioPaused')) {
            localStorage.setItem('audioPaused', "true")
        }
    };

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 's' || event.key === 'S') {
            toggleDrawer();
        } else if (event.key === 'Escape') {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (!isInputFocused) {
            window.addEventListener('keydown', handleKeyPress);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [isOpen, isInputFocused]);

    return (
        <>
            <button className="settings-button" onClick={toggleDrawer}>
                <SettingsIcon />
            </button>
            <div id="settings-drawer" className={`settings-drawer ${isOpen ? "open" : ""}`}>
                <AudioControlCompHeader toggleDrawer={toggleDrawer} />
                <div className='ms-2'>
                    <h5 className='mb-2'>Music Settings</h5>
                    <PlayMusicButton handlePlay={handlePlay} closeDrawer={toggleDrawer} />
                    <PauseMusicButton handleStop={handleStop} closeDrawer={toggleDrawer} />
                    <hr className='mt-2 mb-2' />
                    <h5 className="mb-2 mt-2">Back to Menu</h5>
                    <BackToMenuButton toggleDrawer={toggleDrawer} />
                </div>
            </div>
            <audio ref={audioRef} autoPlay muted={isPlaying} >
                <source src={soundTrack} type="audio/mp3" />
            </audio>
        </>
    );
}

interface AudioControlCompHeaderPropTypes {
    toggleDrawer: () => void
}

const AudioControlCompHeader = (props: AudioControlCompHeaderPropTypes) => {
    return (
        <div className='d-flex justify-between border-bottom mb-2 p-2'>
            <h5 className="font-extrabold">Settings</h5>
            <button type="button" onClick={props.toggleDrawer}>&#10008;</button>
        </div>
    )
}

interface BackToMenuButtonPropTypes {
    toggleDrawer: () => void
}

const BackToMenuButton = (props: BackToMenuButtonPropTypes) => {
    return (
        <Link to='/'>
            <Button colorScheme='blue'
                variant='outline'
                style={{ height: "40px" }}
                onClick={props.toggleDrawer}
                aria-label="Close">
                Back to Menu
                <RiArrowGoBackFill className='ms-2' />
            </Button>
        </Link>
    )
}

const PlayMusicButton = ({ handlePlay, closeDrawer }: any) => {
    return (
        <Button colorScheme='whatsapp'
            variant='outline'
            style={{ height: "40px", marginRight: "10px" }}
            onClick={() => {
                closeDrawer();
                handlePlay();
            }}
            aria-label="Close">
            Play Music
            <FaPlay className='ms-2' />
        </Button>
    )
}

const PauseMusicButton = ({ handleStop, closeDrawer }: any) => {
    return (
        <Button colorScheme='red'
            variant='outline'
            style={{ height: "40px" }}
            onClick={() => {
                closeDrawer();
                handleStop();
            }}
            aria-label="Close">
            Pause Music
            <FaStop className='ms-2' />
        </Button>
    )
}