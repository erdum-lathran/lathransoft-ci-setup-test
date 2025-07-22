let store = null;
let shareModalRef = null;
let deleteModalRef = null;
let deleteAccountModalRef = null;
let uploadModalRed = null;
let newFolderModalRef = null;
let createLinkModal = null;
let detailsModalRef = null;
let renameModalRef = null;
let moveCopyModal = null;
let docViewerModal = null;

function setStore(value) {
  store = value;
}

function getStore() {
  return store;
}

function getStoreState() {
  return store?.getState() ?? {};
}

function dispatchAction(action) {
  const { dispatch } = store;
  dispatch(action);
}

function setRenameModalRef(value) {
  renameModalRef = value;
}

function getRenameModalRef() {
  return renameModalRef;
}

function setDetailsModalRef(value) {
  detailsModalRef = value;
}

function getDetailsModalRef() {
  return detailsModalRef;
}

function setCreateLinkModal(value) {
  createLinkModal = value;
}

function getCreateLinkModal() {
  return createLinkModal;
}

function setShareModalRef(value) {
  shareModalRef = value;
}

function getShareModalRef() {
  return shareModalRef;
}

function setDocViewerModal(value) {
  docViewerModal = value;
}

function getDocViewerModal() {
  return docViewerModal;
}

function setDeleteModalRef(value) {
  deleteModalRef = value;
}
function setDeleteAccountModalRef(value) {
  deleteAccountModalRef = value;
}

function getDeleteModalRef() {
  return deleteModalRef;
}
function getDeleteAccountModalRef() {
  return deleteAccountModalRef;
}

function setUploadModalRed(value) {
  uploadModalRed = value;
}

function getUploadModalRed() {
  return uploadModalRed;
}

function setNewFolderModalRef(value) {
  newFolderModalRef = value;
}

function getNewFolderModalRef() {
  return newFolderModalRef;
}

function setMoveCopyModal(value) {
  moveCopyModal = value;
}

function getMoveCopyModal() {
  return moveCopyModal;
}

export default {
  setStore,
  getStore,
  getStoreState,
  dispatchAction,
  setRenameModalRef,
  getRenameModalRef,
  setDetailsModalRef,
  getDetailsModalRef,
  setCreateLinkModal,
  getCreateLinkModal,
  setShareModalRef,
  getShareModalRef,
  setDeleteModalRef,
  setDeleteAccountModalRef,
  getDeleteModalRef,
  getDeleteAccountModalRef,
  setUploadModalRed,
  getUploadModalRed,
  setNewFolderModalRef,
  getNewFolderModalRef,
  setMoveCopyModal,
  getMoveCopyModal,
  setDocViewerModal,
  getDocViewerModal,
};
