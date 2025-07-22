import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumbs, Typography } from '@mui/material';
import { setBreadcrumbs } from '../reducer/documents';
import { useDispatch, useSelector } from 'react-redux';
import { DocumentUtil, UserUtil, Util } from '../utils';
import { setShowMenu } from '../reducer/general';
import { get } from 'lodash';
import { AppRoutes } from '../static';
import {
  ArrowLeftSVG,
  LogoSVG,
  LogoutSVG,
  PersonSVG,
  IWantHubLogoSVG,
  AppsSVG,
  NotificationsSVG,
  MenuSVG,
  ProfileSVG,
} from '../static/svgs';
import NetworkRequests from '../netwroking/NetworkRequests';
import ENVConfig from '../configs/ENVConfig';
import ChatLogo from '../../public/assets/images/chatLogo.png';
import SurveyLogo from '../../public/assets/images/surveyLogo.png';
import profileImage from '../../public/assets/images/defaultProfileImage.svg';

export default function Header() {
  //Dispatcher
  const dispatch = useDispatch();

  // Navigator
  const location = useLocation();
  const navigate = useNavigate();

  // Reducer States
  const { user, token, appToken, email } = useSelector(state => state.auth);
  const { breadcrumbs } = useSelector(state => state.documents);
  const { applications, showMenu } = useSelector(state => state.general);

  // Local States

  // Constants
  const REACT_APP_SSO = false;
  const isSeperateApp = false;
  const notifications = [];

  const profileDropdownData = [
    {
      title: 'Profile',
      icon: <ProfileSVG />,
      onClick: () => {
        // navigate(AppRoutes.Profile);
        window.open(AppRoutes.PortalProfilePage, '_blank');
      },
    },
    {
      title: 'Log Out',
      icon: <LogoutSVG />,
      onClick: () => {
        NetworkRequests.logout(res => {
          window.location.href = res.url
          console.log('res.url:', res.url);
        });
      },
    },
  ];

  useEffect(() => {
    console.log('appToken from URL', appToken);
    console.log('Token from URL', token);
    console.log('email from URL', email);
  }, [appToken, token, email])

  const getAppIconSVG = app => {
    const { application_name } = app;

    if (
      !application_name ||
      typeof application_name.toLowerCase !== 'function'
    ) {
      return null;
    }

    const lowerCaseName = application_name.toLowerCase();

    if (lowerCaseName.includes('chat')) {
      return <img src={ChatLogo} alt="Chat Logo" style={{ width: '50px', height: '50px' }} />;
    }
    if (lowerCaseName.includes('survey')) {
      return <img src={SurveyLogo} alt="Survey Logo" style={{ width: '50px', height: '50px' }} />;
    }
    if (lowerCaseName.includes('docs')) {
      return <LogoSVG />;
    }
    return null;
  };

  const handleAppClick = app => {
    if (app.application_url) {
      const queryParams = new URLSearchParams({
        token: appToken,
        application_code: app.application_code,
        email: email,
      });
      console.log(queryParams.toString(), 'query params')
      const finalURL = `${app.application_url}?${queryParams.toString()}`;
      console.log('Redirect url', finalURL)
      window.location.href = finalURL;
    } else {
      console.warn(`Application ${app.application_name} does not have a valid URL.`);
    }
  };

  const handleBreadCrumbs = clickedItem => {
    const route = get(clickedItem, 'route', null);
    if (DocumentUtil.id(clickedItem)) {
      const clickedItemIndex = breadcrumbs.findIndex(
        item => DocumentUtil.id(item) == DocumentUtil.id(clickedItem)
      );
      dispatch(setBreadcrumbs([...breadcrumbs.slice(0, clickedItemIndex + 1)]));
      navigate(
        `${AppRoutes.FolderDetails}?parent_folder_id=${DocumentUtil.id(clickedItem)}`
      );
    } else if (route) {
      dispatch(setBreadcrumbs([...breadcrumbs.slice(0, 2)]));
      navigate(route);
    }
  };
  const handleBreadcrumbBack = () => {
    const isRootLevel = breadcrumbs.length <= 2;
    const lastCrumb = breadcrumbs[breadcrumbs.length - 2];

    if (isRootLevel) {
      const targetUrl = breadcrumbs[0]?.LathranUrl;
      targetUrl.startsWith('http')
        ? (window.location.href = targetUrl)
        : navigate(targetUrl);
    } else {
      const newCrumbs = breadcrumbs.slice(0, -1);
      dispatch(setBreadcrumbs(newCrumbs));
      const targetRoute = DocumentUtil.id(lastCrumb)
        ? `${AppRoutes.FolderDetails}?parent_folder_id=${DocumentUtil.id(lastCrumb)}`
        : lastCrumb.route || AppRoutes.Home;
      navigate(targetRoute);
    }
  };

  return (
    <div className='border-bottom p-2'>
      {/* Show in Desktop */}
      <div className='desktop-only'>
        <div className='w-100 justify-content-between d-flex'>
          <div className='d-flex mr-5'>
            <div className='mt-2 me-3 cursor-pointer' onClick={handleBreadcrumbBack}>
              <ArrowLeftSVG />
            </div>
            <div
              className='me-1'
              onClick={() => {
                navigate(AppRoutes.Home),
                  dispatch(setBreadcrumbs([...breadcrumbs.slice(0, 3)]));
              }}
            >
              {isSeperateApp ? <IWantHubLogoSVG /> : <LogoSVG />}
            </div>
            <div className='ml-7 mt-2 ps-3 font-size w-100'>
              <p className='fw-bold mb-0  color-[#3f4254] custom-font'>{'Docs'}</p>
              <Breadcrumbs maxItems={4} separator='/' aria-label='breadcrumb'>
                {breadcrumbs
                  .filter(item => Util.isNotEmpty(item))
                  .map((item, index) => {
                    const { name, id, LathranUrl } = item;
                    const isLast = index == breadcrumbs.length - 1;
                    const isFirst = index == 0;
                    const fontWeightClass = isLast
                      ? 'fw-bold'
                      : isFirst
                        ? 'app-title-text'
                        : 'fw-normal';
                    const cursor = index > -1 ? 'cursor-pointer' : '';
                    return (
                      <div
                        key={index}
                        onClick={() => {
                          if (LathranUrl) {
                            window.location.href = LathranUrl;
                          } else {
                            handleBreadCrumbs(item);
                          }
                        }}
                      >
                        <Typography
                          color='textPrimary custom-font'
                          className={`font-size ${fontWeightClass} ${cursor}`}
                        >
                          {name}
                        </Typography>
                      </div>
                    );
                  })}
              </Breadcrumbs>
            </div>
          </div>
          <div className='d-flex mt-1'>
            {!REACT_APP_SSO && (
              <div
                className='me-3'
                data-toggle='dropdown'
                data-offset='10px,0px'
              >
                <div className='dropdown-toggle cursor-pointer btn-group'>
                  <div className='svg-bg' data-bs-toggle='dropdown'>
                    <AppsSVG />
                  </div>
                  <div className='dropdown-menu dropdown-menu-lg border-0 custom-dropdown apps-border'>
                    <p className='py-2 px-3 custom-font'>Apps</p>
                    <hr className='dropdown-divider' />
                    <div className='grid-container'>
                      {applications?.map((item, index) => {
                        const { application_name } = item;
                        return (
                          <div
                            key={index}
                            className='text-center pt-3 px-2 pb-4 cursor-pointer'
                            onClick={() => handleAppClick(item)}
                          >
                            <div className='image-container'>
                              {getAppIconSVG(item)}
                              <p className='font-size custom-font pt-2'>
                                {application_name}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className='col-md-12 d-flex justify-content-center pb-3 pt-2'>
                      <p
                        className=' primary-color fs-14'
                        onClick={() => {
                          window.location.href = ENVConfig.AppUrl;
                        }}
                      >
                        Back to LathranSuite
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className='dropdown mr-5 me-3'>
              <div className='cursor-pointer svg-bg' data-bs-toggle='dropdown'>
                <NotificationsSVG />
              </div>
              <ul className='border-0 apps-border dropdown-menu'>
                {Util.isNotEmpty(notifications) ? (
                  notifications.map((item, index) => {
                    const { title, onClick } = item;
                    return (
                      <li key={index}>
                        <button
                          className='dropdown-item color-hover'
                          onClick={onClick}
                        >
                          <div className='d-flex flex-row'>
                            {/* {icon} */}
                            <p className='small'>{title}</p>
                          </div>
                        </button>
                      </li>
                    );
                  })
                ) : (
                  <p className='text-center fs-14'>No Notifications</p>
                )}
              </ul>
            </div>
            <span className='align-items-end d-flex flex-column me-3'>
              <span className='username'>{UserUtil.firstName(user)}</span>
              <span className='role'>{UserUtil.role(user)}</span>
            </span>
            <div className='dropdown'>
              <div className='cursor-pointer' data-bs-toggle='dropdown'>
                <img
                  src={user?.profileImage ?? `https://ui-avatars.com/api/?name=${user?.firstName} ${user?.lastName}&size=100&rounded=true&color=fff&background=random`}
                  alt='User Profile'
                  style={{
                    width: '40px',
                    height: '40px',
                    marginRight: "8px",
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                />
              </div>
              <ul className='border-0 apps-border dropdown-menu dropdown-menu-profile'>
                {profileDropdownData.map((item, index) => {
                  const { title, icon, onClick } = item;
                  return (
                    <li key={index}>
                      <button
                        className='dropdown-item color-hover p-2'
                        onClick={onClick}
                      >
                        <div className='profile-dropdown'>
                          {/* {icon} */}
                          <p className='small'>{title}</p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className='mobile-only'>
        <div className='d-flex flex-column gap-2'>
          <div className='d-flex column-gap-2 align-items-center'>
            <div onClick={() => navigate(AppRoutes.Home)}>
              {isSeperateApp ? <IWantHubLogoSVG /> : <LogoSVG />}
            </div>
            <div className='font-size'>
              <div className='d-flex'>
                <Breadcrumbs maxItems={3} separator='/' aria-label='breadcrumb'>
                  {breadcrumbs
                    .filter(item => Util.isNotEmpty(item))
                    .map((item, index) => {
                      const { name, id, LathranUrl } = item;
                      const isLast = index == breadcrumbs.length - 1;
                      const isFirst = index == 0;
                      const fontWeightClass = isLast
                        ? 'fw-bold'
                        : isFirst
                          ? 'app-title-text'
                          : 'fw-normal';
                      const cursor = id ? 'cursor-pointer' : '';
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            if (LathranUrl) {
                              window.location.href = LathranUrl;
                            } else {
                              handleBreadCrumbs(item);
                            }
                          }}
                        >
                          <Typography
                            color='textPrimary custom-font'
                            className={`font-size ${fontWeightClass} ${cursor}`}
                            onClick={() => { }}
                          >
                            {name}
                          </Typography>
                        </div>
                      );
                    })}
                </Breadcrumbs>
              </div>
            </div>
          </div>
          <div className='d-flex flex-row justify-content-end'>
            <div className='dropdown mr-5 me-3'>
              <div
                onClick={() => {
                  dispatch(setShowMenu(!showMenu));
                }}
                className='cursor-pointer small-icon svg-bg'
                id='toggle-button'
              >
                <MenuSVG />
              </div>
            </div>
            {!REACT_APP_SSO && (
              <div
                className='me-3'
                data-toggle='dropdown'
                data-offset='10px,0px'
              >
                <div className='dropdown-toggle cursor-pointer btn-group'>
                  <div className='svg-bg' data-bs-toggle='dropdown'>
                    <AppsSVG />
                  </div>
                  <div className='dropdown-menu dropdown-menu-lg border-0 custom-dropdown apps-border'>
                    <p className='px-3 custom-font'>Apps</p>
                    <hr className='dropdown-divider' />
                    <div className='grid-container'>
                      {applications?.map((item, index) => {
                        const { application_name } = item;
                        return (
                          <div
                            key={index}
                            className='text-center p-3 pb-0 cursor-pointer'
                            onClick={() => handleAppClick(item)}
                          >
                            <div className='image-container'>
                              {getAppIconSVG(item)}
                              <p className='font-size custom-font pb-3'>
                                {application_name}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className='col-md-12 d-flex justify-content-center p-3'>
                      <p
                        className=' primary-color fs-14'
                        onClick={() => {
                          window.location.href = ENVConfig.AppUrl;
                        }}
                      >
                        Back to LathranSuite
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className='dropdown mr-5 me-3'>
              <div className='cursor-pointer svg-bg' data-bs-toggle='dropdown'>
                <NotificationsSVG />
              </div>
              <ul className='border-0 apps-border dropdown-menu'>
                {Util.isNotEmpty(notifications) ? (
                  notifications.map((item, index) => {
                    const { title, onClick } = item;
                    return (
                      <li key={index}>
                        <button
                          className='dropdown-item color-hover'
                          onClick={onClick}
                        >
                          <div className='profile-dropdown'>
                            {/* {icon} */}
                            <p className='small'>{title}</p>
                          </div>
                        </button>
                      </li>
                    );
                  })
                ) : (
                  <p className='text-center fs-14'>No Notifications</p>
                )}
              </ul>
            </div>
            <div className='dropdown'>
              <div className='cursor-pointer' data-bs-toggle='dropdown'>
                <img
                  src={user?.profileImage ?? `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastame}&size=100&rounded=true&color=fff&background=random`}
                  alt='User Profile'
                  style={{ width: '40px', height: '40px' }}
                />
              </div>
              <ul className='border-0 apps-border dropdown-menu dropdown-menu-profile'>
                {profileDropdownData.map((item, index) => {
                  const { title, icon, onClick } = item;
                  return (
                    <li key={index}>
                      <button
                        className='dropdown-item color-hover p-2'
                        onClick={onClick}
                      >
                        <div className='d-flex flex-row'>
                          <p className='small'>{title}</p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className='dropdown-menu p-0 m-0 dropdown-menu-anim-up dropdown-menu-sm dropdown-menu-right'>
                <ul className='navi navi-hover py-4' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
