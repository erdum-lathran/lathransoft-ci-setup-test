const SuccessSVG = props => (
  <svg
    width={24}
    height={24}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <rect width={24} height={24} rx={6} fill='url(#paint0_linear_6839_53914)' />
    <path
      d='M8.5 12.5L10.5 14.5L15.5 9.5'
      stroke='white'
      strokeWidth={1.5}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <defs>
      <linearGradient
        id='paint0_linear_6839_53914'
        x1={12}
        y1={0}
        x2={12}
        y2={24}
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#48CA93' />
        <stop offset={1} stopColor='#48BACA' />
      </linearGradient>
    </defs>
  </svg>
);

export default SuccessSVG;
