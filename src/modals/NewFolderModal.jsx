import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { AppTextField } from '../common';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setBreadcrumbs } from '../reducer/documents';
import { AppRoutes } from '../static';
import { DocumentUtil } from '../utils';
import NetworkRequests from '../netwroking/NetworkRequests';

const NewFolderModal = forwardRef((_, ref) => {
  // Navigation Items
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Dispatcher
  const dispatch = useDispatch();

  // Reducer States
  const { breadcrumbs } = useSelector(state => state.documents);

  const [data, setData] = useState({
    isVisible: false,
    name: '',
    callback: () => {},
    parentId: 0,
  });

  const { isVisible, name, callback, parentId } = data;

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
    handleNewFolder();
  };

  const handleNewFolder = () => {
    const body = {
      parentId: parentId ? parentId : searchParams.get('parent_folder_id') || 0,
      name: name,
    };
    NetworkRequests.createFolder(body, createdFolder => {
      if (callback) {
        callback();
      } else {
        dispatch(setBreadcrumbs([...breadcrumbs, createdFolder]));
        navigate(
          `${AppRoutes.FolderDetails}?parent_folder_id=${DocumentUtil.id(createdFolder)}`
        );
      }
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
        <Modal.Title>New Folder</Modal.Title>
      </Modal.Header>
      <Modal.Body className='py-4 font-size'>
        <AppTextField
          title='Folder Name'
          onChange={text => {
            setData({ ...data, name: text });
          }}
          value={name}
          isRequired={true}
          autoFocus={true}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={hideModal}
          className='mx-2 font-size bg-white primary-color'
        >
          Cancel
        </Button>
        <Button
          disabled={!name}
          className='font-size bg-primary white'
          onClick={handleSubmit}
        >
          Create Folder
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default NewFolderModal;
