import React from 'react';
import { DataHandler, DocumentUtil, Util } from '../utils';
import { FormatTypes, Titles } from '../static/Constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppColors, AppRoutes } from '../static';
import { setBreadcrumbs } from '../reducer/documents';
import { setReload } from '../reducer/general';
import { Spinner } from 'react-bootstrap';
import EmptyView from './EmptyView';
import DocumentGridView from './DocumentGridView';
import DocumentListView from './DocumentListView';
import FilterComponent from './FilterComponent';
import InfiniteScroll from 'react-infinite-scroll-component';
import ScrollToTopButton from './ScrollToTop';
import NetworkRequests from '../netwroking/NetworkRequests';

export default function DocumentWrapper({
  data = [],
  isLoading = false,
  fetchMoreData, // Added for triggering the next page load
  hasMore = false, // Added to indicate if more data is available
}) {
  // Navigation Items
  const navigate = useNavigate();
  const location = useLocation();

  // Dispatcher
  const dispatch = useDispatch();

  // Reducer States
  const { isGridView, reload } = useSelector(state => state.general);
  const { breadcrumbs, uploadsProgressList } = useSelector(
    state => state.documents
  );

  // Constants
  const isHomePage = location.pathname === AppRoutes.Home;

  // Handlers for document actions
  const handleCellClick = clickedItem => {
    if (DocumentUtil.type(clickedItem) === FormatTypes.Folder) {
      dispatch(setBreadcrumbs([...breadcrumbs, clickedItem]));
      navigate(
        `${AppRoutes.FolderDetails}?parent_folder_id=${DocumentUtil.id(
          clickedItem
        )}`
      );
    } else if (DocumentUtil.type(clickedItem) === FormatTypes.Link) {
      window.open(DocumentUtil.url(clickedItem), '_blank').focus();
    } else {
      DataHandler.getDocViewerModal().show({
        fileId: DocumentUtil.id(clickedItem),
      });
    }
  };

  const handleActionItemPress = (action, fileFolder) => {
    const { title } = action;
    switch (title) {
      case Titles.Details:
        DataHandler.getDetailsModalRef().show({ fileFolder });
        break;
      case Titles.Rename:
        DataHandler.getRenameModalRef().show({ fileFolder });
        break;
      case Titles.Share:
        DataHandler.getShareModalRef().show({ fileFolder });
        break;
      case Titles.Delete:
        DataHandler.getDeleteModalRef().show({ fileFolder });
        break;
      case Titles.Download:
        if (fileFolder.type === 'file') {
          handleDownload(fileFolder);
        } else if (fileFolder.type === 'folder') {
          handleFolderDownload(fileFolder.id);
        }
        break;
      case Titles.MoveTo:
        DataHandler.getMoveCopyModal().show({
          fileFolder,
          isMoving: true,
        });
        break;
      case Titles.CopyTo:
        DataHandler.getMoveCopyModal().show({ fileFolder });
        break;
      case Titles.Favourite:
        handleFavorite(fileFolder);
        break;
      case Titles.Unfavourite:
        handleUnfavorite(fileFolder);
        break;
      case Titles.Archive:
        handleArchive(fileFolder);
        break;
      case Titles.Unarchive:
        handleUnArchive(fileFolder);
        break;
      case Titles.Restore:
        handleRestore(fileFolder);
        break;
      case Titles.DeleteForever:
        handleDeleteForever(fileFolder);
        break;
      default:
        break;
    }
  };
  // const handleDownload = fileFolder => {
  //   const url = DocumentUtil.key(fileFolder); 
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = '';
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };
  const handleDownload = async (fileFolder) => {
    const url = DocumentUtil.key(fileFolder);
    try {
      const response = await fetch(url, {
        mode: 'cors'
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const filename = fileFolder.name || 'downloaded_file';
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('❌ Download failed:', err);
      alert('Download failed. Check console for details.');
    }
  };

  const handleFolderDownload = async folderId => {
    try {
      const blob = await NetworkRequests.downloadFolder(folderId);
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'folder.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      alert('Failed to download folder.');
    }
  };

  const handleFavorite = fileFolder => {
    NetworkRequests.favoriteFilesFolder(getDocumentIdsBody(fileFolder), () => {
      dispatch(setReload(!reload));
    });
  };

  const handleUnfavorite = fileFolder => {
    NetworkRequests.unfavoriteFilesFolder(
      getDocumentIdsBody(fileFolder),
      () => {
        dispatch(setReload(!reload));
      }
    );
  };

  const handleArchive = fileFolder => {
    NetworkRequests.archiveFilesFolder(getDocumentIdsBody(fileFolder), () => {
      dispatch(setReload(!reload));
    });
  };

  const handleUnArchive = fileFolder => {
    NetworkRequests.unarchiveFilesFolder(getDocumentIdsBody(fileFolder), () => {
      dispatch(setReload(!reload));
    });
  };

  const handleRestore = fileFolder => {
    NetworkRequests.restoreFilesFolders(getDocumentIdsBody(fileFolder), () => {
      dispatch(setReload(!reload));
    });
  };

  const handleDeleteForever = fileFolder => {
    NetworkRequests.deleteFilesFoldersForever(
      getDocumentIdsBody(fileFolder),
      () => {
        dispatch(setReload(!reload));
      }
    );
  };

  const getDocumentIdsBody = fileFolder => ({
    documentIds: [DocumentUtil.id(fileFolder)],
  });

  const BinNestedHeader = () => {
    if (location.pathname === AppRoutes.Deleted && Util.isNotEmpty(data)) {
      return (
        <div className='p-delete-description'>
          Items in the bin will be deleted forever after 30 days
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <FilterComponent />
      <div className='layout-container'>
        <BinNestedHeader />
        {Util.isNotEmpty(data) && isHomePage && (
          <p className='recent-heading'>Recents</p>
        )}
        <InfiniteScroll
          initialScrollY={8}
          dataLength={data.length}
          next={fetchMoreData}
          hasMore={hasMore}
          scrollThreshold={0.8}
          loader={
            <div className='text-center mb-2'>
              <Spinner animation='border' style={{ color: AppColors.maroon }} />
            </div>
          }
        >
          {isLoading ? (
            <div className='text-center mb-2'>
              <Spinner animation='border' style={{ color: AppColors.maroon, marginTop: "20px" }} />
            </div>
          ) : Util.isEmpty(data) ? (
            <EmptyView />
          ) : isGridView ? (
            <DocumentGridView
              data={data}
              onCellPress={handleCellClick}
              onActionPress={handleActionItemPress}
            />
          ) : (
            <DocumentListView
              data={data}
              onCellPress={handleCellClick}
              onActionPress={handleActionItemPress}
            />
          )}
        </InfiniteScroll>
        <ScrollToTopButton />
      </div>
    </>
  );
}
