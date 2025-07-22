import ENVConfig from '../configs/ENVConfig';

const AppRoutes = {
  Home: '/',
  MyFolders: '/myfolders',
  AcessDenied: '/access-denied',
  Shared: '/shared',
  MyDocs: '/my-documents',
  Upload: '/upload',
  Favourites: '/favourites',
  Deleted: '/deleted',
  Archived: '/archived',
  DocsViewer: '/docs-viewer',
  FolderDetails: '/folder-detail',
  Auth: '/auth',
  Login: '/auth/login',
  Profile: '/auth/profile',
  PasswordSecurity: 'password-security',
  ActivityLogs: 'activity-logs',
  SignUp: '/auth/sign-up',
  ResetConfirmation: '/auth/reset-confirmation',
  ResetPassword: '/auth/reset-password',
  NoInternet: '/no-internet',
  NotFound: '*',
  PortalProfilePage: `${ENVConfig.PortalUrl}admin/user_info`
};

export default AppRoutes;
