import NetworkManager from './index';
import { DataHandler } from '../utils';
import { clearStoreLogout, setToken, setUser, setUsersList } from '../reducer/auth';
import { purgePersistedState } from '../store';
import { clearStore, setApplications } from '../reducer/general';
import {
  clearStoreLogoutDocuments,
  setDocumentsList,
  setSelectedItems,
  setUploadsProgress,
} from '../reducer/documents';
import {
  LOGIN,
  LOGOUT,
  GET_PROFILE,
  GET_DOCUMENTS,
  CREATE_FOLDER,
  UPLOAD_FILES,
  UPLOAD_FOLDER,
  CREATE_LINK,
  DELETE_FILES_FOLDERS,
  RESTORE_FILES_FOLDERS,
  DELETE_FILES_FOLDERS_FOREVER,
  ARCHIVE_FILES_FOLDERS,
  UNARCHIVE_FILES_FOLDERS,
  FAVOURITE_FILES_FOLDERS,
  UNFAVOURITE_FILES_FOLDERS,
  SHARE_FILES_FOLDERS,
  RENAME_FILE_FOLDER,
  COPY_FILES_FOLDERS,
  MOVE_FILES_FOLDERS,
  GET_USERS,
  FOLDERS_LIST,
  EMPTY_TRASH,
  GET_APPLICATIONS,
  UPDATE_PROFILE,
  CHANGE_PASSWORD,
  REGISTER,
  FORGOT_PASSWORD,
  DOWNLOAD,
  DOWNLOAD_FOLDER
} from './webServices';

class NetworkRequests {
  // Auth APIs

  async logout(callback = () => { }) {
    try {
      const { data } = await NetworkManager.post(LOGOUT);
      DataHandler.dispatchAction(clearStoreLogout());
      DataHandler.dispatchAction(clearStoreLogoutDocuments());
      DataHandler.dispatchAction(clearStore());
      callback(data);
    } catch (error) {
      throw error;
    }
  }

