const LogoSVG = props => (
  <svg
    width={50}
    height={50}
    viewBox='0 0 48 48'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <rect width={48} height={48} rx={12} fill='#122A3C' fillOpacity={0.1} />
    <path
      d='M26.4624 10.6992H15.9984C15.1148 10.6992 14.3984 11.4156 14.3984 12.2992V35.5312C14.3984 36.4149 15.1148 37.1312 15.9984 37.1312H31.9984C32.8821 37.1312 33.5984 36.4149 33.5984 35.5312V17.8352C33.5984 17.5701 33.3835 17.3552 33.1184 17.3552H26.9424V11.1792C26.9424 10.9141 26.7275 10.6992 26.4624 10.6992Z'
      fill='#AA322E'
      stroke='black'
      strokeWidth={0.0159999}
    />
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M33.5797 17.6141V17.6157H26.7812V10.8157L33.5797 17.6141Z'
      fill='#EC8323'
    />
    <path d='M18.8125 21.9609H29.1805' stroke='white' strokeWidth={1.59999} />
    <path d='M18.8125 25.5449H29.1805' stroke='white' strokeWidth={1.59999} />
    <path d='M18.8125 29.1309H23.8685' stroke='white' strokeWidth={1.59999} />
  </svg>
);

export default LogoSVG;
