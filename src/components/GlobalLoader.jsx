import React from 'react';
import { AppColors } from '../static';
import { Modal, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';

export default function GlobalLoader() {
  const { isLoading } = useSelector(state => state.general);

  return (
    <Modal
      show={isLoading}
      centered={true}
      className='global-loader-cont d-flex justify-content-center align-items-center'
    >
      <Spinner animation='border' style={{ color: AppColors.maroon }} />
    </Modal>
  );

  // if (isLoading) {
  //   return (
  //     <div className='global-loader-cont d-flex justify-content-center align-items-center'>
  //       <Spinner animation='border' style={{ color: AppColors.maroon }} />
  //     </div>
  //   );
  // } else {
  //   return null;
  // }
}
