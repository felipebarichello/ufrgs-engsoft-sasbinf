import { ClassAttributes, ImgHTMLAttributes } from "react"
import { JSX } from "react/jsx-runtime"
import SimpleRoomSvg from "#svgs/SimpleRoom.svg"
import SelectedSimpleRoomSvg from "#svgs/SelectedSimpleRoom.svg"

export default function SimpleRoom(
    {
        selected, props
    }: {
        selected: boolean,
        props: JSX.IntrinsicAttributes & ClassAttributes<HTMLImageElement> & ImgHTMLAttributes<HTMLImageElement>
    }
) {
    if (selected) {
        return (
            <div {...props}>
                <img
                    src={SelectedSimpleRoomSvg}
                    alt="SelectedSimpleRoomImg"
                    style={{ width: "100%" }}
                />
            </div>
        )
    } else {
        return (
            <div {...props}>
                <img
                    src={SimpleRoomSvg}
                    alt="SimpleRoomImg"
                    style={{ width: "100%" }}
                />
            </div>
        )
    }
}
