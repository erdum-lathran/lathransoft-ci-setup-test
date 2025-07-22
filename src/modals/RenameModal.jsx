import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { AppTextField } from '../common';
import { setReload } from '../reducer/general';
import { DocumentUtil } from '../utils';
import { FormatTypes } from '../static/Constants';
import NetworkRequests from '../netwroking/NetworkRequests';

const RenameModal = forwardRef((_, ref) => {
  // Dispatcher
  const dispatch = useDispatch();

  // Reducer States
  const { reload } = useSelector(state => state.general);

  // Local State
  const [data, setData] = useState({
    isVisible: false,
    fileFolder: null,
    destinationId: null, 
    onRenameSuccess: null,
  });
  const [title, setTitle] = useState('');
  const [showDotError, setShowDotError] = useState(false);

  const { isVisible, fileFolder } = data;

  useImperativeHandle(ref, () => ({
    show: (options = data) => {
      const fullName = DocumentUtil.name(options?.fileFolder) || options?.fileFolder?.name || '';
      const ext = options?.fileFolder?.format || '';
      const nameWithoutExt = fullName?.endsWith(`.${ext}`)
        ? fullName.slice(0, -1 * (ext.length + 1))
        : fullName;
     setData({ ...options, isVisible: true });
      setTitle(nameWithoutExt);
    },
    hide: hideModal,
  }));

  const hideModal = () => {
    setData({ data, isVisible: false });
    setTitle('');
  };

  const handleSubmit = () => {
    handleRename();
  };

  const handleRename = () => {
    let trimmedName = title.trim();
    const body = { name: trimmedName };
    const id = DocumentUtil.id(fileFolder);
    NetworkRequests.renameFileFolder(body, id, async (response) => {
    if (data.destinationId) {
      try {
        await NetworkRequests.moveFilesFolders({
          sourceIds: [id],
          destinationId: data.destinationId,
        });
      } catch (err) {
        console.error('Move after rename failed:', err);
      }
    }
      dispatch(setReload(!reload));
      hideModal();
      data?.onRenameSuccess?.(); 
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
        <Modal.Title>Rename</Modal.Title>
      </Modal.Header>
      {/* <Modal.Body className='py-4 font-size'>
        <AppTextField
          title={`${DocumentUtil.type(fileFolder) == FormatTypes.Folder ? 'Folder' : 'File'} Name`}
          onChange={setTitle}
          value={title}
          isRequired={true}
        />
      </Modal.Body> */}

      <Modal.Body className='py-4 font-size'>
        <div>
          {showDotError && (
            <div className='text-danger '>
              {`${DocumentUtil.type(fileFolder) === FormatTypes.Folder ? 'Folder' : 'File'} Name cannot contain a dot ('.')`}
            </div>
          )}
          <div className='d-flex align-items-center'>
            <div style={{ flex: 1 }}>
              <AppTextField
                title={`${DocumentUtil.type(fileFolder) === FormatTypes.Folder ? 'Folder' : 'File'} Name`}
                onChange={value => {
                  setTitle(value); 
                  setShowDotError(value.includes('.')); 
                }}
                value={title}
                isRequired={true}
              />
            </div>
            {fileFolder?.format && (
              <span className='m-2 mt-4'>.{fileFolder.format}</span>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={hideModal}
          className='mx-2 font-size bg-white primary-color'
        >
          Cancel
        </Button>
        <Button
          disabled={!title || showDotError}
          className='font-size bg-primary white'
          onClick={handleSubmit}
        >
          Rename
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default RenameModal;
