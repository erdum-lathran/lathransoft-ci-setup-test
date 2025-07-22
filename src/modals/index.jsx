import React from 'react';
import ShareModal from './ShareModal';
import CreateLinkModal from './CreateLinkModal';
import NewFolderModal from './NewFolderModal';
import UploadModal from './UploadModal';
import DetailsModal from './DetailsModal';
import RenameModal from './RenameModal';
import DeleteModal from './DeleteModal';
import DeleteAccountModal from './DeleteAccountModal';
import MoveCopyModal from './MoveCopyModal';
import DocViewerModal from './DocViewerModal';
import { DataHandler } from '../utils';

export default function AppModals() {
  return (
    <>
      <DeleteAccountModal ref={ref => DataHandler.setDeleteAccountModalRef(ref)} />
      <DeleteModal ref={ref => DataHandler.setDeleteModalRef(ref)} />
      <RenameModal ref={ref => DataHandler.setRenameModalRef(ref)} />
      <DetailsModal ref={ref => DataHandler.setDetailsModalRef(ref)} />
      <CreateLinkModal ref={ref => DataHandler.setCreateLinkModal(ref)} />
      <NewFolderModal ref={ref => DataHandler.setNewFolderModalRef(ref)} />
      <UploadModal ref={ref => DataHandler.setUploadModalRed(ref)} />
      <MoveCopyModal ref={ref => DataHandler.setMoveCopyModal(ref)} />
      <ShareModal ref={ref => DataHandler.setShareModalRef(ref)} />
      <DocViewerModal ref={ref => DataHandler.setDocViewerModal(ref)} />
    </>
  );
}
