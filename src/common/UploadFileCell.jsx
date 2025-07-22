import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import { DocumentUtil, Util } from '../utils';
import { CloseSVG } from '../static/svgs';

export default function UploadFileCell(props) {
  const { file, onCancleFile } = props;

  return (
    <div
      className='d-flex fs-14 justify-content-between rounded p-2 my-2'
      style={{ backgroundColor: '#f9f9f9' }}
    >
      <div className='d-flex align-items-center column-gap-2'>
        <div className='small-icon'>{DocumentUtil.icon(file, '', true)}</div>
        <span>{Util.truncateText(DocumentUtil.name(file), 20)}</span>
      </div>
      <div className='d-flex align-items-center'>
        <strong className='mx-2' style={{ fontSize: 10 }}>
          {DocumentUtil.isFolder(file)
            ? DocumentUtil.itemCount(file)
            : DocumentUtil.size(file)}
        </strong>
        {/* <div>
          <ProgressBar className='c-progress-bar my-1 mx-2 ' now={30} />
        </div> */}
        <div onClick={onCancleFile} className='cursor-pointer'>
          <CloseSVG />
        </div>
      </div>
    </div>
  );
}
