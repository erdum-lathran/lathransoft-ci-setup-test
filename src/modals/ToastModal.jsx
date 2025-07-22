import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { Util } from '../utils';
import { Modal } from 'antd';

const ToastModal = () => {
  const [data, setData] = useState({
    isVisible: false,
    message: 'Hello World',
    buttonTitle: 'Undo',
    type: '', // You can use this to style based on the toast type (e.g., success, error)
  });

  return (
    <div>
      {Util.toastIcon(type)}
      <p className='w-100 fs-14 mx-3'> {message}</p>
      <button className='toast-btn'>{buttonTitle}</button>
    </div>
  );
};

export default ToastModal;
