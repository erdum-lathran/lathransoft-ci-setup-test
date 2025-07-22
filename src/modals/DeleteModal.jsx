import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { BinSVG } from '../static/svgs';
import { DocumentUtil } from '../utils';
import { setReload } from '../reducer/general';
import NetworkRequests from '../netwroking/NetworkRequests';
import { setSelectedItems } from '../reducer/documents';

const DeleteModal = forwardRef((_, ref) => {
  // Dispatcher
  const dispatch = useDispatch();

  // Reducer States
  const { reload } = useSelector(state => state.general);
  const { selectedItems } = useSelector(state => state.documents);

  // Local States
  const [data, setData] = useState({
    isVisible: false,
    fileFolder: null,
    isBulk: false,
  });

  const { isVisible, fileFolder, isBulk } = data;

  useImperativeHandle(ref, () => ({
    show: (options = data) => {
      setData({ ...options, isVisible: true });
    },
    hide: hideModal,
  }));

  const hideModal = () => {
    setData({ data, isVisible: false });
  };

  const handleSubmit = () => {
    handleDelete();
  };

  const handleDelete = () => {
    const body = {
      documentIds: isBulk
        ? selectedItems.map(item => item.id)
        : [DocumentUtil.id(fileFolder)],
    };
    NetworkRequests.deleteFilesFolders(body, response => {
      dispatch(setReload(!reload));
      dispatch(setSelectedItems([]));
      hideModal();
    });
  };

  return (
    <Modal
      show={isVisible}
      centered={true}
      animation={false}
      onHide={hideModal}
      onBackdropClick={hideModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>{DocumentUtil.name(fileFolder)}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='py-4 font-size'>
        <div className='text-center'>
          <BinSVG />
          <p className='custom-font py-4 fs-14'>
            Deleted items will be moved to your trash and will be deleted
            permanently after 30 days.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={hideModal}
          className='mx-2 font-size bg-white primary-color'
        >
          Cancel
        </Button>
        <Button className='font-size bg-primary white' onClick={handleSubmit}>
          Yes, Delete!
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default DeleteModal;
