import { LogoutSVG } from '../static/svgs';
import mobileIcon from '../../public/assets/images/mobile.svg';
import laptopIcon from '../../public/assets/images/laptop.svg';

const sessions = [
  {
    device: 'Chrome - Windows',
    ip: '192.168.1.10',
    location: 'Lahore, Pakistan',
    time: 'June 4, 2025 12:34 PM',
    isActive: true,
  },
  {
    device: 'Laptop',
    ip: '192.168.1.22',
    location: 'Karachi, Pakistan',
    time: 'June 3, 2025 08:15 PM',
    isActive: false,
  },
];

export default function LoginSessions() {
  return (
    <div>
      <div className='d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3'>
        <h5 className='mb-0'>Login Sessions</h5>
        <button type='button' className='btn-custom-upload'>
          <LogoutSVG className='me-2' />
          Sign out all sessions
        </button>
      </div>

      <p className='mb-4 fw-normal small login-sessions-desc'>
        This is a list of devices that have logged into your account. Logout any
        sessions that you don’t recognize.
      </p>

      {/* Scrollable Table */}
      <div className='table-responsive'>
        <div className='min-width-table py-2'>
          {/* Table Header */}
          <div className='d-flex text-uppercase fw-semibold text-muted login-table-header'>
            <div className='flex-1'>Device</div>
            <div className='flex-1'>IP Address</div>
            <div className='flex-1'>Location</div>
            <div className='flex-1'>Time</div>
            <div className='flex-half'>Actions</div>
          </div>

          <hr className='login-table-divider' />

          {sessions.map((session, idx) => {
            const isMobile = session.device.toLowerCase().includes('mobile');
            const iconSrc = isMobile ? mobileIcon : laptopIcon;

            return (
              <div key={idx}>
                <div className='d-flex align-items-center py-3 text-secondary'>
                  <div className='d-flex align-items-center gap-2 flex-1'>
                    <img
                      src={iconSrc}
                      alt={isMobile ? 'Mobile Icon' : 'Laptop Icon'}
                      className='me-2'
                      width={20}
                      height={20}
                    />
                    {session.device}
                  </div>
                  <div className='flex-1'>{session.ip}</div>
                  <div className='flex-1'>{session.location}</div>
                  <div className='flex-1'>{session.time}</div>
                  <div
                    className={`flex-half fw-medium fst-italic ${
                      session.isActive ? 'text-success' : 'text-danger'
                    }`}
                  >
                    {session.isActive ? 'Active Now' : 'Sign Out'}
                  </div>
                </div>
                <hr className='login-row-divider' />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
