import { useState } from "react";
import { SettingsDrawer } from "../../components/SettingsComp/SettingsDrawer";
import { PlayerListDrawer } from "../../components/PlayerComp/PlayerListDrawer";
import { ZoomHandler } from "../../components/ZoomComp/ZoomHandler";
import { Terrain } from "../../components/TerrainComp/Terrain";
import { PriceListDrawer } from "../../components/PriceComp/PriceListDrawer";
import { ChatMessageDrawer } from "../../components/ChatComp/ChatMessageDrawer";
import { VersionInfo } from "../../components/TipsComp/VersionInfo";
import { scrollToCenter } from "../../utils/helperFunctions/CustomFunctions/scrollToCenter";

export const Spectator = () => {
    const [zoomLevel, setZoomLevel] = useState(1);

    scrollToCenter()

    return (
        <>
            <Terrain zoomLevel={zoomLevel} isSpectator={true} />
            <SettingsDrawer isInputFocused={true} />
            <PlayerListDrawer isInputFocused={true} isSpectator={true} />
            <PriceListDrawer isInputFocused={true} isSpectator={true} />
            <ChatMessageDrawer isInputFocused={true} setIsInputFocused={() => true} isSpectator={true} />
            <ZoomHandler isInputFocused={true} zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
            <VersionInfo />
        </>
    )
}