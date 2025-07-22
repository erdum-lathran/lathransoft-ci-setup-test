import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../static';
import { useSelector } from 'react-redux';
import { NoInternetSVG } from '../../static/svgs';
import { backgroundImage } from '../../static/Constants';

const NoInternet = () => {
  // Navigator
  const navigate = useNavigate();

  // Reducer States
  const { token } = useSelector(state => state.auth);

  const handleSubmit = () => {
    if (token) {
      navigate(AppRoutes.Home);
    } else {
      navigate(AppRoutes.Login);
    }
  };

  return (
    <div
      style={{
        backgroundImage: backgroundImage,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: '100vh',
      }}
    >
      <div className='access-denied-container'>
        <NoInternetSVG />
        <button
          onClick={handleSubmit}
          className='btn bg-color primary text-white'
        >
          {token ? 'Dashboard' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default NoInternet;
