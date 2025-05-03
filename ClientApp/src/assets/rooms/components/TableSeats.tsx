import { ClassAttributes, ImgHTMLAttributes } from 'react';
import { JSX } from 'react/jsx-runtime';
import SimpleTableSvg from '../svgs/SimpleTable.svg'

const SimpleTable = (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLImageElement> & ImgHTMLAttributes<HTMLImageElement>) => (
  <div>
    <img
      src={SimpleTableSvg}
      alt="SimpleRoomImg"
      {...props}
    />
  </div>
)

export default SimpleTable;