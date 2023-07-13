export const ArmyMoveWarning = () => {

    const armyWarningDivStyles: any = {
        position: "absolute",
        zIndex: "1",
        color: "white",
        left: "0",
        right: "0",
        bottom: "0",
        margin: "50px auto",
        width: "600px",
    }

    return (
        <div style={armyWarningDivStyles}>
            <h2 className="text-center text-3xl text-white mb-2 border-top border-bottom font-bold">
                Click blue tiles to move your army
            </h2>
        </div>
    )
}