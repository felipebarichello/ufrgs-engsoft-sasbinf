import { ClassAttributes, ImgHTMLAttributes } from 'react';
import { JSX } from 'react/jsx-runtime';
import BigRoomSvg from '#svgs/BigRoom.svg';
import SelectedBigRoomSvg from '#svgs/SelectedBigRoom.svg';

export default function BigRoom({
	selected,
	available,
	props,
}: {
	selected: boolean;
	available: boolean;
	props: JSX.IntrinsicAttributes &
		ClassAttributes<HTMLImageElement> &
		ImgHTMLAttributes<HTMLImageElement>;
}) {
	const style = {
		width: '100%',
		border: selected ? '3px solid red' : undefined,
	};
	if (available) {
		return (
			<div {...props}>
				<img src={SelectedBigRoomSvg} alt="BigRoomImg" style={style} />
			</div>
		);
	} else {
		return (
			<div {...props}>
				<img src={BigRoomSvg} alt="BigRoomImg" style={style} />
			</div>
		);
	}
}
