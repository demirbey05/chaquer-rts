import { useState } from "react";
import { SettingsDrawer } from "../../components/SettingsComp/SettingsDrawer";
import { PlayerListDrawer } from "../../components/PlayerComp/PlayerListDrawer";
import { ZoomHandler } from "../../components/ZoomComp/ZoomHandler";
import { Terrain } from "../../components/TerrainComp/Terrain";
import { PriceListDrawer } from "../../components/PriceComp/PriceListDrawer";

export const Spectator = () => {
    const [zoomLevel, setZoomLevel] = useState(1);
    return (
        <>
            <SettingsDrawer />
            <PlayerListDrawer />
            <PriceListDrawer />
            <ZoomHandler zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
            <Terrain isBorder={true} zoomLevel={zoomLevel} fontSize={20} tileSize={40} isSpectator={true} />
        </>
    )
}