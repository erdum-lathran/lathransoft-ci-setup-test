import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {
  Button,
  Modal,
  OverlayTrigger,
  Spinner,
  Tooltip,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumbs } from '@mui/material';
import { DataHandler, DocumentUtil, Util } from '../utils';
import { useQuery } from '@tanstack/react-query';
import { EmptyFolderSVG, FolderIconSVG } from '../static/svgs';
import { AppColors } from '../static';
import { setReload } from '../reducer/general';
import { TabsTitles } from '../static/Constants';
import NetworkRequests from '../netwroking/NetworkRequests';

const MoveCopyModal = forwardRef((_, ref) => {
  // Dispatcher
  const dispatch = useDispatch();

  // Reducer States
  const { reload } = useSelector(state => state.general);
  const { selectedItems } = useSelector(state => state.documents);

  // Constants
  const initialBreadCrumb = { name: TabsTitles.MyDocs, id: 0 };

  // Local State
  const [initialData, setInitialData] = useState({
    isVisible: false,
    fileFolder: null,
    isBulk: false,
    isMoving: false,
  });
  const [foldersData, setFoldersData] = useState([]);
  const [breadCrumbsList, setBreadcrumbsList] = useState([initialBreadCrumb]);
  const [localReload, setLocalRealod] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const newFolderRef = useRef(null);

  const { isVisible, isBulk, fileFolder, isMoving } = initialData;

  const getLastItemId = () => {
    const lastItem = breadCrumbsList.at(-1);
    return lastItem ? DocumentUtil.id(lastItem) : 0;
  };

  const requestParams = useMemo(() => {
    return {
      parentId: getLastItemId(),
    };
  }, [breadCrumbsList]);

  const { data, isPending } = useQuery({
    queryKey: ['copyDocumentList', breadCrumbsList, isVisible, localReload],
    queryFn: async () => {
      return NetworkRequests.getFoldersList(requestParams);
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
    retryDelay: 3000,
    // staleTime: 1000 * 60 * 5, // 5 Minutes
    staleTime: 1000 * 4, 
  });

  useEffect(() => {
    setFoldersData(data || []);
  }, [data]);
  const addFileFormat = (folders) => {
    return folders.map(folder => {
      const fileExtension = folder.name.split('.').pop();
      return {
        ...folder,
        format: fileExtension,
      };
    });
  };
  useEffect(() => {
    if (data) {
      const updatedFolders = addFileFormat(data);
      setFoldersData(updatedFolders);
    }
  }, [data]);

  useImperativeHandle(ref, () => ({
    show: (options = initialData) => {
      setInitialData({ ...options, isVisible: true });
    },
    hide: hideModal,
  }));

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      isCreatingFolder &&
      newFolderRef.current &&
      !newFolderRef.current.contains(event.target)
    ) {
      setIsCreatingFolder(false);
      setNewFolderName('');
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [isCreatingFolder]);

  const hideModal = () => {
    setInitialData({ initialData, isVisible: false });
    setBreadcrumbsList([initialBreadCrumb]);
    setFoldersData([]);
    setErrorMessage('');
  };

  const handleSubmit = () => {
    handleCopyMoveFileFolder();
  };

 const handleCopyMoveFileFolder = async () => {
  const itemsToProcess = isBulk ? selectedItems : [fileFolder];
  const pendingRenameQueue = [];

  for (const item of itemsToProcess) {
    const body = {
      sourceIds: [DocumentUtil.id(item)],
      destinationId: getLastItemId(),
    };

    try {
      if (isMoving) {
        await NetworkRequests.moveFilesFolders(body);
      } else {
        await NetworkRequests.copyFilesFolders(body);
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'An error occurred.';
      if (message.includes('Rename required')) {
        pendingRenameQueue.push({ item, destinationId: getLastItemId() });

      } else if (message.includes('Already exist')) {
        setErrorMessage('Already Exists ');

      } else {
        setErrorMessage(message);
      }
    }
  };

    if (pendingRenameQueue.length > 0) {
      hideModal();
      processRenameQueue(pendingRenameQueue);
    } else {
      hideModal();
      dispatch(setReload(!reload));
    }
  };
  
  const processRenameQueue = async (queue) => {
    if (queue.length === 0) {
      hideModal();
      dispatch(setReload(!reload));
      return;
    }

    const { item, destinationId } = queue.shift();

    DataHandler.getRenameModalRef().show({
      fileFolder: item,
      destinationId,
      onRenameSuccess: () => processRenameQueue(queue),
    });
  };

  const handleCreateFolder = () => {
    DataHandler.getNewFolderModalRef().show({
      parentId: getLastItemId(),
      callback: () => {
        setLocalRealod(!localReload);
      },
    });
  };

  // const handleCellPress = selectedFolder => {
  //   setBreadcrumbsList([...breadCrumbsList, selectedFolder]);
  // };

  const handleCellPress = selectedItem => {
    if (selectedItem.type === 'folder') {
      setBreadcrumbsList((prevState) => [
        ...prevState,
        selectedItem,
      ]);
    }
  };

  const handleBreadCrumbPress = clickedItem => {
    const clickedItemIndex = breadCrumbsList.findIndex(
      item => DocumentUtil.id(item) == DocumentUtil.id(clickedItem)
    );
    setBreadcrumbsList([...breadCrumbsList.slice(0, clickedItemIndex + 1)]);
  };
  
  const handleNewFolderKeyDown = async (e) => {
  if (e.key === 'Enter' && newFolderName.trim()) {
    const body = {
      parentId: getLastItemId(),
      name: newFolderName.trim(),
    };

    NetworkRequests.createFolder(body, () => {
      setIsCreatingFolder(false);
      setNewFolderName('');
      setLocalRealod(prev => !prev);
    });
  } else if (e.key === 'Escape') {
    setIsCreatingFolder(false);
    setNewFolderName('');
  }
  };
  return (
    <Modal
      show={isVisible}
      centered={true}
      animation={false}
      onHide={hideModal}
      onBackdropClick={hideModal}
      scrollable
    >
      <Modal.Header closeButton>
        <Modal.Title>{`${isMoving ? 'Move' : 'Copy'} To`}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='py-4 font-size' style={{ minHeight: '60vh' }}>
        <div>
          {Util.isNotEmpty(breadCrumbsList) && (
            <Breadcrumbs separator='/' aria-label='breadcrumb' className='mb-4'>
              {breadCrumbsList.map((item, index) => {
                return (
                  <p
                    onClick={() => handleBreadCrumbPress(item)}
                    className='cursor-pointer breadcrumb-cell'
                    key={index}
                  >
                    {Util.truncateText(DocumentUtil.name(item), 15)}
                  </p>
                );
              })}
            </Breadcrumbs>
          )}
          {Util.isNotEmpty(foldersData) ? (
            <div className='row'>
              {foldersData.map((item, index) => (
                <FolderGridCell
                  key={index}
                  folder={item}
                  onClick={() => handleCellPress(item)}
                />
              ))}
            </div>
          ) : (
            <div className='text-center'>
              {isPending ? (
                <Spinner
                  animation='border'
                  style={{ color: AppColors.maroon }}
                />
              ) : (
                <>
                  <div className='empty-image'>
                    <EmptyFolderSVG />
                  </div>
                  <div className='my-3'>
                    <strong>{'Nothing in Folder'}</strong>
                  </div>
                </>
              )}
            </div>
          )}
          {isCreatingFolder && (
            <div className='col-6' ref={newFolderRef}>
              <div className='cursor-pointer folder-grid-cell text-center'>
                <div style={{ width: '48px', height: '48px' }}>
                  <FolderIconSVG width='100%' height='100%' />
                </div>
                <input
                  type='text'
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  onKeyDown={handleNewFolderKeyDown}
                  className='form-control ms-2 p-2 rounded border shadow-sm'
                  placeholder='Enter Folder Name...'
                  autoFocus
                  style={{ fontSize: '12px' }}
                />
              </div>
            </div>
          )}
        </div>
        {errorMessage && (
          <div className='alert alert-danger text-center py-4'>
            {errorMessage}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className='justify-content-between'>
        <Button
          onClick={() => setIsCreatingFolder(true)}
          className='font-size bg-primary white'
        >
          New Folder
        </Button>
        <div>
          <Button
            onClick={hideModal}
            className='mx-2 font-size bg-white primary-color'
          >
            Cancel
          </Button>
          <Button className='font-size bg-primary white' onClick={handleSubmit}>
            {isMoving ? 'Move' : 'Paste'}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
});

export default MoveCopyModal;

const FolderGridCell = ({ onClick, folder }) => {
  return (
    <div className='col-6' onClick={onClick}>
      <div className='cursor-pointer folder-grid-cell text-center '>
        {/* <FolderIconSVG /> */}
        {DocumentUtil.icon(folder)}
        <OverlayTrigger
          overlay={
            <Tooltip placement='right' id='button-tooltip'>
              {DocumentUtil.name(folder)}
            </Tooltip>
          }
        >
          <p className='mx-2'>
            {Util.truncateText(DocumentUtil.name(folder), 15)}
          </p>
        </OverlayTrigger>
      </div>
    </div>
  );
};
