const ENVConfig = {
  BaseUrl: import.meta.env.VITE_BASE_URL, // Production
  SocketUrl: import.meta.env.VITE_SOCKET_URL, // Production
  logOutUrl: import.meta.env.VITE_APP_URL_LOGOUT,
  // BaseUrl: import.meta.env.VITE_BASE_URL_LOCAL, // Local
  // SocketUrl: import.meta.env.VITE_SOCKET_URL_LOCAL, // Local
  FileUploadChannel: import.meta.env.VITE_FILE_UPLOAD_CHANNEL,
  AppUrl: import.meta.env.VITE_APP_URL,
  S3Path: import.meta.env.VITE_S3_PATH,
  PortalUrl: import.meta.env.VITE_PORTAL_URL,
};

export default ENVConfig;
