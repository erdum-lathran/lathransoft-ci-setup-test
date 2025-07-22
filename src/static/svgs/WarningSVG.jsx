const WarningSVG = props => (
  <svg
    width={24}
    height={24}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <rect width={24} height={24} rx={6} fill='url(#paint0_linear_8173_55631)' />
    <g clipPath='url(#clip0_8173_55631)'>
      <path
        d='M12.0013 17.8327C15.223 17.8327 17.8346 15.221 17.8346 11.9993C17.8346 8.77769 15.223 6.16602 12.0013 6.16602C8.77964 6.16602 6.16797 8.77769 6.16797 11.9993C6.16797 15.221 8.77964 17.8327 12.0013 17.8327Z'
        stroke='white'
        strokeWidth={1.2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M12 9.66602V11.9993'
        stroke='white'
        strokeWidth={1.2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M12 14.334H12.005'
        stroke='white'
        strokeWidth={1.2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </g>
    <defs>
      <linearGradient
        id='paint0_linear_8173_55631'
        x1={12}
        y1={0}
        x2={12}
        y2={24}
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#FFC500' />
        <stop offset={1} stopColor='#FAC204' />
      </linearGradient>
      <clipPath id='clip0_8173_55631'>
        <rect width={14} height={14} fill='white' transform='translate(5 5)' />
      </clipPath>
    </defs>
  </svg>
);

export default WarningSVG;
