import Pointer from "#svgs/Pointer.svg";
import { ClassAttributes, ImgHTMLAttributes, JSX } from "react";

export default function NewPointer({
  enabled,
  room,
  props,
}: {
  enabled: boolean;
  room: { id: number; name: string };
  props?: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLImageElement> &
    ImgHTMLAttributes<HTMLImageElement>;
}) {
  if (enabled) {
    return (
      <div
        style={{
          width: "200px",
          height: "fit-content",
          position: "relative",
          justifyContent: "flex-end",
          paddingTop: `${22 + 86 * (room.id - 1)}px`, // DO NOT TOUCH
        }}
      >
        <img src={Pointer} alt="NewPointer" style={{ width: "100%" }} />
        <h5
          style={{
            position: "absolute",
            top: "25%",
            left: "10%",
            color: "#FFFFFF",
            paddingTop: `${18 + 64 * (room.id - 1)}px`, // DO NOT TOUCH
          }}
        >
          {!room.name.includes("Sala") ? `Sala ${room.name}` : room.name}
        </h5>
      </div>
    );
  }

  return <div {...props} />;
}
