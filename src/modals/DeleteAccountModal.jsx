import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import DeleteAccount from '../../public/assets/images/DeleteAccount.svg';

const DeleteAccountModal = forwardRef((_, ref) => {
  const [data, setData] = useState({
    isVisible: false,
  });

  const { isVisible } = data;

  useImperativeHandle(ref, () => ({
    show: (options = {}) => {
      setData(prev => ({ ...prev, ...options, isVisible: true }));
    },
    hide: () => {
      setData(prev => ({ ...prev, isVisible: false }));
    },
  }));

  const hideModal = () => {
    setData(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <Modal
      show={isVisible}
      centered
      animation={false}
      onHide={hideModal}
      backdrop={true}
      keyboard={true}
    >
      <Modal.Body className='text-center py-4 px-4'>
        <div className='mb-4'>
          <img src={DeleteAccount} alt='Delete Account' className='img-fluid' />
        </div>

        <h4 className='mb-3'>We're sorry to see you go</h4>

        <p className='mb-4 text-secondary'>
          Be advised, account deletion is final. There will be no way to restore
          your account. Are you sure you want to Delete Account?
        </p>

        <div className='d-flex justify-content-center gap-3'>
          <Button variant='danger' className='px-4 py-3 fw-semibold'>
            Yes, Delete
          </Button>
          <Button
            variant='light'
            className='px-4 py-3 text-secondary fw-semibold'
            onClick={hideModal}
          >
            Cancel
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
});

export default DeleteAccountModal;
