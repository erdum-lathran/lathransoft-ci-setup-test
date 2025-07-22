import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserUtil } from '../../utils';
import { useSelector } from 'react-redux';
import NetworkRequests from '../../netwroking/NetworkRequests';
import profileImage from '../../../public/assets/images/defaultProfileImage.svg';

export default function Profile() {
  // Reducer States
  const { user } = useSelector(state => state.auth);

  // Local States
  const [profileBody, setProfileBody] = useState({
    firstName: UserUtil.firstName(user),
    lastName: UserUtil.lastName(user),
    phoneNumber: UserUtil.phoneNumber(user),
    tenantId: UserUtil.tenantId(user),
  });

  const [passwordBody, setPasswordBody] = useState({
    oldPassword: 'Admin@123',
    newPassword: 'Admin@123',
    confirmNewPassword: 'Admin@123',
  });

  const handleUpdateProfile = () => {
    NetworkRequests.updateUserProfile(profileBody, response => {});
  };

  const handleChangePassword = () => {
    NetworkRequests.changePassword(passwordBody, response => {});
  };

  const isDisabled = () => {
    const { firstName, lastName, phoneNumber } = profileBody;
    return !firstName || !lastName || !phoneNumber;
  };

  const isPasswordDisabled = () => {
    const { oldPassword, newPassword, confirmNewPassword } = passwordBody;
    return !oldPassword || !newPassword || !confirmNewPassword;
  };
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <div className='col-9 fs-11 align-items-center bg-white rounded-4 p-1 m-1'>
      <div className='d-flex flex-column flex-md-row align-items-center gap-3 mb-4 w-100'>
        <div className='cursor-pointer' data-bs-toggle='dropdown'>
          <img
            src={selectedImage ||user.profileImage || profileImage}
            alt='User Profile'
            className='rounded-circle object-fit-cover profile-img'
          />
        </div>
        <button
          type='button'
          className='btn-custom-upload'
          onClick={triggerFileSelect}
        >
          Upload Picture
        </button>
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <button
          type='button'
          className='p-0 border-0 bg-transparent'
          style={{ color: 'black', fontWeight: '450' }}
          onClick={handleRemoveImage}
        >
          Remove
        </button>
      </div>

      <div className='d-flex flex-column flex-md-row gap-4 w-100 mt-4'>
        <div className='d-flex align-items-center gap-3'>
          <label className='custom-label min-100'>First Name</label>
          <input
            type='text'
            className='form-control custom-input'
            placeholder='Enter your First Name'
            value={UserUtil.firstName(user)}
            onChange={e =>
              setProfileBody({ ...profileBody, firstName: e.target.value })
            }
          />
        </div>
        <div className='d-flex align-items-center gap-3'>
          <label className='custom-label min-100'>Last Name</label>
          <input
            type='text'
            className='form-control custom-input'
            placeholder='Enter your First Name'
            required
            value={profileBody.lastName}
            onChange={e =>
              setProfileBody({ ...profileBody, lastName: e.target.value })
            }
          />
        </div>
      </div>

      <div className='d-flex flex-column flex-md-row gap-4 w-100 mt-4'>
        <div className='d-flex align-items-center gap-3'>
          <label className='custom-label min-100'>Email</label>
          <input
            type='email'
            className='form-control custom-input'
            placeholder='Enter your email'
            disabled
            style={{
              backgroundColor: '#FAFAFA',
            }}
            value={UserUtil.email(user)}
          />
        </div>
        <div className='d-flex align-items-center gap-3'>
          <label className='custom-label min-100'>Phone Number</label>
          <input
            type='text'
            className='form-control custom-input'
            placeholder='Enter your phone number'
            required
            value={profileBody.phoneNumber}
            onChange={e =>
              setProfileBody({ ...profileBody, phoneNumber: e.target.value })
            }
          />
        </div>
      </div>

      <div className='d-flex flex-column flex-md-row gap-4 w-100 mt-4'>
        <div className='d-flex align-items-center gap-3'>
          <label className='custom-label min-100'>City</label>
          <input
            type='text'
            className='form-control custom-input'
            placeholder='Enter your City'
            required
            // value={profileBody.city}
            onChange={e =>
              setProfileBody({ ...profileBody, city: e.target.value })
            }
          />
        </div>

        <div className='d-flex align-items-center gap-3'>
          <label className='custom-label min-100'>User type</label>
          <input
            type='text'
            className='form-control custom-input'
            placeholder='Enter your User type'
            // value={profileBody.userType}
            onChange={e =>
              setProfileBody({ ...profileBody, userType: e.target.value })
            }
          />
        </div>
      </div>

      <div className='d-flex flex-column flex-md-row gap-4 w-100 mt-4'>
        <div className='d-flex align-items-center gap-3'>
          <label className='custom-label min-100'>Username</label>
          <input
            type='email'
            className='form-control custom-input'
            placeholder='Enter your Username'
            disabled
            style={{
              backgroundColor: '#FAFAFA',
            }}
            // value={UserUtil.username(user)}
          />
        </div>
        <div className='d-flex align-items-center gap-3'>
          <label className='custom-label min-100'>Tenant</label>
          <input
            type='text'
            className='form-control custom-input'
            placeholder='Enter your Tenant'
            disabled
            style={{
              backgroundColor: '#FAFAFA',
            }}
            // value={UserUtil.tenant(user)}
          />
        </div>
      </div>
      <div className='d-flex gap-3 my-5'>
        <button
          onClick={handleUpdateProfile}
          disabled={isDisabled()}
          className='btn bg-color text-white py-2 px-3 rounded-2 fw-medium'
        >
          Update Profile
        </button>
        <button type='button' className='btn cancel-profile-button'>
          Cancel
        </button>
      </div>
    </div>
  );
}