  async login(body, callback = () => { }) {
    try {
      const { data } = await NetworkManager.post(LOGIN, body);
      const { user, access_token } = data;
      DataHandler.dispatchAction(setUser(user));
      DataHandler.dispatchAction(setToken(access_token));
      callback(data);
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(body, callback = () => { }) {
    try {
      const { data } = await NetworkManager.post(FORGOT_PASSWORD, body);
      callback(data);
    } catch (error) {
      throw error;
    }
  }

  async register(body, callback = () => { }) {
    try {
      const { data } = await NetworkManager.post(REGISTER, body);
      callback(data);
    } catch (error) {
      throw error;
    }
  }

  async getUsersList(callback = () => { }) {
    try {
      const { data } = await NetworkManager.get(GET_USERS);
      DataHandler.dispatchAction(setUsersList(data));
      callback(data);
    } catch (error) {
      throw error;
    }
  }

  async getUserProfile(callback = () => { }) {
    try {
      const { data } = await NetworkManager.get(GET_PROFILE);
      DataHandler.dispatchAction(setUser(data));
      callback(data);
    } catch (error) {
      throw error;
    }
  }

  async updateUserProfile(body, callback = () => { }) {
    try {
      const { data } = await NetworkManager.post(UPDATE_PROFILE, body);
      DataHandler.dispatchAction(setUser(data));
      callback(data);
    } catch (error) {
      throw error;
    }
  }

  async changePassword(body, callback = () => { }) {
    try {
      const { data } = await NetworkManager.post(CHANGE_PASSWORD, body);
      callback(data);
    } catch (error) {
      throw error;
    }
  }

  // General APIs

  async getApplications(callback = () => { }) {
    try {
      const { data } = await NetworkManager.get(GET_APPLICATIONS);
      DataHandler.dispatchAction(setApplications(data));
      callback(data);
    } catch (error) {
      throw error;
    }
  }

  // Documents APIs
  async getFoldersList(paramsData) {
    try {
      const { data } = await NetworkManager.get(FOLDERS_LIST, {
        params: paramsData,
      });
      return data || [];
    } catch (error) {
      throw error;
    }
  }

  async getDocumentsList(location, paramsData) {
    let endpoint = GET_DOCUMENTS;

    let finalParams = { parentId: '0' };

    Object.entries(paramsData).forEach(([key, value]) => {
      if (value) {
        finalParams[key] = value;
      }
    });
    try {
      DataHandler.dispatchAction(setSelectedItems([]));
      const { data } = await NetworkManager.get(endpoint, {
        params: finalParams,
      });
      const { documents } = data;
      DataHandler.dispatchAction(setDocumentsList(documents));
      return data || [];
    } catch (error) {
      throw error;
    }
  }

  async createFolder(body, callback = () => { }) {
    try {
      const { data } = await NetworkManager.post(CREATE_FOLDER, body);
      callback(data);
    } catch (error) {
      throw error;
    }
  }

  async uploadFiles(body, callback = () => { }) {
    try {
      const { data } = await NetworkManager.post(UPLOAD_FILES, body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      DataHandler.dispatchAction(setUploadsProgress(data));

      // Chaipi
      setTimeout(() => {
        DataHandler.dispatchAction(setUploadsProgress([]));
      }, 1000);
      callback(data);
    } catch (error) {
      throw error;
    }
  }

  async createLink(body, callback = () => { }) {
    try {
      const { data } = await NetworkManager.post(CREATE_LINK, body);
      callback(data);
    } catch (error) {
      throw error;
    }
  }

  async renameFileFolder(body, id, callback = () => { }) {
    try {
      const { data } = await NetworkManager.patch(
        `${RENAME_FILE_FOLDER}${id}`,
        body
      );
      callback(data);
    } catch (error) {
      throw error;
    }
  }

  async favoriteFilesFolder(body, callback = () => { }) {
    try {
      const { data } = await NetworkManager.patch(
        FAVOURITE_FILES_FOLDERS,
        body
      );
      callback(data);
    } catch (error) {
      throw error;
    }
  }

  async unfavoriteFilesFolder(body, callback = () => { }) {
    try {
      const { data } = await NetworkManager.patch(
        UNFAVOURITE_FILES_FOLDERS,
        body
      );
      callback(data);
    } catch (error) {
      throw error;
    }
  }

  async archiveFilesFolder(body, callback = () => { }) {
    try {
      const { data } = await NetworkManager.patch(ARCHIVE_FILES_FOLDERS, body);
      callback(data);
    } catch (error) {
      throw error;
    }
  }

  async unarchiveFilesFolder(body, callback = () => { }) {
    try {
      const { data } = await NetworkManager.patch(
        UNARCHIVE_FILES_FOLDERS,
        body
      );
      callback(data);
    } catch (error) {
      throw error;
    }
  }

  async deleteFilesFolders(body, callback = () => { }) {
    try {
      const { data } = await NetworkManager.patch(DELETE_FILES_FOLDERS, body);
      callback(data);
    } catch (error) {
      throw error;
    }
  }

  async deleteFilesFoldersForever(body, callback = () => { }) {
    try {
      const { data } = await NetworkManager.delete(
        DELETE_FILES_FOLDERS_FOREVER,
        { data: body }
      );
      callback(data);
    } catch (error) {
      throw error;
    }
  }

  async restoreFilesFolders(body, callback = () => { }) {
    try {
      const { data } = await NetworkManager.patch(RESTORE_FILES_FOLDERS, body);
      callback(data);
    } catch (error) {
      throw error;
    }
  }

  async emptyTrash(callback = () => { }) {
    try {
      const { data } = await NetworkManager.delete(EMPTY_TRASH);
      callback(data);
    } catch (error) {
      throw error;
    }
  }

  async shareFilesFolders(body, callback = () => { }) {
    try {
      const { data } = await NetworkManager.post(SHARE_FILES_FOLDERS, body);
      callback(data);
    } catch (error) {
      throw error;
    }
  }

  async copyFilesFolders(body, callback = () => { }) {
    try {
      const { data } = await NetworkManager.post(COPY_FILES_FOLDERS, body);
      callback(data);
    } catch (error) {
      throw error;
    }
  }

  async moveFilesFolders(body, callback = () => { }) {
    try {
      const { data } = await NetworkManager.patch(MOVE_FILES_FOLDERS, body);
      callback(data);
    } catch (error) {
      throw error;
    }
  }

  async bulkDownload(idsArray) {
    try {
      const idsParam = encodeURIComponent(idsArray.join(','));
      const response = await NetworkManager.get(`${DOWNLOAD}?ids=${idsParam}`, {
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
  async downloadFolder(folderId) {
    try {
      const response = await NetworkManager.get(`${DOWNLOAD_FOLDER}?folderId=${folderId}`, {
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      console.error('Download folder failed', error);
      throw error;
    }
  }
  // Pending APIs

  async downloadFilesFolders(body, callback = () => { }) {
    try {
      const { data } = await NetworkManager.post(SHARE_FILES_FOLDERS, body);
      callback(data);
    } catch (error) {
      throw error;
    }
  }

  async uploadFolder(body, callback = () => { }) {
    try {
      const { data } = await NetworkManager.post(UPLOAD_FOLDER, body);
      callback(data);
    } catch (error) {
      throw error;
    }
  }
}

export default new NetworkRequests();
