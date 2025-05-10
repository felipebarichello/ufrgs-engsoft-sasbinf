export default function BaseSvgComponent(svg: string) {
  return (
    <div>
      <img
        src={svg}
        alt={`${svg.constructor.name}`}
        style={{ width: "100%" }}
      />
    </div>
  );
}
