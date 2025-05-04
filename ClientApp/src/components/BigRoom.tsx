import { ClassAttributes, ImgHTMLAttributes } from 'react'
import { JSX } from 'react/jsx-runtime'
import BigRoomSvg from '#svgs/BigRoom.svg'
import SelectedBigRoomSvg from '#svgs/SelectedBigRoom.svg'

export default function BigRoom(
  {
    selected, props
  }: {
    selected: boolean,
    props: JSX.IntrinsicAttributes & ClassAttributes<HTMLImageElement> & ImgHTMLAttributes<HTMLImageElement>
  }
) {
  if (selected) {
    return (
      <div {...props}>
        <img
          src={SelectedBigRoomSvg}
          alt="BigRoomImg"
          style={{ width: "100%" }}
        />
      </div>)
  } else {
    return (
      <div {...props}>
        <img
          src={BigRoomSvg}
          alt="BigRoomImg"
          style={{ width: "100%" }}
        />
      </div>
    )
  }
}
