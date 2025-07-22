import React from 'react';
import { Form } from 'react-bootstrap';

export default function AppTextField(props) {
  const { title, isRequired, value, onChange, ...rest } = props;
  return (
    <div>
      <div className='py-2'>
        <span className='font-size font-color'>{title}</span>
        {isRequired && <span style={{ color: 'red' }}>*</span>}
      </div>
      <div className='mb-3 d-flex justify-content-between'>
        <Form.Control
          className='fs-14'
          style={{ backgroundColor: '#f9f9f9' }}
          value={value}
          onChange={e => {
            onChange(e.target.value);
          }}
          aria-label="Recipient's username"
          aria-describedby='basic-addon2'
          {...rest}
        />
      </div>
    </div>
  );
}
