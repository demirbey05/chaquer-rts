function CastleWarning() {
  return (
    <>
      <div
          style={{
            position: "absolute",
            zIndex: "1",
            color: "white",
            left: "0",
            right: "0",
            top: "0",
            margin: "125px auto",
            width: "600px",
          }}
        >
          <h2 className="text-center text-3xl text-white mb-2 border-top border-bottom font-bold">
            Please settle your castle
          </h2>
        </div>
    </>
  )
}

export default CastleWarning
