export const LoserWarning = () => {
    const loserWarningDivStyles: any = {
        position: "absolute",
        zIndex: "1",
        color: "white",
        left: "0",
        right: "0",
        top: "0",
        margin: "125px auto",
        width: "600px",
    }
    return (
        <div style={loserWarningDivStyles}>
            <h2 className="text-center text-3xl text-white mb-2 border-top border-bottom font-bold">
                Your castle has been captured by other players. You are spectator.
            </h2>
        </div>
    )
}