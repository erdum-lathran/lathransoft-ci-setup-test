import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppRoutes } from '../../static';
import { LathranLogoSVG } from '../../static/svgs';
import { AuthTextField } from '../../common';
import { Util } from '../../utils';
import { AppMessages, Types } from '../../static/Constants';
import NetworkRequests from '../../netwroking/NetworkRequests';

export default function SignUp() {
  // Navigator
  const navigate = useNavigate();

  // Dispatcher
  const dispatch = useDispatch();

  // Constants
  const seprateApp = true;

  // Local States

  const [requestBody, setRequestBody] = useState(
    Util.isDevEnv()
      ? {
          firstName: 'Nayyer',
          lastName: 'Ali',
          phoneNumber: '+923222960371',
          email: 'nayyeraliios+2@gmail.com',
          password: 'Admin@123',
          confirmPassword: 'Admin@123',
          tenantId: 1,
        }
      : {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          email: '',
          password: '',
          confirmPassword: '',
          tenantId: null,
        }
  );

  const handleSubmit = () => {
    const { password, confirmPassword, email } = requestBody;

    if (!Util.isValidEmail(email)) {
      return Util.showToast(AppMessages.InvalidEmail, 'info');
    }

    if (password != confirmPassword) {
      return Util.showToast(AppMessages.UnMatchedPassword, 'info');
    }

    if (Util.getPasswordStrength(password) == Types.Weak) {
      return Util.showToast(AppMessages.WeakPassword, 'warning');
    }

    NetworkRequests.register(requestBody, response => {
      navigate(AppRoutes.Login);
    });
  };

  const isDisabled = () => {
    return Object.values(requestBody).some(item => !item);
  };

  return (
    <div className='col-md-5 text-center bg-white rounded-4 px-5'>
      <div>
        <div className='d-flex py-3 justify-content-center'>
          <LathranLogoSVG />
        </div>
        <div className=' row'>
          <h5 className='font-weight'>
            {`Your ${!seprateApp ? 'iWantHub' : 'LathranSuite'} Family Awaits!`}
          </h5>
        </div>
        <div className='gap-3 d-flex justify-content-between'>
          <AuthTextField
            title='First Name'
            type='text'
            placeholder='Enter your first name'
            onChange={text =>
              setRequestBody({ ...requestBody, firstName: text })
            }
            value={requestBody.firstName}
          />
          <AuthTextField
            title='Last Name'
            type='text'
            placeholder='Enter your last name'
            onChange={text =>
              setRequestBody({ ...requestBody, lastName: text })
            }
            value={requestBody.lastName}
          />
        </div>
        <div className='gap-3 d-flex justify-content-between'>
          <AuthTextField
            title='Email'
            type='email'
            placeholder='Enter your email'
            onChange={text => setRequestBody({ ...requestBody, email: text })}
            value={requestBody.email}
          />
          <AuthTextField
            title='Phone Number'
            type='tel'
            placeholder='Enter your phone number'
            onChange={text =>
              setRequestBody({ ...requestBody, phoneNumber: text })
            }
            value={requestBody.phoneNumber}
          />
        </div>
        <div className='gap-3 d-flex justify-content-between'>
          <AuthTextField
            title='Password'
            type='password'
            placeholder='Enter your password'
            onChange={text =>
              setRequestBody({ ...requestBody, password: text })
            }
            value={requestBody.password}
          />
          <AuthTextField
            title='Confirm Password'
            type='password'
            placeholder='Enter your password again'
            onChange={text =>
              setRequestBody({ ...requestBody, confirmPassword: text })
            }
            value={requestBody.confirmPassword}
          />
        </div>
        <div className='d-grid mt-4'>
          <button
            disabled={isDisabled()}
            onClick={handleSubmit}
            className='btn bg-color primary text-white ps-2'
          >
            Join Now
          </button>
        </div>
        <div className='d-flex justify-content-center my-4'>
          <p className='fs-14 text-gray-500 fw-semibold me-2'>
            Been here before?
          </p>
          <a
            style={{ cursor: 'pointer' }}
            className='fs-14 text-none primary-color'
            onClick={() => navigate(AppRoutes.Login)}
          >
            Log In
          </a>
        </div>
      </div>
    </div>
  );
}
