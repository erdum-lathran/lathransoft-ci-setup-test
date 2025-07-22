import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Footer } from '../components';
import { backgroundImage } from '../static/Constants';
import { AppImages, AppRoutes } from '../static';
import { useSelector } from 'react-redux';

export default function AuthLayout() {
  // Navigator
  const navigate = useNavigate();

  // Reducer States
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    if (token) {
      navigate(AppRoutes.Home);
      return;
    }
  }, []);

  return (
    <div
      style={{
        backgroundImage: backgroundImage,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: '100vh',
      }}
    >
      <div className='container'>
        <div className='justify-content-around row align-items-center pt-5'>
          <div className='col-md-5 px-3 d-flex justify-content-center d-none d-sm-block text-center align-self'>
            {/* <LoginLogo className='login-logo' /> */}
            <img className='w-75 login-logo' src={AppImages.loginLogo} alt='' />
            <div className='py-3 w'>
              <h3 className='fw-bold'>
                {'Empower Your '}
                <span className='red-text-color'>{'Documents '}</span>
                {'With My Docs'}
              </h3>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}
