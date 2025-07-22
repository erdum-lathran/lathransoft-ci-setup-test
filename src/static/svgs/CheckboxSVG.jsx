const CheckboxSVG = props => (
    <svg
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <rect width={20} height={20} rx={6} fill="#AA322E" />
        <path
            d="M5 10.75L8.125 13.875L15 7"
            stroke="white"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default CheckboxSVG;
