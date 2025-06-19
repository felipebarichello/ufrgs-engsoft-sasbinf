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
          top: `${22 + 86 * (room.id - 1)}px`,
          
          // Decrease pointer size
          // The weird workaround is needed because the code is bad and POG
          // TODO: UnPOG
          transform: "translateX(50%) scale(0.8) translateX(-50%)",
        }}
      >
        <img src={Pointer} style={{
          width: "100%",
          position: "absolute",
          top: "0",
          left: "0",
        }} />
        <h5 style={{
            position: "absolute",
            top: "0.5em",
            left: "1em",
            textAlign: "center",
            color: "#FFFFFF",
        }}>
          {!room.name.includes("Sala") ? `Sala ${room.name}` : room.name}
        </h5>
      </div>
    );
  }

  return <div {...props} />;
}
