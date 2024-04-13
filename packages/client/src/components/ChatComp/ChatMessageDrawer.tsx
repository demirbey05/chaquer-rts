import badWordsData from "../../../badWords.json";
import { Tooltip, Text } from "@chakra-ui/react";
import { useState, useEffect, useRef } from 'react';
import { useMUD } from '../../context/MUDContext';
import { useError } from '../../context/ErrorContext';
import { useGame } from "../../context/GameContext";
import { BsFillChatDotsFill } from 'react-icons/bs'
import { AiOutlineSend } from 'react-icons/ai'
import { useChatMessages } from "../../hooks/useChatMessages"

const badWordsList = badWordsData.badWords;

function censorMessage(inputMessage: string, badWordsList: string[]) {
    let censoredMessage = inputMessage;
    for (const badWord of badWordsList) {
        const regex = new RegExp(badWord, 'gi');
        censoredMessage = censoredMessage.replace(regex, '****');
    }
    return censoredMessage;
}

export const ChatMessageDrawer = ({ isSpectator }: { isSpectator: boolean }) => {
    const { systemCalls } = useMUD();
    const { setErrorMessage, setErrorTitle, setShowError } = useError();
    const { gameID, isInputFocused, setIsInputFocused } = useGame();
    const messages = useChatMessages(25, gameID);

    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState<string>("");
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const chatBodyRef = useRef<HTMLDivElement | null>(null);

    const toggleOffcanvas = () => {
        setIsOpen(!isOpen);
    };

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'c' || event.key === 'C') {
            toggleOffcanvas();
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

    useEffect(() => {
        if (inputRef.current) {
            const handleFocus = () => {
                setIsInputFocused(true);
            };

            const handleBlur = () => {
                setIsInputFocused(false);
            };

            inputRef.current.addEventListener('focus', handleFocus);
            inputRef.current.addEventListener('blur', handleBlur);

            return () => {
                inputRef.current?.removeEventListener('focus', handleFocus);
                inputRef.current?.removeEventListener('blur', handleBlur);
            };
        }
    }, []);

    const handleSend = async () => {
        if (message && message.length <= 32 && message.length > 0) {
            setIsButtonDisabled(true);

            const censoredMessage = censorMessage(message, badWordsList);

            const tx = await systemCalls.sendMessage(gameID, censoredMessage);
            if (tx) {
                document.getElementById("message-input")!.value = "";
                setMessage("");
                setTimeout(() => {
                    setIsButtonDisabled(false);
                }, 30000);

                var isTask = localStorage.getItem("helloTask")
                !isTask && localStorage.setItem("helloTask", "new value");
                window.dispatchEvent(new Event('localDataStorage'));
            } else {
                setErrorMessage("An error occurred while sending a message.");
                setErrorTitle("Message Error");
                setShowError(true);
            }
        }
    }

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <>
            <Tooltip label='Chat' placement='top'>
                <button
                    className="chat-button"
                    style={isSpectator ? { marginTop: "155px" } : {}}
                    onClick={toggleOffcanvas}>
                    <BsFillChatDotsFill />
                </button>
            </Tooltip>
            <div id="chatDrawer" className={`chat-drawer ${isOpen ? "open" : ""}`} style={isSpectator ? { marginTop: "225px" } : {}}>
                <div className="d-flex justify-between border-bottom mb-1 p-2">
                    <Text fontSize={"20px"}>Chat</Text>
                    <button className="me-3" type="button" onClick={toggleOffcanvas}>&#10008;</button>
                </div>
                <div className='row'>
                    <div className='chat-body' ref={chatBodyRef}>
                        {
                            messages && messages.map((data, key) => {
                                return <Message username={data.userName} message={data.message} key={key} />
                            })
                        }
                    </div>
                </div>
                {
                    !isSpectator &&
                    <div className='d-flex justify-content-center align-items-center'>
                        <input type="text"
                            id="message-input"
                            className="form-control-sm border bg-transparent dark-input text-white w-75"
                            placeholder="Type your message..."
                            onChange={(e) => setMessage(e.target.value)}
                            maxLength={32}
                            ref={inputRef} />
                        <button
                            className='btn btn-outline-light btn-sm text-2xl ms-3'
                            disabled={message.length === 0 || isButtonDisabled}
                            onClick={handleSend}>
                            <AiOutlineSend />
                        </button>
                    </div>
                }
            </div>
        </>
    )
}

interface MessagePropTypes {
    username: string,
    message: string
}

const Message = (props: MessagePropTypes) => {
    return (
        <p className='mb-2 ps-3 pe-3'>
            <span className="text-info font-bold me-2">
                {props.username && props.username}:
            </span>
            <span>
                {props.message && props.message}
            </span>
        </p>
    )
}