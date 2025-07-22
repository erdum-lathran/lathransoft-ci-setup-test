import React, { useState } from 'react';
import ChangePassword from '../../components/ChangePassword';
import LoginSessions from '../../components/LoginSessions';

const tabs = [
  { label: 'Change Password', key: 'change' },
  { label: 'Login Sessions', key: 'sessions' },
];

export default function PasswordSecurity() {
  const [activeTab, setActiveTab] = useState('change');

  return (
    <div>
      <div className='d-flex gap-4 mb-5'>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`btn bg-transparent px-2 py-2 border-0 fw-semibold position-relative tab-button ${
              activeTab === tab.key ? 'active-tab' : 'inactive-tab'
            }`}
          >
            {tab.label}

            {activeTab === tab.key && (
              <div className='tab-underline position-absolute bottom-0 start-0 w-100' />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'change' && <ChangePassword />}
      {activeTab === 'sessions' && <LoginSessions />}
    </div>
  );
}
