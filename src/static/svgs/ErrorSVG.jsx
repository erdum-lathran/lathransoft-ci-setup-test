const ErrorSVG = props => (
  <svg
    width={24}
    height={24}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <rect width={24} height={24} rx={6} fill='url(#paint0_linear_7305_53655)' />
    <path
      d='M16 8L8 16M8 8L16 16'
      stroke='white'
      strokeWidth={1.5}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <defs>
      <linearGradient
        id='paint0_linear_7305_53655'
        x1={12}
        y1={0}
        x2={12}
        y2={24}
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#F8285A' />
        <stop offset={1} stopColor='#CD0031' />
      </linearGradient>
    </defs>
  </svg>
);

export default ErrorSVG;
