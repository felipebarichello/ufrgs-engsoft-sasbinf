import { ClassAttributes, ImgHTMLAttributes } from 'react'
import { JSX } from 'react/jsx-runtime'
import BigRoomSvg from '#svgs/BigRoom.svg'

const BigRoom = (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLImageElement> & ImgHTMLAttributes<HTMLImageElement>) => (
  <div>
    <img
      src={BigRoomSvg}
      // style={{ height: "100%", width: "100%" }}
      alt="BigRoomImg"
      {...props}
    />
  </div>
)

export default BigRoom