import { useObservableValue } from "@latticexyz/react";
import { useMUD } from "../context/MUDContext";
import { useEffect, useState } from "react";

export function useChatMessages(maxElementSize: number) {
    const { components } = useMUD()

    const message = useObservableValue(components.ChatMessages.update$);

    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        if (message) {
            setMessages((prevResults) => [
                ...prevResults.slice(-maxElementSize + 1),
                message?.value[0]
            ]);
        }
    }, [message])

    return messages;
}