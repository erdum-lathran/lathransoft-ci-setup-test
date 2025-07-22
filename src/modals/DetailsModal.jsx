import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { StarSVG } from '../static/svgs';
import { get } from 'lodash';
import { DocumentUtil } from '../utils';
import moment from 'moment';

const DetailsModal = forwardRef((_, ref) => {
  const [data, setData] = useState({
    isVisible: false,
    fileFolder: null,
  });

  const { isVisible, fileFolder } = data;

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
    hideModal();
  };

  const getFormatedDate = date => {
    if (date) {
      return moment(date).format('DD MMM YYYY @ hh:mm A');
    } else {
      return '';
    }
  };

  const createObjectFromData = () => {
    return [
      {
        title: 'File Type',
        description: DocumentUtil.type(fileFolder),
      },
      {
        title: DocumentUtil.isFolder(fileFolder) ? 'Count' : 'File Size',
        description: DocumentUtil.customSize(fileFolder),
      },
      {
        title: 'Count',
        description: DocumentUtil.readableSize(fileFolder),
      },
      {
        title: 'Owner',
        description: DocumentUtil.ownerEmail(fileFolder),
      },
      {
        title: 'Created At',
        description: getFormatedDate(get(fileFolder, 'createdAt', null)),
      },
      {
        title: 'Last Modified',
        description: getFormatedDate(get(fileFolder, 'updatedAt', null)),
      },
      {
        title: 'Location',
        description: DocumentUtil.key(fileFolder),
      },
    ];
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
        <Modal.Title>{DocumentUtil.name(fileFolder)}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='font-size'>
        <div className='text-center flex-column d-flex align-items-center mb-2'>
          <div className='img-fluid-grid'>
            {DocumentUtil.icon(fileFolder, 'img-fluid-grid')}
          </div>
          <p>
            {DocumentUtil.name(fileFolder)}
            {DocumentUtil.isFavorite(fileFolder) && <StarSVG />}
          </p>
        </div>
        {createObjectFromData().map((item, index) => {
          const { title, description } = item;
          if (description) {
            return (
              <DetailsCell
                title={title}
                description={description}
                key={index}
              />
            );
          }
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button className='font-size bg-primary white' onClick={handleSubmit}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default DetailsModal;

const DetailsCell = ({ title, description }) => {
  return (
    <div className='py-2 border-top'>
      <p className='title-text'>{title}</p>
      <p className=''>{description}</p>
    </div>
  );
};
