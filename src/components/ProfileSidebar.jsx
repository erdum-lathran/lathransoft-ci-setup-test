import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DataHandler } from '../utils';
import { useEffect } from 'react';

export const profileLinks = [
  { label: 'Edit Profile', path: '/auth/profile' },
  { label: 'Password & Security', path: '/auth/profile/password-security' },
  { label: 'Activity Logs', path: '/auth/profile/activity-logs' },
  { label: 'Help Center', path: '/auth/profile/help' },
  { label: 'Delete Account', danger: true },
];

export default function ProfileSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalReady, setIsModalReady] = React.useState(false);

  const navigableLinks = profileLinks.filter(link => link.path);

  const currentIndex = navigableLinks.findIndex(
    link => link.path === location.pathname
  );

  const currentTab = navigableLinks[currentIndex] || navigableLinks[0];

  useEffect(() => {
    const modalRef = DataHandler.getDeleteAccountModalRef();
    if (modalRef) {
      setIsModalReady(true);
    }
  }, []);

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % navigableLinks.length;
    navigate(navigableLinks[nextIndex].path);
  };

  const handlePrev = () => {
    const prevIndex =
      (currentIndex - 1 + navigableLinks.length) % navigableLinks.length;
    navigate(navigableLinks[prevIndex].path);
  };

  const handleDeleteAccount = () => {
    const modalRef = DataHandler.getDeleteAccountModalRef();
    if (modalRef && typeof modalRef.show === 'function') {
      modalRef.show();
    } else {
      console.warn('DeleteAccountModalRef not ready yet');
    }
  };

  return (
    <>
      <div className='d-flex d-md-none justify-content-between align-items-center mb-3 px-2'>
        <button onClick={handlePrev} className='btn btn-light btn-sm'>
          &#8592;
        </button>
        <div
          className={`fw-medium text-center ${
            currentTab.danger ? 'text-danger' : ''
          }`}
        >
          {currentTab.label}
        </div>
        <button onClick={handleNext} className='btn btn-light btn-sm'>
          &#8594;
        </button>
      </div>
      <div className='d-none d-md-block profile-sidebar ps-2'>
        {profileLinks.map((link, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (link.label === 'Delete Account') {
                handleDeleteAccount();
              } else if (link.path) {
                navigate(link.path);
              }
            }}
            className={`d-block py-2 px-3 rounded text-start text-decoration-none fw-medium w-100 border-0 bg-transparent ${
              link.path === location.pathname ? 'active-tab' : 'inactive-tab'
            } ${link.danger ? 'text-danger' : ''}`}
            style={link.danger ? { color: '#FF0000' } : {}}
          >
            {link.label}
          </button>
        ))}
      </div>
    </>
  );
}
