import React from 'react';

export default function HorizontalLine(props) {
  return (
    <div
      className='my-2 w-100 border-bg-color'
      style={{ height: 1 }}
      {...props}
    />
  );
}
