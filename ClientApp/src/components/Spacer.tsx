interface SpacerProps {
    size?: number | string;
}

export function HorizontalSpacer({ size = 16 }: SpacerProps) {
    return <div style={{ width: size }} />;
}

export function VerticalSpacer({ size = 16 }: SpacerProps) {
    return <div style={{ height: size }} />;
}