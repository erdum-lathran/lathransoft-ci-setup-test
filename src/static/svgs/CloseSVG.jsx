const CloseSVG = props => (
    <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M18 6L6 18"
            stroke="#99A1B7"
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M6 6L18 18"
            stroke="#99A1B7"
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default CloseSVG;
