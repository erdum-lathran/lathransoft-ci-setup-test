const PlusSVG = props => (
  <svg
    width={18}
    height={18}
    viewBox='0 0 18 18'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M3.75 9H14.25'
      stroke={'#AA322E'}
      strokeWidth={1.5}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M9 3.75V14.25'
      stroke='#AA322E'
      strokeWidth={1.5}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export default PlusSVG;
