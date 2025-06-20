import { ClassAttributes, ImgHTMLAttributes, CSSProperties} from "react";
import { JSX } from "react/jsx-runtime";
import BigRoomSvg from "#svgs/BigRoom.svg";

export default function BigRoom({
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
  
  const imgStyle: CSSProperties = {
    borderRight: "3px solid #ccc",
    borderRadius: "1px",
    width: "140px",
    height: "100px",
    display: "block",
  };

  const wrapperStyle: CSSProperties = {
    position: "relative",
    width: "140px",
    height: "100px",
    display: "inline-block",
  };

  const overlayStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#6fdd6f",
    opacity: 0.2,
    pointerEvents: "none",
    borderRadius: "1px",
  };

  const selectedBorderStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    border: "2px solid #b22222",
    borderRadius: "1px",
    pointerEvents: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={wrapperStyle} {...props}>
      <img src={BigRoomSvg} alt="BigRoomImg" style={imgStyle} />
      {available && <div style={overlayStyle} />}
      {selected && <div style={selectedBorderStyle} />}
    </div>
  );
}


//140
//100
//borderRight: "3px solid #ccc",