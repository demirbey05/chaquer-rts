import { useState, useEffect } from "react";
import { SettingsDrawer } from "../../components/SettingsComp/SettingsDrawer";
import { PlayerListDrawer } from "../../components/PlayerComp/PlayerListDrawer";
import { ZoomHandler } from "../../components/ZoomComp/ZoomHandler";
import { Terrain } from "../../components/TerrainComp/Terrain";
import { PriceListDrawer } from "../../components/PriceComp/PriceListDrawer";
import { ChatMessageDrawer } from "../../components/ChatComp/ChatMessageDrawer";
import { VersionInfo } from "../../components/TipsComp/VersionInfo";

export const Spectator = () => {
    const [zoomLevel, setZoomLevel] = useState(1);

    useEffect(() => {
        const checkAndScroll = () => {
            const targetDiv = document.getElementById("12,12");
            const scrollOptions = {
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            };

            if (targetDiv) {
                targetDiv.scrollIntoView(scrollOptions);
                clearInterval(intervalId);
            }
        };

        const intervalId = setInterval(checkAndScroll, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <>
            <VersionInfo />
            <SettingsDrawer isInputFocused={true} />
            <PlayerListDrawer isInputFocused={true} isSpectator={true} />
            <PriceListDrawer isInputFocused={true} isSpectator={true} />
            <ChatMessageDrawer isInputFocused={true} setIsInputFocused={() => true} isSpectator={true} />
            <ZoomHandler isInputFocused={true} zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
            <Terrain isBorder={true} zoomLevel={zoomLevel} tileSize={40} isSpectator={true} />
        </>
    )
}