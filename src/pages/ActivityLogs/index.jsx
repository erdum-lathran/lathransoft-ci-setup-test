import ClockIcon from '../../../public/assets/images/clockIcon.svg';
import DotedLineIcon from '../../../public/assets/images/dotedLineIcon.svg';

const logs = [
  {
    message: 'User Larry Johnson logged in successfully',
    time: '06 Jan 2025, 10:55 AM',
  },
  {
    message: 'User Emily Watson uploaded a file',
    time: '06 Jan 2025, 11:15 AM',
  },
  {
    message: 'Admin updated system settings',
    time: '06 Jan 2025, 11:45 AM',
  },
  {
    message: 'User Michael Smith deleted a document',
    time: '06 Jan 2025, 12:10 PM',
  },
  {
    message: 'User Sophia Lee downloaded a report',
    time: '06 Jan 2025, 12:35 PM',
  },
];

export default function ActivityLogs() {
  return (
    <>
      <h5 className='my-2'>Activity Logs</h5>
      <p className='mb-4 me-5 text-secondary fs-6'>
        Monitor tasks, activities, and time for efficient productivity tracking.
      </p>

      <div className='overflow-auto pe-3' style={{ maxHeight: '350px' }}>
        {logs.map((log, index) => (
          <div className='row' key={index}>
            <div className='col-auto d-none d-md-flex flex-column align-items-center px-3'>
              <img src={ClockIcon} alt='Clock icon' className='mb-1' />
              {index < logs.length - 1 && (
                <div className='flex-grow-1 d-flex justify-content-center'>
                  <img src={DotedLineIcon} alt='Dotted line' />
                </div>
              )}
            </div>
            <div className='col mt-1'>
              <h6 className='mb-1'>{log.message}</h6>
              <p className='mb-4 text-muted small'>{log.time}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
