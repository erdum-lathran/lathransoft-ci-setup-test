const ArrowUpSVG = props => (
  <svg
    width={14}
    height={14}
    viewBox='0 0 14 14'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    transform='rotate(180)' // Apply vertical flip here
    {...props}
  >
    <path
      d='M1.75 4.375L7 9.625L12.25 4.375'
      stroke='white'
      strokeWidth={1.5}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export default ArrowUpSVG;
