import Pointer from "#svgs/Pointer.svg";
import { ClassAttributes, ImgHTMLAttributes, JSX } from "react";

export default function NewPointer({
  enabled,
  roomNumber,
  props,
}: {
  enabled: boolean;
  roomNumber: number;
  props?: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLImageElement> &
    ImgHTMLAttributes<HTMLImageElement>;
}) {
  const numToAscii = ["A", "B", "C", "D", "E", "F", "G"];
  if (enabled) {
    return (
      <div
        style={{
          width: "200px",
          height: "fit-content",
          position: "relative",
          justifyContent: "flex-end",
          paddingTop: `${22 + 86 * roomNumber}px`, // DO NOT TOUCH
        }}
      >
        <img src={Pointer} alt="NewPointer" style={{ width: "100%" }} />
        <h5
          style={{
            position: "absolute",
            top: "25%",
            left: "10%",
            color: "#FFFFFF",
            paddingTop: `${18 + 64 * roomNumber}px`, // DO NOT TOUCH
          }}
        >{`Sala 104${numToAscii[6 - roomNumber]}`}</h5>
      </div>
    );
  }

  return <div {...props} />;
}
