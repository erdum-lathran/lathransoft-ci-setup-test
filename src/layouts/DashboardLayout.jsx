import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Footer, Header, SideBar, UploadsProgress } from '../components';
import { useDispatch, useSelector } from 'react-redux';
import { AppRoutes } from '../static';
import AppModals from '../modals';
import { DataHandler } from '../utils';
import NetworkRequests from '../netwroking/NetworkRequests';
import { setLogout, setToken, setAppToken, setEmail} from '../reducer/auth';
import ENVConfig from '../configs/ENVConfig';
import { persistor } from '../store';

export default function DashboardLayout() {
  // Reducer States
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { token, isLoggedOut } = useSelector(state => state.auth);

  // useEffect(() => {
  //   if (!token) {
  //     navigate(AppRoutes.Login);
  //   }
  // });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    console.log('URLSearchParams:', params.toString());
    let didModifyParams = false;
    const paramActions = {
      token: setToken,
      appToken: setAppToken,
      email: setEmail,
    };

    Object.entries(paramActions).forEach(([key, action]) => {
      const value = params.get(key);

      if (value) {
        dispatch(action(value));
        params.delete(key);
        didModifyParams = true;
      }
    });

    if (didModifyParams) {
      console.log(`Redirecting: ${location.pathname}`);
      navigate(`${location.pathname}`);
      return;

    } else if (isLoggedOut && !didModifyParams) {
      console.log(`Redirecting: ${ENVConfig.logOutUrl}`);
      DataHandler.dispatchAction(setLogout());
      persistor.flush().then(() => {
        window.location.href = ENVConfig.logOutUrl
        // navigate(ENVConfig.logOutUrl);
      });
      return; 

    } else if (!token) {
      console.log(`Redirecting: ${ENVConfig.AppUrl}`);
      window.location.href = ENVConfig.AppUrl;
      return;
    }

    handleGetApplications();
    handleGetUserProfile();
    handleGetUsersList();
 }, [location.search, navigate, token, dispatch, isLoggedOut]);

  const handleGetApplications = () => {
    NetworkRequests.getApplications(response => {});
  };

  const handleGetUserProfile = () => {
    NetworkRequests.getUserProfile(response => {});
  };

  const handleGetUsersList = () => {
    NetworkRequests.getUsersList(response => {});
  };
  return (
    <div>
      <AppModals />
      <Header />
      <div className='d-flex gap-2'>
        <SideBar />
        <div className='content-wrapper'>
          <Outlet />
        </div>
      </div>
      <UploadsProgress />
      <Footer />
    </div>
  );
}
