import { ClassAttributes, ImgHTMLAttributes } from "react"
import { JSX } from "react/jsx-runtime"
import SimpleRoomSvg from "#svgs/SimpleRoom.svg"

const SimpleRoom = (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLImageElement> & ImgHTMLAttributes<HTMLImageElement>) => {
    return (
        <div>
            <img
                src={SimpleRoomSvg}
                // style={{ height: "100%", width: "100%" }}
                alt="SimpleRoomImg"
                {...props}
            />
        </div>
    )
}

export default SimpleRoom