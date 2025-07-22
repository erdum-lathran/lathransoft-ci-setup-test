import * as React from "react";

const Bin = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 48 48"
  >
    <path
      style={{ stroke: "#3B4564"}}
      strokeLinecap="round"
      strokeWidth="4"
      d="M41 12H7M19 22l1 10M29 22l-1 10"
    ></path>
    <path
      style={{ stroke: "#3B4564"}}
      strokeWidth="4"
      d="m13 12 .218-.001a4 4 0 0 0 3.66-2.638c.018-.048.035-.101.07-.207l.195-.583c.166-.497.248-.745.358-.957a3 3 0 0 1 2.188-1.576C19.924 6 20.186 6 20.71 6h6.58c.524 0 .786 0 1.02.038A3 3 0 0 1 30.5 7.614c.11.212.192.46.358.957l.194.583.07.207A4 4 0 0 0 35 12"
    ></path>
    <path
      style={{ stroke: "#3B4564"}}
      strokeLinecap="round"
      strokeWidth="4"
      d="M36.747 30.798c-.354 5.31-.531 7.965-2.261 9.584S30.096 42 24.774 42h-1.547c-5.322 0-7.983 0-9.713-1.618s-1.907-4.274-2.26-9.584L10.333 17m27.333 0-.4 6"
    ></path>
  </svg>
);

export default Bin;
