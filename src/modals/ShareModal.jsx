import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Form, Modal } from 'react-bootstrap';
import { CopyLinkSVG, StarSVG } from '../static/svgs';
import { AppColors } from '../static';
import { AppMessages, ShareOptions } from '../static/Constants';
import { DocumentUtil, UserUtil, Util } from '../utils';
import Select from 'react-select';
import NetworkRequests from '../netwroking/NetworkRequests';

const ShareModal = forwardRef((_, ref) => {
  // Navigation Items
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Dispatcher
  const dispatch = useDispatch();

  // Reducer States
  const { usersList, user } = useSelector(state => state.auth);

  const [data, setData] = useState({
    isVisible: false,
    callback: () => {},
    fileFolder: null,
    link: null,
    email: null,
    users: [],
    permission: '',
  });

  const { isVisible, callback, fileFolder, email, link, users, permission } =
    data;

  useImperativeHandle(ref, () => ({
    show: (options = data) => {
      setData({ ...options, isVisible: true });
    },
    hide: hideModal,
  }));

  const hideModal = () => {
    setData({ data, isVisible: false });
  };

  const handleCopyLink = async () => {
    const fileLink = DocumentUtil.key(fileFolder);
    try {
      await navigator.clipboard.writeText(fileLink);
      setData({ ...data, link: fileLink });
      Util.showToast(AppMessages.CopiedLink, 'info');
    } catch (error) {
      Util.showToast(AppMessages.CopyLinkError, 'error');
    }
  };

  const getCopyButtonTitle = () => {
    return link ? 'Link Copied' : 'Copy Link';
  };

  const colourStyles = {
    option: (styles, { isSelected }) => ({
      ...styles,
      background: isSelected ? AppColors.maroon : AppColors.transparent,
      zIndex: 1,
    }),
    control: (base, { isFocused }) => ({
      ...base,
      borderColor: isFocused ? AppColors.maroon : AppColors.borderColor,
      boxShadow: null,
      '&:hover': { borderColor: AppColors.maroon },
    }),
  };

  const transformedUsersList = () => {
    return usersList?.map(item => ({
      ...item,
      label: UserUtil.fullName(item),
      value: UserUtil.userId(item),
    }));
  };

  const handleSubmit = () => {
    handleCreateLink();
  };

  const handleCreateLink = () => {
    const body = {
      documentId: DocumentUtil.id(fileFolder),
      sharedByUserId: UserUtil.id(user),
      sharedWithUserId: users.map(item => UserUtil.userId(item)),
      permission: 'view',
    };
    NetworkRequests.shareFilesFolders(body, () => {
      hideModal();
    });
  };

  const isDisabled = () => {
    return !Util.isValidEmail(email) && Util.isEmpty(users);
  };

  return (
    <Modal
      show={isVisible}
      centered={true}
      animation={false}
      onHide={hideModal}
      onBackdropClick={hideModal}
      scrollable={true}
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: 'large' }}>Share</Modal.Title>
      </Modal.Header>
      <Modal.Body className='py-4  font-size'>
        <div className='text-center flex-column d-flex align-items-center mb-2'>
          <div className='img-fluid-grid'>
            {DocumentUtil.icon(fileFolder, 'img-fluid-grid')}
          </div>
          <p>
            {DocumentUtil.name(fileFolder)}
            {DocumentUtil.isFavorite(fileFolder) && <StarSVG />}
          </p>
        </div>
        <div className='py-2'>
          <span> Add Email </span>
          <span style={{ color: 'red' }}>*</span>
        </div>
        <div className='mb-3 d-flex justify-content-between'>
          <Form.Control
            className='fs-14'
            style={{ backgroundColor: '#f9f9f9' }}
            value={email}
            onChange={e => {
              setData({ ...data, email: e.target.value.trim() });
            }}
            aria-label="Recipient's username"
            aria-describedby='basic-addon2'
          />
        </div>
        {/* <div className='py-2'>
          <span> Permission </span>
          <span style={{ color: 'red' }}>*</span>
        </div>
        <Select
          placeholder={''}
          options={ShareOptions}
          classNamePrefix='select'
          value={
            ShareOptions.find(option => option.value === permission) || null
          }
          styles={colourStyles}
          className='fs-14 mb-3'
          onChange={({ value }) => {
            setData({ ...data, permission: value });
          }}
        /> */}
        <div className='py-2'>
          <span>Select Users</span>
          <span style={{ color: 'red' }}>*</span>
        </div>
        <Select
          isMulti
          isSearchable
          placeholder={''}
          tabSelectsValue={true}
          options={transformedUsersList()}
          classNamePrefix='select'
          value={transformedUsersList().filter(option =>
            (users || []).some(item => UserUtil.userId(item) === option.value)
          )}
          styles={colourStyles}
          className='fs-14'
          onChange={selectedOptions => {
            setData({ ...data, users: selectedOptions || [] });
          }}
          closeMenuOnSelect={false}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={handleCopyLink}
          className='mx-2 font-size bg-white primary-color'
        >
          <span className='mr-2'>
            <CopyLinkSVG />
          </span>
          <span>{getCopyButtonTitle()}</span>
        </Button>
        <Button
          disabled={isDisabled()}
          className='font-size'
          onClick={handleSubmit}
          style={{ backgroundColor: '#aa322e' }}
        >
          Share
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default ShareModal;
