import {
  ClassAttributes,
  ImgHTMLAttributes,
  CSSProperties,
  useState,
} from "react";
import { JSX } from "react/jsx-runtime";
import BigRoomSvg from "#svgs/BigRoom.svg";

export default function SimpleRoom({
  available,
  selected,
  props,
}: {
  available: boolean;
  selected: boolean;
  props: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLImageElement> &
    ImgHTMLAttributes<HTMLImageElement> & {
      name?: string;
    };
}) {
  const [hovered, setHovered] = useState(false);

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
    opacity: 0.3,
    pointerEvents: "none",
    borderRadius: "1px",
  };

  const selectedBorderStyle: CSSProperties = {
    position: "absolute",
    top: 0, 
    inset: 0,
    border: "3px solid #b22222",
    borderRadius: "2px",
    pointerEvents: "none",
    boxSizing: "border-box",
  };

  const tooltipStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    // blue
    backgroundColor: "#cc2222",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "15px",
    whiteSpace: "nowrap",
    opacity: selected ? 1 : hovered ? 0.7 : 0,
    transition: "opacity 0.2s ease-in-out",
    pointerEvents: "none",
    zIndex: 10,
  };

  return (
    <div
      className="room-selector"
      style={wrapperStyle}
      {...props}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {(hovered || selected) && (
        <div style={{ ...tooltipStyle, visibility: "visible" }}>
          Sala {props.name}
        </div>
      )}

      <img src={BigRoomSvg} alt="BigRoomImg" style={imgStyle} />

      {available && <div style={overlayStyle} />}

      {selected && <div style={selectedBorderStyle} />}
    </div>
  );
}
