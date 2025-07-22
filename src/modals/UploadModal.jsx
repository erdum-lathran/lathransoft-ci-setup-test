import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
} from 'react';
import { Button, Modal } from 'react-bootstrap';
import { AppLogger, Util, DocumentUtil } from '../utils';
import { UploadCloudSVG } from '../static/svgs';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { UploadFileCell } from '../common';
import { AppMessages, FormatTypes } from '../static/Constants';
import NetworkRequests from '../netwroking/NetworkRequests';
import { setFolderName } from '../reducer/general';

const UploadModal = forwardRef((_, ref) => {
  // Navigation Items
  const [searchParams] = useSearchParams();

  // Dispatcher
  const dispatch = useDispatch();

  // Reducer States

  // Local States
  const [data, setData] = useState({ isVisible: false, isFolder: false });
  const [files, setFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const { isVisible, isFolder } = data;

  useImperativeHandle(ref, () => ({
    show: (options = {}) => {
      setData({ ...options, isVisible: true });
    },
    hide: hideModal,
  }));

  const hideModal = () => {
    setData(prev => ({ ...prev, isVisible: false }));
    setFiles([]);
    setSelectedFolder(null);
  };

  const handleDrop = useCallback(
    async e => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);

      if (!e.dataTransfer || !e.dataTransfer.items) {
        AppLogger('Unsupported drag-and-drop event');
        return;
      }

      const droppedFiles = [];
      let folderName = '';

      const processEntry = async (entry, path = '') => {
        if (entry.isFile) {
          const file = await new Promise(resolve => entry.file(resolve));
          file.relativePath = path + file.name;
          console.log('File added:', file); // Log file immediately after processing
          droppedFiles.push(file);
        } else if (entry.isDirectory) {
          if (!folderName) folderName = entry.name;

          const dirReader = entry.createReader();
          const entries = await new Promise(resolve =>
            dirReader.readEntries(resolve)
          );
          for (const subEntry of entries) {
            await processEntry(subEntry, `${path}${entry.name}/`);
          }
        }
      };

      const entryPromises = Array.from(e.dataTransfer.items).map(item => {
        const entry = item.webkitGetAsEntry();
        if (entry) {
          return processEntry(entry);
        }
      });

      // Wait for all entries to be processed
      await Promise.all(entryPromises);

      if (droppedFiles.length > 20) {
        Util.showToast(AppMessages.MaxFilesLimit, 'warning');
        return;
      }

      if (isFolder) {
        setSelectedFolder({
          name: folderName || 'Unnamed Folder',
          type: FormatTypes.Folder,
          itemCount: droppedFiles.length,
          selectedFiles: droppedFiles,
        });
      }

      console.log('droppedFiles:', droppedFiles);

      setFiles(prev => [...prev, ...droppedFiles]);
    },
    [setFiles, isFolder]
  );

  console.log('Selected Folder: ', selectedFolder);
  console.log('Selected Files: ', files);

  const handleDragOver = e => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleFileInput = e => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 0 && selectedFiles[0].webkitRelativePath) {
      const folderPath = selectedFiles[0].webkitRelativePath;
      const folderName = folderPath.split('/')[0]; // Extract folder name
      console.log('Folder Name:', folderName);

      setSelectedFolder({
        name: folderName,
        type: FormatTypes.Folder,
        itemCount: selectedFiles.length,
        selectedFiles: selectedFiles,
      });
    } else {
      console.log('No folder selected.');
    }

    if (selectedFiles.length > 20) {
      Util.showToast(AppMessages.MaxFilesLimit, 'warning');
      return;
    }
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleSubmit = () => {
    if (isFolder) {
      handleUploadFolder();
    } else {
      handleUploadFiles();
    }
  };

  const handleUploadFiles = () => {
    const formBody = new FormData();

    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      formBody.append('files', element);
    }
    formBody.append('parentId', searchParams.get('parent_folder_id') || 0);

    NetworkRequests.uploadFiles(formBody, () => {
      hideModal();
    });
  };

  const handleUploadFolder = async () => {
    const folderBody = {
      name: selectedFolder.name,
      parentId: searchParams.get('parent_folder_id') || 0,
    };
    dispatch(setFolderName(selectedFolder.name));

    try {
      const createdFolder = await new Promise((resolve, reject) => {
        NetworkRequests.createFolder(folderBody, (response) => {
          if (response) resolve(response);
          else reject("Failed to create folder");
        });
      });

      const formBody = new FormData();
      for (const file of selectedFolder.selectedFiles) {
        formBody.append('files', file);
      }

      formBody.append('parentId', createdFolder.id);

      NetworkRequests.uploadFiles(formBody, () => {
        hideModal();
      });

    } catch (err) {
      console.error("Error while uploading folder:", err);
    }
  };

  return (
    <Modal
      show={isVisible}
      centered
      animation={false}
      onHide={hideModal}
      scrollable
    >
      <Modal.Header closeButton>
        <Modal.Title>{isFolder ? 'Upload Folder' : 'Upload Files'}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='text-center'>
        {isFolder &&
          Util.isNotEmpty(selectedFolder) &&
          Util.isNotEmpty(files) && (
            <div className='text-center flex-column d-flex align-items-center mb-2'>
              <div className='my-0 img-fluid-grid'>
                {DocumentUtil.icon(selectedFolder, 'img-fluid-grid')}
              </div>
              <p>{DocumentUtil.name(selectedFolder)}</p>
              <strong className='mx-2' style={{ fontSize: 10 }}>
                {files.length + ` ${files.length > 1 ? 'Items' : 'item'}`}
              </strong>
            </div>
          )}
        {Util.isEmpty(files) ? (
          <>
            <label
              htmlFor='fileInput'
              className={`drop-zone ${dragOver ? 'dragover' : ''}`}
              tabIndex={0}
              aria-label='File Drop Zone'
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className='drop-zone-inner'>
                <UploadCloudSVG />
                <p className='mt-2 fs-14'>
                  {`Choose a ${isFolder ? 'Folder' : 'Files'} or drag & drop here`}
                </p>
              </div>
            </label>
            <input
              type='file'
              id='fileInput'
              style={{ display: 'none' }}
              multiple={!isFolder}
              webkitdirectory={isFolder ? 'true' : undefined}
              onChange={handleFileInput}
            />
          </>
        ) : (
          files.map((item, index) => {
            return (
              <UploadFileCell
                file={item}
                key={index}
                onCancleFile={() => {
                  setFiles(files.filter((_, i) => i != index));
                }}
              />
            );
          })
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={hideModal}
          className='mx-2 font-size bg-white primary-color'
        >
          Cancel
        </Button>
        <Button
          disabled={Util.isEmpty(files)}
          className='font-size bg-primary white'
          onClick={handleSubmit}
        >
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default UploadModal;
