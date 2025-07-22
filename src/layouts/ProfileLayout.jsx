import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Footer, Header, SideBar } from '../components';
import ProfileSidebar, { profileLinks } from '../components/ProfileSidebar';
import { useSelector } from 'react-redux';
import { AppRoutes } from '../static';
import { ArrowLeftSVG } from '../static/svgs';
import AppModals from '../modals';

export default function ProfileLayout() {
  const { token } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const currentTitle =
    profileLinks.find(link => link.path === location.pathname)?.label ||
    'Edit Profile';

  return (
    <div>
      <AppModals />
      <Header />
      <div className='d-flex'>
        <SideBar />
        <div className='flex-grow-1 p-2'>
          <button
            onClick={() => navigate(AppRoutes.Home)}
            className='back-button mb-3'
          >
            <ArrowLeftSVG /> Back to Home
          </button>

          <div className='bg-white rounded shadow-sm pt-4'>
            <h6 className='text-xl font-semibold text-gray-800 mb-3 ms-4'>
              {currentTitle}
            </h6>
            <hr />

            <div className='d-md-flex gap-3'>
              <div className='mb-3 mb-md-0' style={{ flex: '0 0 20%' }}>
                <ProfileSidebar />
              </div>

              <div className='flex-grow-1 ms-4'>
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
