const InfoSVG = props => (
  <svg
    width={24}
    height={24}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <rect width={24} height={24} rx={6} fill='url(#paint0_linear_8173_55650)' />
    <path
      d='M11.8333 17.6667C15.055 17.6667 17.6667 15.055 17.6667 11.8333C17.6667 8.61167 15.055 6 11.8333 6C8.61167 6 6 8.61167 6 11.8333C6 15.055 8.61167 17.6667 11.8333 17.6667Z'
      stroke='white'
      strokeWidth={1.2}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M11.832 14.1673V11.834'
      stroke='white'
      strokeWidth={1.2}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M11.832 9.5H11.8379'
      stroke='white'
      strokeWidth={1.2}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <defs>
      <linearGradient
        id='paint0_linear_8173_55650'
        x1={12}
        y1={0}
        x2={12}
        y2={24}
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#2F9CF4' />
        <stop offset={1} stopColor='#2C9BF4' />
      </linearGradient>
    </defs>
  </svg>
);

export default InfoSVG;
