import soundTrack from "../../sounds/soundTracks/chaquer-soundtrack.mp3"
import { useState, useEffect, useRef } from 'react'
import { useGame } from '../../context/GameContext';
import { useNavigate } from 'react-router-dom';
import { IconButton, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Tooltip, Text } from "@chakra-ui/react";
import { FaPlay, FaStop } from 'react-icons/fa'
import { RiArrowGoBackFill } from 'react-icons/ri'
import { FiSettings } from 'react-icons/fi'

export const SettingsDrawer = () => {
    const { isInputFocused } = useGame()

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState<number>(0.05);
    const [isOpen, setIsOpen] = useState(false);

    const audioRef = useRef<any>();

    useEffect(() => {
        const audioElement = audioRef.current;
        audioRef.current.volume = volume;

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
        if (localStorage.getItem('audioPaused') === "true") {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
    }, [])

    const handleVolumeChange = (newValue: number) => {
        setVolume(newValue);
        if (audioRef.current) {
            audioRef.current.volume = newValue;
        }
    };

    const handlePlay = () => {
        setIsPlaying(false);
        localStorage.setItem('audioPaused', "false")
    };

    const handleStop = () => {
        setIsPlaying(true);
        localStorage.setItem('audioPaused', "true")
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
            <Tooltip label='Settings' placement='top'>
                <button className="settings-button" onClick={toggleDrawer}>
                    <FiSettings />
                </button>
            </Tooltip>
            <div id="settings-drawer" className={`settings-drawer ${isOpen ? "open" : ""}`}>
                <AudioControlCompHeader toggleDrawer={toggleDrawer} />
                <div className='ms-2'>
                    <h5 className='mb-2'>Music</h5>
                    <PlayMusicButton handlePlay={handlePlay} />
                    <PauseMusicButton handleStop={handleStop} />
                    <hr className='mt-2 mb-2' />
                    <h5 className='mb-2'>Music Volume</h5>
                    <Slider
                        aria-label='slider-ex-1'
                        step={0.05}
                        defaultValue={volume}
                        min={0}
                        max={0.5}
                        colorScheme='whatsapp'
                        width={"75%"}
                        onChange={handleVolumeChange}>
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                    </Slider>
                    <hr className='mt-2 mb-2' />
                    <h5 className="mb-2 mt-2">Back to Menu</h5>
                    <BackToMenuButton />
                </div>
            </div>
            <audio ref={audioRef} autoPlay muted={isPlaying} >
                <source src={soundTrack} type="audio/mp3" />
            </audio>
        </>
    );
}

const AudioControlCompHeader = ({ toggleDrawer }: { toggleDrawer: () => void }) => {
    return (
        <div className='d-flex justify-between border-bottom mb-2 p-2'>
            <Text fontSize={"20px"}>Settings</Text>
            <button type="button" onClick={toggleDrawer}>&#10008;</button>
        </div>
    )
}

const BackToMenuButton = () => {
    const navigate = useNavigate();
    return (
        <IconButton
            size={"lg"}
            colorScheme='blue'
            variant='outline'
            aria-label="back"
            onClick={() => {
                navigate("/")
            }}
            icon={<RiArrowGoBackFill />}
        />
    )
}

const PlayMusicButton = ({ handlePlay }: any) => {
    return (
        <IconButton
            size={"lg"}
            me={2}
            colorScheme='whatsapp'
            variant='outline'
            aria-label="play"
            onClick={() => {
                handlePlay();
            }}
            icon={<FaPlay />}
        />
    )
}

const PauseMusicButton = ({ handleStop }: any) => {
    return (
        <IconButton
            size={"lg"}
            colorScheme='red'
            variant='outline'
            aria-label="stop"
            onClick={() => {
                handleStop();
            }}
            icon={<FaStop />}
        />
    )
}