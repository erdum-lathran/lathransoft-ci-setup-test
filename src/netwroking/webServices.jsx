// Authentication Services

export const LOGIN = 'auth/login';
export const REGISTER = 'auth/register';
export const LOGOUT = 'auth/logout';
export const GET_PROFILE = 'auth/get-profile';
export const UPDATE_PROFILE = 'auth/update-profile';
export const CHANGE_PASSWORD = 'auth/change-password';
export const FORGOT_PASSWORD = 'auth/forgot-password';

// Documents Services
export const FOLDERS_LIST = 'document/folders';
export const GET_DOCUMENTS = 'document';
export const CREATE_FOLDER = 'document/folder/create';
export const UPLOAD_FILES = 'document/file/upload';
export const CREATE_LINK = 'document/link/create';
export const DELETE_FILES_FOLDERS = 'document/soft-delete';
export const DELETE_FILES_FOLDERS_FOREVER = 'document/permenent-delete';
export const ARCHIVE_FILES_FOLDERS = 'document/archive';
export const UNARCHIVE_FILES_FOLDERS = 'document/un-archive';
export const FAVOURITE_FILES_FOLDERS = 'document/favorite';
export const UNFAVOURITE_FILES_FOLDERS = 'document/un-favorite';
export const RENAME_FILE_FOLDER = 'document/rename/';
export const RESTORE_FILES_FOLDERS = 'document/restore';
export const EMPTY_TRASH = 'document/empty-trash';
export const MOVE_FILES_FOLDERS = 'document/move';
export const SHARE_FILES_FOLDERS = 'document/share';
export const COPY_FILES_FOLDERS = 'document/copy';
export const DOWNLOAD ='document/download';
export const DOWNLOAD_FOLDER ='document/download-folder';
export const UPLOAD_FOLDER = 'document'; // Need to add

// General Services
export const GET_APPLICATIONS = 'general/applications';

// Users Services
export const GET_USERS = 'users';
