import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setReload } from '../reducer/general';
import { useSearchParams } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { AppTextField } from '../common';
import NetworkRequests from '../netwroking/NetworkRequests';

const CreateLinkModal = forwardRef((_, ref) => {
  // Dispatcher
  const dispatch = useDispatch();

  // Navigation Items
  const [searchParams] = useSearchParams();

  // Reducer States
  const { reload } = useSelector(state => state.general);

  // Local State
  const [data, setData] = useState({
    isVisible: false,
  });
  const [requestBody, setRequestBody] = useState({
    url: '',
    name: '',
  });

  const { isVisible } = data;

  useImperativeHandle(ref, () => ({
    show: (options = data) => {
      setData({ ...options, isVisible: true });
    },
    hide: hideModal,
  }));

  const hideModal = () => {
    setRequestBody({ url: '', name: '' });
    setData({ data, isVisible: false });
  };

  const handleSubmit = () => {
    handleCreateLink();
  };

  const handleCreateLink = () => {
    const body = {
      ...requestBody,
      parentId: searchParams.get('parent_folder_id') || 0,
    };
    NetworkRequests.createLink(body, () => {
      dispatch(setReload(!reload));
      hideModal();
    });
  };

  const isDisabled = () => {
    const { url, name } = requestBody;
    return !url || !name;
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
        <Modal.Title>Create Link</Modal.Title>
      </Modal.Header>
      <Modal.Body className='py-4 font-size'>
        <AppTextField
          title='Link Title'
          onChange={text => {
            setRequestBody({ ...requestBody, name: text });
          }}
          value={requestBody.name}
          isRequired={true}
        />
        <AppTextField
          title='Link'
          onChange={text => {
            setRequestBody({ ...requestBody, url: text });
          }}
          value={requestBody.url}
          isRequired={true}
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
          disabled={isDisabled()}
          className='font-size bg-primary white'
          onClick={handleSubmit}
        >
          Create Link
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default CreateLinkModal;
