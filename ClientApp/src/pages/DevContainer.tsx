import PointerSvg from '#svgs/Pointer.svg'

export default function DevContainer() {
    return <Pointer roomNumber={200} />
}

function Pointer({ roomNumber }: { roomNumber: number }) {
    if (roomNumber < 200 || roomNumber > 299) { return <>ERROR</> }
    return (
        <div style={{ position: "relative", textAlign: "center", color: "white", }}>
            <img src={PointerSvg} alt="SimpleRoomImg" />
            <div style={{
                position: "absolute",
                top: "35%",
                left: "10%",
            }}><h1>Sala {roomNumber}</h1></div>
        </div>
    )
}

