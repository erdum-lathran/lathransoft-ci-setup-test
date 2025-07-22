const UploadSVG = props => (
    <svg
        width={18}
        height={18}
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <g clipPath="url(#clip0_8077_49068)">
            <path
                d="M12.75 6.75195C14.3813 6.76103 15.2647 6.83337 15.841 7.40966C16.5 8.06867 16.5 9.12933 16.5 11.2506V12.0006C16.5 14.122 16.5 15.1826 15.841 15.8416C15.182 16.5006 14.1213 16.5006 12 16.5006H6C3.87868 16.5006 2.81802 16.5006 2.15901 15.8416C1.5 15.1826 1.5 14.122 1.5 12.0006L1.5 11.2506C1.5 9.12933 1.5 8.06867 2.15901 7.40966C2.7353 6.83337 3.61873 6.76103 5.25 6.75195"
                stroke="white"
                strokeWidth={1.5}
                strokeLinecap="round"
            />
            <path
                d="M9 11.25L9 1.5M9 1.5L11.25 4.125M9 1.5L6.75 4.125"
                stroke="white"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
        <defs>
            <clipPath id="clip0_8077_49068">
                <rect width={18} height={18} rx={5} fill="white" />
            </clipPath>
        </defs>
    </svg>
);

export default UploadSVG;
