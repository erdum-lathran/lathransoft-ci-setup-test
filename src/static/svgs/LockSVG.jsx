const LockSVG = props => (
    <svg
        width={18}
        height={18}
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <g clipPath="url(#clip0_8077_39561)">
            <path
                d="M1.5 12C1.5 9.87868 1.5 8.81802 2.15901 8.15901C2.81802 7.5 3.87868 7.5 6 7.5H12C14.1213 7.5 15.182 7.5 15.841 8.15901C16.5 8.81802 16.5 9.87868 16.5 12C16.5 14.1213 16.5 15.182 15.841 15.841C15.182 16.5 14.1213 16.5 12 16.5H6C3.87868 16.5 2.81802 16.5 2.15901 15.841C1.5 15.182 1.5 14.1213 1.5 12Z"
                stroke="#122A3C"
                strokeWidth={1.5}
            />
            <path
                d="M9 10.5V13.5"
                stroke="#122A3C"
                strokeWidth={1.5}
                strokeLinecap="round"
            />
            <path
                d="M4.5 7.5V6C4.5 3.51472 6.51472 1.5 9 1.5C11.4853 1.5 13.5 3.51472 13.5 6V7.5"
                stroke="#122A3C"
                strokeWidth={1.5}
                strokeLinecap="round"
            />
        </g>
        <defs>
            <clipPath id="clip0_8077_39561">
                <rect width={18} height={18} fill="white" />
            </clipPath>
        </defs>
    </svg>
);

export default LockSVG;
