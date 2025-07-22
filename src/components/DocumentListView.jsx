import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedItems } from '../reducer/documents';
import { DocumentUtil, Util } from '../utils';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { CopyLinkSVG, MenuDotsHorizontal, StarSVG } from '../static/svgs';
import { useLocation } from 'react-router-dom';
import { AppMessages } from '../static/Constants';
import DataTable from 'react-data-table-component';
import { Dropdown } from 'antd';

export default function DocumentListView({
  data = [],
  onCellPress = () => { },
  onActionPress = () => { },
}) {
  // Dispatcher
  const dispatch = useDispatch();

  // Navigation Items
  const location = useLocation();

  // Reducer States
  const { selectedItems } = useSelector(state => state.documents);

  const onSelectedRowsChange = ({ selectedRows }) => {
    // Chaipi to avoid infinite calls
    if (JSON.stringify(selectedItems) !== JSON.stringify(selectedRows)) {
      dispatch(setSelectedItems(selectedRows));
    }
  };

  const selectableRowSelected = row => {
    return selectedItems.some(
      item => DocumentUtil.id(item) == DocumentUtil.id(row)
    );
  };

  const handleCopyLink = async row => {
    const fileLink = DocumentUtil.key(row);
    try {
      await navigator.clipboard.writeText(fileLink);
      Util.showToast(AppMessages.CopiedLink, 'info');
    } catch (error) {
      Util.showToast(AppMessages.CopyLinkError, 'error');
    }
  };

  const columns = [
    {
      name: 'Name',
      cell: row => {
        const handleClick = e => {
          e.preventDefault();
          onCellPress(row);
        };
        return (
          <div
            onClick={handleClick}
            className='d-flex align-items-center cursor-pointer'
          >
            <div className='doc-icon'>{DocumentUtil.icon(row)}</div>
            <OverlayTrigger
              delay={{ show: 250, hide: 400 }}
              overlay={
                <Tooltip id='button-tooltip'>{DocumentUtil.name(row)}ljljlj </Tooltip>
              }
            >
              <p className='custom-text mx-2'>
                {Util.truncateText(DocumentUtil.name(row), 15)}
                {DocumentUtil.isFavorite(row) && <StarSVG />}
              </p>
            </OverlayTrigger>
          </div>
        );
      },
      headerAlign: 'center',
      sortable: true,
      selector: row => row.name,
      sortFunction: (a, b, direction) => {
        const compare = (x, y) =>
          String(x).localeCompare(String(y), undefined, {
            sensitivity: 'case',
          });
        return direction === 'desc'
          ? compare(DocumentUtil.name(b), DocumentUtil.name(a))
          : compare(DocumentUtil.name(a), DocumentUtil.name(b));
      },
    },
    {
      name: 'Size',
      cell: row => {
        return DocumentUtil.customSize(row);
      },
      selector: row => DocumentUtil.customSize(row) || 0,
      sortable: true,
    },
    {
      name: 'Last Modified',
      cell: row => DocumentUtil.updatedAt(row),
      selector: row => DocumentUtil.updatedAt(row),
      sortable: true,
    },
    {
      headerAlign: 'center',
      name: 'Action',
      cell: row =>
        Util.isNotEmpty(Util.getFileFolderOptions(row, location)) && (
          <div className='py-3 d-flex align-items-center'>
            <OverlayTrigger
              delay={{ show: 250, hide: 400 }}
              overlay={<Tooltip id='button-tooltip'>{'Copy Link'}</Tooltip>}
            >
              <div onClick={() => handleCopyLink(row)}>
                <CopyLinkSVG />
              </div>
            </OverlayTrigger>
            <OverlayTrigger
              delay={{ show: 250, hide: 400 }}
              overlay={<Tooltip id='button-tooltip'>{'View Options'}</Tooltip>}
            >
              {/* <Dropdown>
                <Dropdown.Toggle
                  id='dropdown-basic'
                  className={`border-0 mx-3 bg-none`}
                >
                  <MenuDotsHorizontal />
                </Dropdown.Toggle>
                <Dropdown.Menu
                  align={'end'}
                  className='bg-white shadow-lg rounded-3 border-0 dropdown-scroll'
                  flip={true} 
                >
                  {Util.getFileFolderOptions(row, location).map(
                    (item, index) => {
                      const { title } = item;
                      if (title) {
                        return (
                          <Dropdown.Item
                            className='fs-14 py-2 color-hover'
                            key={index}
                            onClick={() => onActionPress(item, row)}
                          >
                            {title}
                          </Dropdown.Item>
                        );
                      }
                    }
                  )}
                </Dropdown.Menu>
              </Dropdown> */}

              <Dropdown
                menu={{
                  items: Util.getFileFolderOptions(row, location).map(
                    (item, index) => ({
                      key: index,
                      label: (
                        <div
                          className='fs-14 py-1 color-hover'
                          onClick={() => onActionPress(item, row)}
                        >
                          {item.title}
                        </div>
                      ),
                    })
                  ),
                }}
                trigger={['click']}
                placement='bottomRight'
                overlayClassName='bg-white shadow-lg rounded-3 border-0 dropdown-scroll'
              >
                <div
                  className='border-0 mx-3 bg-none'
                  onClick={e => e.stopPropagation()}
                  style={{ cursor: 'pointer' }}
                >
                  <MenuDotsHorizontal />
                </div>
              </Dropdown>
            </OverlayTrigger>
          </div>
        ),
    },
  ];

  return (
    // <InfiniteScroll
    //   dataLength={data.length}
    //   loader={
    //     <Spinner animation='border' style={{ color: AppColors.maroon }} />
    //   }
    // >
    <DataTable
      className='table-padding custom-font mt-2'
      data={data}
      columns={columns}
      selectableRowsHighlight={true}
      highlightOnHover={true}
      selectableRows={true}
      selectableRowSelected={selectableRowSelected}
      onSelectedRowsChange={onSelectedRowsChange}
    />
    // </InfiniteScroll>
  );
}
