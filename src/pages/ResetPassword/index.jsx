import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppRoutes } from '../../static';
import { LathranLogoSVG } from '../../static/svgs';
import { AuthTextField } from '../../common';
import { Util } from '../../utils';
import NetworkRequests from '../../netwroking/NetworkRequests';

export default function ResetPassword() {
  // Navigator
  const navigate = useNavigate();

  // Dispatcher
  const dispatch = useDispatch();

  // Local States
  const [requestBody, setRequestBody] = useState({
    email: '',
  });

  const handleSubmit = () => {
    NetworkRequests.forgotPassword(requestBody, () => {});
  };

  const isDisabled = () => {
    const { email } = requestBody;
    return !email || !Util.isValidEmail(email);
  };

  return (
    <div className='col-md-5 text-center bg-white rounded-4 p-5'>
      <form action=''>
        <div className='d-flex py-3 justify-content-center'>
          <LathranLogoSVG />
        </div>
        <div className='row'>
          <h5 className='font-weight'>Forgot Password ?</h5>
          <p className='fs-14'> Enter your email to reset your password.</p>
        </div>
        <AuthTextField
          title='Email'
          type='email'
          placeholder='Enter your email'
          onChange={text => setRequestBody({ ...requestBody, email: text })}
          value={requestBody.email}
        />
        <div className='gap-4 mt-4 d-flex justify-content-center '>
          <button
            className='w-100 btn bg-color primary text-white'
            type='button'
            disabled={isDisabled()}
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            onClick={() => navigate(AppRoutes.Login)}
            className='w-100  custon-input p-2 rounded-2 border'
            type='button'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
