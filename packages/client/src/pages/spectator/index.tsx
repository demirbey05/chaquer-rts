import { useState } from "react";
import { SettingsDrawer } from "../../components/SettingsComp/SettingsDrawer";
import { PlayerListDrawer } from "../../components/PlayerComp/PlayerListDrawer";
import { ZoomHandler } from "../../components/ZoomComp/ZoomHandler";
import { Terrain } from "../../components/TerrainComp/Terrain";
import { PriceListDrawer } from "../../components/PriceComp/PriceListDrawer";
import { ChatMessageDrawer } from "../../components/ChatComp/ChatMessageDrawer";

export const Spectator = () => {
    const [zoomLevel, setZoomLevel] = useState(1);
    return (
        <>
            <SettingsDrawer isInputFocused={true} />
            <PlayerListDrawer isInputFocused={true} isSpectator={true} />
            <PriceListDrawer isInputFocused={true} isSpectator={true} />
            <ChatMessageDrawer isInputFocused={true} isSpectator={true} />
            <ZoomHandler isInputFocused={true} zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
            <Terrain isBorder={true} zoomLevel={zoomLevel} fontSize={20} tileSize={40} isSpectator={true} />
        </>
    )
}