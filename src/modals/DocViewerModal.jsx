import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
} from 'react';
//import FileViewer from 'react-file-viewer';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ArrowLeftSVG, ArrowRightSVG } from '../static/svgs';
import { DocumentUtil, Util } from '../utils';
import { Modal } from 'antd';
import ExcelViewer from '../components/excelViewer';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { AppColors } from '../static';
import WarningIcon from '@mui/icons-material/Warning';
const DocViewerModal = forwardRef((_, ref) => {
  // Dispatcher
  const dispatch = useDispatch();

  // Navigation Items
  const [searchParams] = useSearchParams();

  // Reducer States
  const { token } = useSelector(state => state.auth);
  const { documentsList } = useSelector(state => state.documents);
  const [zoom , setZoom] = useState(1)

  // Local States
  const [data, setData] = useState({
    isVisible: false,
    fileId: null,
  });
  const [currentIndex, setCurrentIndex] = useState(-1);

  const { isVisible, fileId } = data;

  useImperativeHandle(ref, () => ({
    show: (options = data) => {
      setData({ ...options, isVisible: true });
    },
    hide: hideModal,
  }));

  useEffect(() => {
    if (fileId && isVisible) setCurrentFileIndex(fileId);
  }, [fileId, isVisible]);

  const hideModal = () => {
    setCurrentIndex(-1);
    setData({ ...data, isVisible: false });
  };

  const filteredDocumentsList = documentsList.filter(
    item => !DocumentUtil.isFolder(item)
  );

  const setCurrentFileIndex = (fileId, direction = 0) => {
    const id = fileId ? fileId : DocumentUtil.id(currentFile());
    const currentFileIndex = filteredDocumentsList.findIndex(
      item => DocumentUtil.id(item) === id
    );

    setCurrentIndex(
      Math.max(
        0,
        Math.min(currentFileIndex + direction, filteredDocumentsList.length - 1)
      )
    );
  };

  const currentFile = () => {
    if (currentIndex != -1) {
      return filteredDocumentsList[currentIndex];
    } else {
      return null;
    }
  };
  const isFirstFile = () => {
    return currentIndex === 0;
  };

  const isLastFile = () => {
    return currentIndex === filteredDocumentsList.length - 1;
  };
  const getDocumentsList = () => {
    return [{ uri: DocumentUtil.key(currentFile()) }];
  };
  const IMAGE_EXTENSIONS = [
    'png',
    'jpg',
    'jpeg',
    'gif',
    'bmp',
    'webp',
    'svg',
    'tiff',
    'avif',
    'jfif'
  ];
  const VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogg'];
  const DOCUMENT_EXTENSIONS = [
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'pdf',
    'txt',
    'csv',
    'sql',
    'exe'
  ];
  const fileUrl = DocumentUtil.key(currentFile());
  const fileExt = DocumentUtil.format(currentFile()).toLowerCase();
  const getViewer = () => {
    if (IMAGE_EXTENSIONS.includes(fileExt)) {
      return (
        <img
          src={fileUrl}
          alt="Image Preview"
          className="w-100 h-100 object-fit-contain"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.2s ease' }}
        />
      );
    } else if (VIDEO_EXTENSIONS.includes(fileExt)) {
      return (
        <video
          src={fileUrl}
          controls
          className="w-100 h-100 object-fit-contain"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.2s ease' }}
        >
          Your browser does not support the video tag.
        </video>
      );
    } else if (DOCUMENT_EXTENSIONS.includes(fileExt)) {
      const officeUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
      console.log('officeUrl: ', officeUrl);
      console.log('fileUrl: ', fileUrl);
      if (fileExt === "xlsx" || fileExt === "xls") {
        return (
          <ExcelViewer filePath={fileUrl} />
        )

      } else {

        return (
          <iframe
            src={officeUrl}
            width="100%"
            height="600px"
            frameborder="0"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', transition: 'transform 0.2s ease', overflow: 'auto' }}
          ></iframe>

        );
      }

    }
    else {
      return (
        <div
          className='w-100 h-100 text-center d-flex flex-column align-items-center justify-content-center '
          style={{ color: AppColors.maroon }}
        >
          <WarningIcon
            style={{ color: AppColors.yellow, width: '50px', height: '50px' }}
          />
          <h5 className='fw-semibold mt-3'>File Preview Not Available</h5>
          <p className='fs-6 text-center px-3'>
            This file type cannot be previewed. Please download it to view on
            your device.
          </p>
        </div>
      );
    }
  };
  const ViewerHeader = () => {
    return (
      <div className='text-center flex-column d-flex align-items-center'>
        <OverlayTrigger
          overlay={
            <Tooltip placement='right' id='button-tooltip'>
              {DocumentUtil.name(currentFile())}
            </Tooltip>
          }
        >
          <div className='cursor-pointer folder-grid-cell text-center fs-8 '>
            {DocumentUtil.icon(currentFile())}
            <p className='mx-2'>
              {Util.truncateText(DocumentUtil.name(currentFile()), 25)}
            </p>
          </div>
        </OverlayTrigger>
      </div>
    );
  };

  return (
    <Modal
      open={isVisible}
      onCancel={hideModal}
      footer={null}
      closable={true}
      width="70vw"
      style={{ top: 20 }}
    >
      <div className="d-flex justify-content-start align-items-center pb-3 border-bottom" style={{ height: '40px' }}>
        <ViewerHeader />
      </div>

      <div
        className="flex-grow-1 overflow-auto d-flex justify-content-center align-items-center"
      >
        <div className="doc-viewer w-100">{getViewer()}
          {/* <DocViewer
            documents={getDocumentsList()}
            pluginRenderers={DocViewerRenderers}
            config={{
              header: {
                overrideComponent: () => <></>,
              },
            }}
          /> */}
          {/* {currentFile() && (
  <FileViewer
    fileType={DocumentUtil.format(currentFile())} 
    filePath={DocumentUtil.key(currentFile())}                  
    onError={(e) => console.error("Error loading file:", e)}
  />
 )} */}
        </div>
      </div>
      <div
        className='d-flex justify-content-center align-items-center border-top pt-3'
        style={{
          height: '50px',
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #dee2e6',
        }}
      >
        <div
          className='d-flex align-items-center gap-1 px-3 py-2 rounded-pill shadow-sm'
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
          }}
        >
        <button
          disabled={isFirstFile()}
          onClick={() => setCurrentFileIndex(null, -1)}
            title='Previous'
            className='btn btn-circle-sm mx-1'
        >
          <ArrowLeftIcon fontSize="small" />
        </button>
          <button
            onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.5))}
            title='Zoom Out'
            className='btn btn-circle-sm mx-1'
          >
            <strong>−</strong>
          </button>
          <button
            onClick={() => setZoom(prev => Math.min(prev + 0.25, 3))}
            title='Zoom In'
            className='btn btn-circle-sm mx-1'
          >
            <strong>+</strong>
          </button>
        <button
          disabled={isLastFile()}
          onClick={() => setCurrentFileIndex(null, 1)}
            title='Next'
            className='btn btn-circle-sm mx-1'
        >
          <ArrowRightIcon fontSize="small" />
        </button>
        </div>
      </div>
    </Modal>
  );
});

export default DocViewerModal;
