import React from 'react';
import { DocumentUtil, Util } from '../utils';
import { MenuDotsVertical, StarSVG } from '../static/svgs';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedItems } from '../reducer/documents';
import { useLocation } from 'react-router-dom';
import { AppRoutes } from '../static';
import { Dropdown} from 'antd';
import {
   Form,
   Col,
  OverlayTrigger, 
  Row, 
  Tooltip,
} from 'react-bootstrap';

export default function DocumentGridView({
  data = [],
  onCellPress = () => {},
  onActionPress = () => {},
}) {
  // Dispatcher
  const dispatch = useDispatch();

  // Navigation Items
  const location = useLocation();

  // Reducer States
  const { selectedItems } = useSelector(state => state.documents);

  const handleSelectItem = clickedItem => {
    const isIncluded = selectedItems.some(
      item => DocumentUtil.id(item) == DocumentUtil.id(clickedItem)
    );

    if (isIncluded) {
      dispatch(
        setSelectedItems(
          selectedItems.filter(
            item => DocumentUtil.id(item) != DocumentUtil.id(clickedItem)
          )
        )
      );
    } else {
      dispatch(setSelectedItems([...selectedItems, clickedItem]));
    }
  };

  return (
    <Row className='text-center m-auto p-3' id='cuadricula'>
      {data.map((item, index) => {
        return (
          <Col
            key={index}
            className='rounded-3'
            style={{
              border: `1px solid #e5e5e5`,
              position: 'relative',
            }}
          >
            {location.pathname != AppRoutes.Shared && (
              <div style={{ position: 'absolute', top: 6, left: 10 }}>
                <Form.Check
                  className='rounded-pill cursor-pointer'
                  style={{ visibility: 'visible' }}
                  onChange={() => handleSelectItem(item)}
                  checked={selectedItems.some(
                    selectedItem =>
                      DocumentUtil.id(selectedItem) == DocumentUtil.id(item)
                  )}
                />
              </div>
            )}
            {Util.isNotEmpty(Util.getFileFolderOptions(item, location)) && (
              <div
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                }}
              >
                {/* <Dropdown>
                  <Dropdown.Toggle
                    id='dropdown-basic'
                    className={`border-0 p-0 bg-none`}
                  >
                    <MenuDotsVertical />
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    align={'end'}
                    className='bg-white shadow-lg rounded-3 border-0 dropdown-scroll-grid'
                    flip={true} 
                  >
                    {Util.getFileFolderOptions(item, location).map(
                      (actionItem, index) => {
                        const { title } = actionItem;
                        if (title) {
                          return (
                            <Dropdown.Item
                              className='fs-14 py-2 color-hover'
                              key={index}
                              onClick={() => onActionPress(actionItem, item)}
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
                    items: Util.getFileFolderOptions(item, location).map(
                      (actionItem, index) => ({
                        key: index,
                        label: (
                          <div
                            className='fs-14 py-1 color-hover'
                            onClick={() => onActionPress(actionItem, item)}
                          >
                            {actionItem.title}
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
                    className='border-0 p-0 bg-none'
                    onClick={e => e.stopPropagation()}
                    style={{ cursor: 'pointer' }}
                  >
                    <MenuDotsVertical />
                  </div>
                </Dropdown>
              </div>
            )}
            <div
              className=' d-flex align-items-center flex-column text-center'
              onClick={() => onCellPress(item)}
            >
              <div className='img-fluid-grid'>
                {DocumentUtil.icon(item, 'img-fluid-grid')}
              </div>
              <span className='font-size'>
                <OverlayTrigger
                  placement='bottom'
                  delay={{ show: 250, hide: 400 }}
                  overlay={<Tooltip id='button-tooltip'>{item.name}</Tooltip>}
                >
                  <p className='fs-14'>
                    {Util.truncateText(DocumentUtil.name(item), 15)}
                  </p>
                </OverlayTrigger>
              </span>
              <div>
                <p className='fs-14 mb-2 text-color d-flex'>
                  <span className='file-size'>
                    {DocumentUtil.customSize(item)}
                  </span>
                  {DocumentUtil.isFavorite(item) && <StarSVG />}
                </p>
              </div>
            </div>
          </Col>
        );
      })}
    </Row>
  );
}
