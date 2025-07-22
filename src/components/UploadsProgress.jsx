import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowDownSVG, ArrowUpSVG, CloseSVG } from '../static/svgs';
import { HorizontalLine } from '../common';
import { useDispatch, useSelector } from 'react-redux';
import { AppLogger, DocumentUtil, UploadUtil, Util } from '../utils';
import { setReload } from '../reducer/general';
import { io } from 'socket.io-client';
import { AppColors } from '../static';
import ENVConfig from '../configs/ENVConfig';
import { MdRefresh } from 'react-icons/md';
import {
  FolderIconSVG,
} from '../static/svgs';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const UploadsProgress = () => {
  const dispatch = useDispatch();

  // check file and folder
  const { isFolder } = useSelector(state => state.general);
  const { folderName } = useSelector(state => state.general);

  // Reference
  // Use a ref to keep a single socket instance
  const socketRef = useRef(null);

  // Reducer States
  const { reload } = useSelector(state => state.general);
  const { uploadsProgressList } = useSelector(state => state.documents);

  // Local States
  const [localList, setLocalList] = useState([]);
  console.log('setLocalList: ', setLocalList);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [progressData, setProgressData] = useState({}); // Progress tracking  
  const [statusData, setStatusData] = useState({}); // Status tracking 
  const [failedUploads, setFailedUploads] = useState({});
  const [completedUploads, setCompletedUploads] = useState({});

  // Determine the current index based on progress
  const currentUploadIndex = useMemo(() => {
    for (let i = 0; i < localList.length; i++) {
      const jobId = UploadUtil.jobId(localList[i]);
      if (progressData[jobId] !== 100) {
        return i + 1; // 1-based index
      }
    }
    return null;
  }, [localList, progressData]);

  useEffect(() => {
    if (Util.isNotEmpty(uploadsProgressList)) {
      setLocalList(prevList => [
        ...prevList,
        ...uploadsProgressList.filter(
          upload =>
            !prevList.some(
              item => UploadUtil.jobId(item) === UploadUtil.jobId(upload)
            )
        ),
      ]);
    }
  }, [uploadsProgressList]);

  // upload folder file current update
  const FolderFileUpdate = localList.map((upload) => {
    // console.log('upload: ', upload);
    const jobId = UploadUtil.jobId(upload);
    const currentProgress = progressData[jobId] || 0;

    const status = completedUploads[jobId]
      ? 'Completed'
      : 'In Progress';
    const hasError = failedUploads[jobId];
    return { status, currentProgress, hasError }
  })
  console.log('FolderFileUpdate: ', FolderFileUpdate);
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(ENVConfig.SocketUrl, {
        transports: ['websocket'],
      });

      socketRef.current.on('connect', () => {
        AppLogger('Socket connected');
      });

      socketRef.current.on('disconnect', () => {
        AppLogger('Socket disconnected');
      });
    }

    const socket = socketRef.current;

    localList.forEach(upload => {
      const jobId = UploadUtil.jobId(upload);
      const eventChannel = `${ENVConfig.FileUploadChannel}-${jobId}`;
      socket.emit("subscribe", eventChannel);
      socket.on(eventChannel, msg => {
        const progress = UploadUtil.progress(msg);
        const status = progress === 100 ? true : false;

        if (msg.message.includes('failed') || msg.message.includes('error')) {
          console.log(
            `Upload failed for jobId: ${jobId}, Error: ${msg.message}`
          );
          setFailedUploads(prev => ({
            ...prev,
            [jobId]: {
              message: msg.message,
              progress: progressData[jobId],
            },
          }));
        }

        setProgressData(prev => ({
          ...prev,
          [jobId]: progress !== prev[jobId] ? progress : prev[jobId],
        }));

        setStatusData(prev => ({
          ...prev,
          [jobId]: status,
        }));
        if (progress === 100) {
          handleFileAdded(upload);
        }
      });
    });

    return () => {
      localList.forEach(upload => {
        console.log("socket off called", upload);
        const jobId = UploadUtil.jobId(upload);
        socket.off(`${ENVConfig.FileUploadChannel}-${jobId}`);
      });
    };
  }, [localList]);

  const handleFileAdded = upload => {
    const jobId = UploadUtil.jobId(upload);
    setCompletedUploads(prev => ({
      ...prev,
      [jobId]: true,
    }));
    dispatch(setReload(!reload));
  };

  const handleCancelUpload = upload => {
    const jobId = UploadUtil.jobId(upload);
    socketRef.current.emit(`${ENVConfig.FileUploadChannel}-cancel`, { jobId });
    setLocalList(prevList =>
      prevList.filter(item => UploadUtil.jobId(item) !== jobId)
    );
    dispatch(setReload(!reload));
  };
  const handleCancelAllUploads = () => {
    localList.forEach(upload => {
      const jobId = UploadUtil.jobId(upload);
      if (!completedUploads[jobId]) {
        socketRef.current.emit(`${ENVConfig.FileUploadChannel}-cancel`, {
          jobId,
        });
      }
      socketRef.current.off(`${ENVConfig.FileUploadChannel}-${jobId}`);
    });

    setLocalList([]);
    setProgressData({});
    setStatusData({});
    setFailedUploads({});
    setCompletedUploads({});

    dispatch(setReload(!reload));
  };

  const handleRetryUpload = upload => {
    const jobId = UploadUtil.jobId(upload);
    const failedProgress = failedUploads[jobId]?.progress;
    socketRef.current.emit(`${ENVConfig.FileUploadChannel}-retry`, {
      jobId,
      progress: failedProgress,
    });

    setFailedUploads(prev => ({
      ...prev,
      [jobId]: null,
    }));
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  const completedCount = Object.keys(completedUploads).length;
  const totalCount = localList.length;

  if (Util.isNotEmpty(localList)) {
    return (
      <div className='uploads-progress-container'>
        <div className='uploads-progress-card'>
          <div
            onClick={toggleCollapse}
            className='cursor-pointer d-flex flex-row align-items-center justify-content-between'
          >
            <div className='d-flex flex-row align-items-center'>
              <div className='d-flex flex-row align-items-center'>
                <p className='fs-14'>Uploads</p>
              {!isFolder && (
                  <p
                    className={`fs-12 mx-1 ${currentUploadIndex !== null ? 'primary-color' : 'secondary-color'}`}
                  >
                    (
                    {currentUploadIndex !== null
                      ? currentUploadIndex
                      : localList.length}{' '}
                    / {localList.length})
                  </p>
              )}
              </div>
            </div>
            <div className='d-flex align-items-center gap-2'>
              <div
                className='collapse-btn black-svg w-5 h-5 p-1'
                onClick={handleCancelAllUploads}
              >
                <CloseSVG />
              </div>
              {<div className='collapse-btn black-svg'>
                {!isCollapsed ? <ArrowDownSVG /> : <ArrowUpSVG />}
              </div>}
            </div>
          </div>
          {!isCollapsed && isFolder && localList.length > 0 && (
            <div className='uploads-cell-cont-folder'>
              <HorizontalLine />
              {(() => {
                const currentIndex = currentUploadIndex ? currentUploadIndex - 1 : 0;
                const upload = localList[currentIndex];
                const jobId = UploadUtil.jobId(upload);
                const currentProgress = progressData[jobId] || 0;
                const status = completedUploads[jobId]
                  ? 'Completed'
                  : 'In Progress';
                const hasError = failedUploads[jobId];
                // folder upload UI
                return (
                  <div className='upload-item updateFolderFileProgress'>
                    <div className='uploadFolderFiles'>
                      <div className='small-icon-folder d-flex flex-row align-items-center'>
                        <FolderIconSVG />
                        <p className='fs-14'>
                          {folderName.slice(0, 10) + '...'}
                        </p>
                      </div>

                      <div className='w-fitContent'>
                        <p className='fs-12 mx-1 secondary-color'>{`(${completedCount} / ${totalCount})`}</p>
                      </div>

                      <div className='upload-info-completed flex-1 d-flex align-items-center justify-content-between'>
                        <div className='w-100 text-center'>
                          {status === 'Completed' ? (
                            <p className='fs-12 mx-1 secondary-color mb-0 d-inline-block'>
                              Completed
                            </p>
                          ) : (
                            ''
                          )}
                        </div>

                        {status === 'Completed' && (
                          <CheckCircleIcon
                            className='fade-in-scale'
                            fontSize='inherit'
                            style={{
                              color: AppColors.green,
                              width: '25px',
                              height: '25px',
                            }}
                          />
                        )}
                      </div>
                    </div>
                    {status === 'Completed' ? (
                      ''
                    ) : (
                      <div className='upload-progress-bar'>
                      <div
                        className='upload-progress'
                        style={{
                          width: `${currentProgress}%`,
                          backgroundColor: hasError
                            ? AppColors.red
                            : status === 'Completed'
                              ? AppColors.green
                              : AppColors.maroon,
                        }}
                      />
                 </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
          {/* File upload UI */}
          {!isCollapsed && !isFolder && (
            <div className='uploads-cell-cont '>
              <HorizontalLine />
              {localList.map((upload, index) => {
                console.log('upload: ', upload);
                const jobId = UploadUtil.jobId(upload);
                console.log('jobId: ', jobId);
                const currentProgress = progressData[jobId] || 0;
                console.log('currentProgress: ==>>>', currentProgress);
                console.log('DocumentUtil: ', DocumentUtil.name(upload));
                const status = completedUploads[jobId]
                  ? 'Completed'
                  : 'In Progress';
                const hasError = failedUploads[jobId];
                return (
                  <div key={index} className='upload-item'>
                    <div className='upload-info small-icon'>
                      <div className='mb-2 d-flex flex-row align-items-center justify-content-between'>
                        <div className='d-flex flex-row align-items-center'>
                          {DocumentUtil.icon(upload)}
                          <p className='upload-name'>
                            {Util.truncateText(DocumentUtil.name(upload), 10)}
                          </p>
                        </div>
                        <p className='fs-10'>{`${currentProgress}% - ${status}`}</p>
                        <div className='d-flex gap-2'>
                          <div className='d-flex gap-2'>
                            {hasError ? (
                              <div
                                className='collapse-btn black-svg w-5 h-5 p-1'
                                onClick={() => handleRetryUpload(upload)}
                              >
                                <MdRefresh />
                              </div>
                            ) : null}
                          {status === 'Completed' ? (
                              <CheckCircleIcon
                                className='fade-in-scale'
                                style={{
                                  color: AppColors.green,
                                  width: '25px',
                                  height: '25px',
                                }}
                              />
                            ) : (
                              <div
                              className='collapse-btn black-svg w-5 h-5 p-1'
                              onClick={() => handleCancelUpload(upload)}
                            >
                              <CloseSVG />
                            </div>)}
                            {/* {!isFolder && <div className='collapse-btn black-svg'>
                              {!isCollapsed ? <ArrowDownSVG /> : <ArrowUpSVG />}
                            </div>} */}
                          </div>
                        </div>
                      </div>
                      {status === "Completed" ? "" : < div className='upload-progress-bar'>
                        <div
                          className='upload-progress'
                          style={{
                            width: `${currentProgress}%`,
                            backgroundColor: hasError
                              ? AppColors.red
                              : status === 'Completed'
                                ? AppColors.green
                                : AppColors.maroon,
                          }}
                        />
                      </div>}
                    </div>
                  </div>
                );
              })}
              {localList.length === 0 && (
                <p className='uploads-empty'>No ongoing uploads.</p>
              )}
            </div>
          )}
        </div>
      </div >
    );
  } else {
    return null;
  }
};

export default UploadsProgress;
