import { useMUD } from "../context/MUDContext";
import { useEffect, useState } from "react";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { Has, getComponentValueStrict } from "@latticexyz/recs";

export function useChatMessages(maxElementSize: number) {
    const { components } = useMUD();

    const chatEntity = useEntityQuery([Has(components.ChatMessages)]);
    const value = useObservableValue(components.ChatMessages.update$);

    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        const newMessages = chatEntity.map((entityIndex) => {
            const newMessage = getComponentValueStrict(components.ChatMessages, entityIndex);
            return newMessage;
        });

        const limitedMessages = newMessages.slice(-maxElementSize);

        setMessages(limitedMessages);
    }, [chatEntity, value]);

    return messages;
}
