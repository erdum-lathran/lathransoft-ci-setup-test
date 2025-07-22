import React, { useState } from 'react';

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'newPassword') {
      validatePassword(value);
    }
  };

  const validatePassword = password => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;

    if (!password) {
      setPasswordError('Password is required');
      setIsPasswordValid(false);
      return;
    }

    if (!passwordRegex.test(password)) {
      setPasswordError(
        'Password must be a minimum of 8 and maximum of 30 characters with at least one numeric and special character'
      );
      setIsPasswordValid(false);
    } else {
      setPasswordError('');
      setIsPasswordValid(true);
    }
  };

  return (
    <>
      <h5 className='mb-2'>Change Password</h5>
      <p
        className='mb-4 me-5'
        style={{
          fontSize: '14px',
          fontWeight: 400,
          color: '#99A1B7',
          lineHeight: '27px',
        }}
      >
        To change your password, please fill in the fields below. Your password
        must contain at least 8 characters, it must also include at least one
        upper case letter, one lower case letter, one number, and one special
        character.
      </p>

      <div className='d-flex flex-column gap-4'>
        <div className='d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-2 gap-lg-3'>
          <label className='custom-label min-170'>
            Old Password <span className='text-danger'>*</span>
          </label>
          <input
            type='password'
            className='form-control change-password-input'
            placeholder='Type your current password'
            name='oldPassword'
            value={formData.oldPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className='d-flex align-items-start gap-3 flex-column flex-lg-row'>
          <label className='custom-label min-170'>
            New Password <span className='text-danger'>*</span>
          </label>

          <div style={{ width: '100%', maxWidth: '500px' }}>
            <input
              type='password'
              className='form-control change-password-input'
              placeholder='Type new password'
              name='newPassword'
              value={formData.newPassword}
              onChange={handleChange}
              required
            />

            <span
              style={{
                color: isPasswordValid ? '#717F8A' : 'red',
                fontSize: '14px',
                display: 'block',
                marginTop: '6px',
              }}
            >
              Password must be a minimum of 8 and maximum of 30 characters with
              at least one numeric and special character
            </span>
          </div>
        </div>

        <div className='d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-2 gap-lg-3'>
          <label className='custom-label min-170'>
            Confirm Password <span className='text-danger'>*</span>
          </label>
          <input
            type='password'
            className='form-control change-password-input'
            placeholder='Type your new password again'
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className='d-flex gap-3 my-5'>
          <button
            disabled={
              !isPasswordValid ||
              formData.newPassword !== formData.confirmPassword
            }
            className='btn bg-color text-white py-2 px-3 rounded-2 fw-medium'
          >
            Update Password
          </button>

          <button type='button' className='btn cancel-profile-button'>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
