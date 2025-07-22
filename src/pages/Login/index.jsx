import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../static';
import { LathranLogoSVG } from '../../static/svgs';
import { AuthTextField } from '../../common';
import { Util } from '../../utils';
import NetworkRequests from '../../netwroking/NetworkRequests';

export default function Login() {
  // Navigator
  const navigate = useNavigate();

  // Local States
  const [requestBody, setRequestBody] = useState({
    email: 'admin@lathran.com',
    password: 'Lathran*1',
  });

  const handleSubmit = () => {
    NetworkRequests.login(requestBody, response => {
      navigate(AppRoutes.Home);
    });
  };

  const isDisabled = () => {
    const { email, password } = requestBody;
    return !email || !password || !Util.isValidEmail(email);
  };

  return (
    <div className='col-md-5 text-center bg-white rounded-4 px-5'>
      <div action=''>
        <div className='d-flex py-3 justify-content-center'>
          <LathranLogoSVG />
        </div>
        <div className=' row'>
          <h5 className='font-weight'>Log In</h5>
          <p className='fs-14'>Please enter your Credentials</p>
        </div>
        <AuthTextField
          title='Email'
          type='email'
          placeholder='Enter your email'
          onChange={text => setRequestBody({ ...requestBody, email: text })}
          value={requestBody.email}
        />
        <AuthTextField
          title='Password'
          type='password'
          placeholder='Enter your password'
          onChange={text => setRequestBody({ ...requestBody, password: text })}
          value={requestBody.password}
        />
        <div className='mb-3 text-end'>
          <a
            onClick={() => navigate(AppRoutes.ResetPassword)}
            className='fs-14 text-none primary-color'
            style={{ cursor: 'pointer' }}
          >
            Forget Password?
          </a>
        </div>
        <div className='d-grid'>
          <button
            onClick={handleSubmit}
            disabled={isDisabled()}
            className='btn bg-color primary text-white ps-2'
          >
            Log In
          </button>
        </div>
        <div className='d-flex justify-content-center my-4'>
          <p className='fs-14 text-gray-500 fw-semibold me-2'>
            Not a Member yet?
          </p>
          <a
            style={{ cursor: 'pointer' }}
            className='fs-14 text-none primary-color'
            onClick={() => navigate(AppRoutes.SignUp)}
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
