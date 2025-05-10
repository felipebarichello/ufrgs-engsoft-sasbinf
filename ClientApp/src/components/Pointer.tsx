import PointerSvg from "#svgs/Pointer.svg";
import { ClassAttributes, ImgHTMLAttributes, JSX } from "react";

export default function Pointer({
  enabled,
  roomNumber,
  props,
}: {
  enabled: boolean;
  roomNumber: number;
  props: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLImageElement> &
    ImgHTMLAttributes<HTMLImageElement>;
}) {
  if (!enabled) {
    return (
      <div
        style={{
          position: "relative",
          textAlign: "center",
          color: "white",
        }}
        {...props}
      />
    );
  }

  const numToLetter = ["A", "B", "C", "D", "E", "F"];

  return (
    <div>
      <div style={{ paddingTop: `${roomNumber * 70}px`, width: "1px" }} />
      <div
        {...props}
        style={{
          position: "relative",
          textAlign: "center",
          color: "white",
        }}
      >
        <img src={PointerSvg} alt="SimpleRoomImg" style={{ width: "40%" }} />
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "10%",
            width: "60%",
          }}
        >
          <p>Sala 104{numToLetter[6 - roomNumber]}</p>
        </div>
      </div>
    </div>
  );
}
