import { useState, useEffect, useRef } from 'react';
import { useMUD } from '../../context/MUDContext';
import { BsFillChatDotsFill } from 'react-icons/bs'
import { AiOutlineSend } from 'react-icons/ai'
import { useChatMessages } from "../../hooks/useChatMessages"

export const ChatMessageDrawer = ({ isInputFocused, setIsInputFocused }: { isInputFocused: boolean, setIsInputFocused: (value: boolean) => void }) => {
    const { systemCalls } = useMUD();
    const messages = useChatMessages(25);

    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState<string>("");

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
            const tx = await systemCalls.sendMessage(1, message);
            if (tx) {
                document.getElementById("message-input")!.value = "";
                setMessage("");
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
            <button className="chat-button" onClick={toggleOffcanvas}>
                <BsFillChatDotsFill />
            </button>
            <div id="chatDrawer" className={`chat-drawer ${isOpen ? "open" : ""}`}>
                <h4 className="text-center p-2 mb-2 border-bottom">Chat</h4>
                <div className='row'>
                    <div className='chat-body' ref={chatBodyRef}>
                        {
                            messages && messages.map((data, key) => {
                                return <Message username={data.userName} message={data.message} key={key} />
                            })
                        }
                    </div>
                </div>
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
                        disabled={message.length === 0}
                        onClick={handleSend}>
                        <AiOutlineSend />
                    </button>
                </div>
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