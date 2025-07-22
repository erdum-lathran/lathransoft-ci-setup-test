import React from 'react';

export default function AuthTextField(props) {
  const { title, error, isRequired = true, value, onChange, ...rest } = props;

  return (
    <div className='w-100 text-start my-2 position-relative'>
      <div className='pb-1'>
        <span className='fs-14 font-color'>{title}</span>
        {isRequired && <span style={{ color: 'red' }}>*</span>}
      </div>
      <input
        className='form-control fs-14 text-decoration-none'
        value={value}
        onChange={e => onChange(e.target.value)}
        {...rest}
      />
      {error && <div className='text-danger float-start'>{error}</div>}
    </div>
  );
}
