import { ClassAttributes, ImgHTMLAttributes } from "react";
import { JSX } from "react/jsx-runtime";
import SimpleRoomSvg from "#svgs/Room.png";
import SelectedSimpleRoomSvg from "#svgs/SelectedSimpleRoom.svg";

export default function SimpleRoom({
  available,
  selected,
  props,
}: {
  available: boolean;
  selected: boolean;
  props: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLImageElement> &
    ImgHTMLAttributes<HTMLImageElement>;
}) {
  const style = { width: "100%", border: selected ? '3px solid red' : undefined };
  if (available) {
    return (
      <div {...props}>
        <img
          src={SelectedSimpleRoomSvg}
          alt="SelectedSimpleRoomImg"
          style={style}
        />
      </div>
    );
  } else {
    return (
      <div {...props}>
        <img src={SimpleRoomSvg} alt="SimpleRoomImg" style={style} />
      </div>
    );
  }
}
