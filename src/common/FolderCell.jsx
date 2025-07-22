import React from 'react';
import { ExpandDownSVG, ExpandRightSVG, FolderIconSVG } from '../static/svgs';
import { DocumentUtil } from '../utils';
import { Spinner } from 'react-bootstrap';
import { AppColors } from '../static';

const FolderCell = ({
  folder = null,
  isSelected = false,
  onExpand = () => {},
  onClick = () => {},
}) => {
  return (
    <div className='folder-cell'>
      <div onClick={onExpand}>
        {DocumentUtil.itemCount(folder) > 0 && (
          <>
            {DocumentUtil.isExpanded(folder) ? (
              <ExpandDownSVG />
            ) : (
              <ExpandRightSVG />
            )}
          </>
        )}
      </div>
      <div
        className={'d-flex flex-row'}
        onClick={onClick}
        style={{ marginLeft: !DocumentUtil.itemCount(folder) > 0 && 20 }}
      >
        <div className='px-2'>
          <FolderIconSVG />
        </div>
        <p className={`px-1 ${isSelected && 'selected-folder'}`}>
          {DocumentUtil.name(folder)}
        </p>
      </div>
      {/* <Spinner
        size={'sm'}
        animation='border'
        style={{ color: AppColors.maroon }}
      /> */}
    </div>
  );
};

export default FolderCell;
