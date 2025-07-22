import React, { useEffect, useState } from 'react';
import {
  FilterSVG,
  SearchSVG,
  GridSVG,
  ListSVG,
  PlusSVG,
  ArrowDownSVG,
  SelectAllSVG,
} from '../static/svgs';
import { Form, OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap';
import { Filters, OrderBy, SortBy, Titles, Types } from '../static/Constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataHandler, Util, DocumentUtil } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import { setCheckFolder, setIsGridView, setReload } from '../reducer/general';
import { AppRoutes, AppColors } from '../static';
import { setSelectedItems } from '../reducer/documents';
import Select from 'react-select';
import FilterNavItems from './FilterNavItems';
import NetworkRequests from '../netwroking/NetworkRequests';

export default function FilterComponent() {
  // Dipatcher
  const dispatch = useDispatch();

  // Navigation Options
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  // Reducer States
  const { isGridView, reload } = useSelector(state => state.general);
  const { selectedItems, documentsList } = useSelector(
    state => state.documents
  );

  // Constants
  const queryObj = {
    date_type: '',
    sort_by: '',
    order_by: '',
    from_date: '',
    to_date: '',
    search_query: '',
  };

  const FilterTypes = [
    {
      title: Types.FilterBy,
    },
    {
      title: Types.SortBy,
    },
    {
      title: Types.OrderBy,
    },
  ];

  // Local States
  const [isFiltersShowing, setIsFiltersShowing] = useState(false);
  const [queryParams, setQueryParams] = useState(queryObj);
  const [selectedType, SetSelectedType] = useState(Types.FilterBy);

  useEffect(() => {
    handleInitialValues();
  }, []);

  const handleInitialValues = () => {
    const updatedQueryObj = { ...queryObj };
    for (const [key] of Object.entries(queryObj)) {
      updatedQueryObj[key] = Util.getParamValue(key, searchParams);
    }

    setQueryParams(updatedQueryObj);
  };

  const isFilterActive = () => {
    return Object.values(queryParams).some(item => Util.isNotEmpty(item));
  };

  const updateQueryParams = params => {
    navigate(
      `${location.pathname}?${Util.getQueryParams(params, searchParams)}`
    );
    setIsFiltersShowing(false);
  };

  const colourStyles = {
    option: (styles, { isSelected }) => ({
      ...styles,
      background: isSelected ? AppColors.maroon : AppColors.transparent,
      zIndex: 1,
    }),
    control: (base, { isFocused }) => ({
      ...base,
      borderColor: isFocused ? AppColors.maroon : AppColors.borderColor,
      boxShadow: null,
      '&:hover': { borderColor: AppColors.maroon },
    }),
  };

  const addNewOptions = [
    {
      title: 'New Folder',
      icon: '',
      onClick: () => {
        DataHandler.getNewFolderModalRef().show({});
      },
    },
    {
      title: 'Upload Folder',
      icon: '',
      onClick: () => {
        // DataHandler.getUploadModalRed().show({ isFolder: true });
        folderFileChecker("folder")
      },
    },
    {
      title: 'Upload File',
      icon: '',
      onClick: () => {
        // DataHandler.getUploadModalRed().show({ isFolder: false });
        folderFileChecker("file")
      },
    },
    {
      title: 'Create Link',
      icon: '',
      onClick: () => {
        DataHandler.getCreateLinkModal().show({});
      },
    },
  ];

  const folderFileChecker = (type) => {
    dispatch(setCheckFolder(type === "folder" ? true : false));
    DataHandler.getUploadModalRed().show(type === "folder" ? { isFolder: true } : { isFolder: false });
  }

  const transformedQueryParams = () => {
    const transformedArray = [];

    for (const [key, value] of Object.entries(queryParams)) {
      const transformedKey = key
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize the first letter of each word

      // Push the key-value pair as an object into the array

      if (Util.isNotEmpty(value)) {
        transformedArray.push({
          title: transformedKey,
          value: Util.getParamValue(key, searchParams) || value,
          orignalKey: key,
        });
      }
    }

    return transformedArray;
  };

  const handleClearFilter = filterToRemove => {
    const updatedParams = {};
    transformedQueryParams()
      .filter(item => item.orignalKey !== filterToRemove.orignalKey)
      .map(item => {
        const { orignalKey, value } = item;
        updatedParams[orignalKey] = value;
      });

    updateQueryParams(updatedParams);
  };

  const handleBulkMove = () => {
    DataHandler.getMoveCopyModal().show({
      isBulk: true,
      isMoving: true,
    });
  };

  const handleBulkCopy = () => {
    DataHandler.getMoveCopyModal().show({
      isBulk: true,
      isMoving: false,
    });
  };

  const handleBulkDelete = () => {
    DataHandler.getDeleteModalRef().show({
      isBulk: true,
    });
  };

  const handleBulkFavorite = () => {
    NetworkRequests.favoriteFilesFolder(getDocumentIdsBody(), response => {
      dispatch(setReload(!reload));
    });
  };

  const handleBulkUnfavorite = () => {
    NetworkRequests.unfavoriteFilesFolder(getDocumentIdsBody(), response => {
      dispatch(setReload(!reload));
    });
  };

  const handleBulkArchive = () => {
    NetworkRequests.archiveFilesFolder(getDocumentIdsBody(), response => {
      dispatch(setReload(!reload));
    });
  };

  const handleBulkUnArchive = () => {
    NetworkRequests.unarchiveFilesFolder(getDocumentIdsBody(), response => {
      dispatch(setReload(!reload));
    });
  };

  const handleRestore = () => {
    NetworkRequests.restoreFilesFolders(getDocumentIdsBody(), response => {
      dispatch(setReload(!reload));
    });
  };

  const handleDeleteForever = () => {
    NetworkRequests.deleteFilesFoldersForever(getDocumentIdsBody(), () => {
      dispatch(setReload(!reload));
    });
  };

  const handleEmptyBin = () => {
    NetworkRequests.emptyTrash(() => {
      dispatch(setReload(!reload));
    });
  };
  const handleBulkDownload = async () => {
    const ids = selectedItems
      .map(item => item.id)
      .filter(id => id !== null && id !== undefined);
    try {
      const blob = await NetworkRequests.bulkDownload(ids);
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'files.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const getDocumentIdsBody = () => {
    const body = {
      documentIds: selectedItems.map(item => item.id),
    };

    return body;
  };

  const getFilteredBulkOptions = () => {
    let finalArray = [];

    switch (location.pathname) {
      case AppRoutes.Favourites:
        finalArray = [
          {
            title: Titles.Archive,
            icon: '',
            onClick: () => {
              handleBulkArchive();
            },
          },
          {
            title: Titles.CopyTo,
            icon: '',
            onClick: () => {
              handleBulkCopy();
            },
          },
          {
            title: Titles.MoveTo,
            icon: '',
            onClick: () => {
              handleBulkMove();
            },
          },
          {
            title: Titles.Unfavourite,
            icon: '',
            onClick: () => {
              handleBulkUnfavorite();
            },
          },
          {
            title: Titles.Delete,
            icon: '',
            onClick: () => {
              handleBulkDelete();
            },
          },
          { title: 'Download', icon: '', onClick: handleBulkDownload },
        ];
        break;
      case AppRoutes.Archived:
        finalArray = [
          {
            title: Titles.Unarchive,
            icon: '',
            onClick: () => {
              handleBulkUnArchive();
            },
          },
          {
            title: Titles.Delete,
            icon: '',
            onClick: () => {
              handleBulkDelete();
            },
          },
        ];
        break;
      case AppRoutes.Deleted:
        finalArray = [
          {
            title: Titles.Restore,
            icon: '',
            onClick: () => {
              handleRestore();
            },
          },
          {
            title: Titles.DeleteForever,
            icon: '',
            onClick: () => {
              handleDeleteForever();
            },
          },
        ];
        break;
      case AppRoutes.Shared:
        finalArray = [];
        break;
      default:
        finalArray = [
          {
            title: Titles.Archive,
            icon: '',
            onClick: () => {
              handleBulkArchive();
            },
          },
          {
            title: Titles.CopyTo,
            icon: '',
            onClick: () => {
              handleBulkCopy();
            },
          },
          {
            title: Titles.MoveTo,
            icon: '',
            onClick: () => {
              handleBulkMove();
            },
          },
          {
            title: Titles.Favourite,
            icon: '',
            onClick: () => {
              handleBulkFavorite();
            },
          },
          {
            title: Titles.Delete,
            icon: '',
            onClick: () => {
              handleBulkDelete();
            },
          },
          { title: 'Download', icon: '', onClick: handleBulkDownload },
        ];
        break;
    }

    return finalArray;
  };

  const handleSelectAll = () => {
    if (allItemsSelected()) {
      dispatch(setSelectedItems([]));
    } else {
      dispatch(setSelectedItems(documentsList));
    }
  };

  const allItemsSelected = () => {
    return (
      Util.isNotEmpty(selectedItems) ||
      selectedItems.length === documentsList.length
    );
  };

  const isButtonAllowed = () => {
    return (
      location.pathname == AppRoutes.Home ||
      location.pathname == AppRoutes.MyDocs ||
      location.pathname == AppRoutes.FolderDetails
    );
  };

  return (
    <div className='top-nav-container py-2 justify-content-center align-items-center d-flex'>
      <div className='nav-filters'>
        <div className='col-lg-4 col-md-12 col-sm-12 d-flex flex-row align-items-center '>
          <>
            <div className='search-cont'>
              <SearchSVG />
              <Form.Control
                className='search-input'
                type='text'
                autoComplete='off'
                id='search'
                placeholder='Search Files and Folder...'
                value={queryParams.search_query}
                onChange={e => {
                  setQueryParams({
                    ...queryParams,
                    search_query: e.target.value,
                  });
                  updateQueryParams({
                    ...queryParams,
                    search_query: e.target.value,
                  });
                }}
              />
            </div>
            {location.pathname != AppRoutes.Home && (
              <Dropdown show={isFiltersShowing} onToggle={setIsFiltersShowing}>
                <Dropdown.Toggle
                  id='dropdown-basic'
                  onClick={setIsFiltersShowing}
                  className={`rounded border-0 py-2 d-flex flex-row mx-1 ${isFiltersShowing || isFilterActive() ? 'filter-btn-active' : 'filter-btn'}`}
                >
                  <FilterSVG />
                </Dropdown.Toggle>
                <Dropdown.Menu className='bg-none rounded-3 border-0'>
                  <div
                    className='bg-white shadow-lg rounded-3 z-2'
                    style={{
                      // width: '80%',
                      minWidth: '315px',
                      // left: 'calc(16% - 10px)',
                    }}
                  >
                    <div className='d-flex flex-row justify-content-evenly'>
                      {FilterTypes.map((item, index) => {
                        const { title } = item;
                        const isSelected = title == selectedType;
                        return (
                          <button
                            key={index}
                            onClick={() => SetSelectedType(title)}
                            className={`underline-button border-0 fs-14 ${isSelected ? 'active-bottom-border' : 'inactive-bottom-border'}`}
                          >
                            {title}
                          </button>
                        );
                      })}
                    </div>

                    <div className='p-3 d-flex flex-column row-gap-3'>
                      <div className='resp-select'>
                        {selectedType == Types.FilterBy ? (
                          <Select
                            placeholder={'Select Filter'}
                            tabSelectsValue={true}
                            options={Filters}
                            classNamePrefix='select'
                            value={
                              Filters.find(
                                option =>
                                  option.value.toLowerCase() ===
                                  queryParams.date_type.toLowerCase()
                              ) || null
                            }
                            styles={colourStyles}
                            className='fs-14'
                            onChange={selectedOption => {
                              const { value, from_date, to_date } =
                                selectedOption;
                              setQueryParams({
                                ...queryParams,
                                date_type: value,
                                from_date,
                                to_date,
                              });
                            }}
                          />
                        ) : selectedType == Types.SortBy ? (
                          <Select
                            placeholder={'Select Sort'}
                            tabSelectsValue={true}
                            options={SortBy}
                            classNamePrefix='select'
                            value={
                              SortBy.find(
                                option =>
                                  option.value.toLowerCase() ===
                                  queryParams.sort_by.toLowerCase()
                              ) || null
                            }
                            styles={colourStyles}
                            className='fs-14'
                            onChange={selectedOption => {
                              const { value } = selectedOption;
                              setQueryParams({
                                ...queryParams,
                                sort_by: value,
                              });
                            }}
                          />
                        ) : selectedType == Types.OrderBy ? (
                          <Select
                            placeholder={'Select Order'}
                            options={OrderBy}
                            classNamePrefix='select'
                            value={
                              OrderBy.find(
                                option =>
                                  option.value.toLowerCase() ===
                                  queryParams.order_by.toLowerCase()
                              ) || null
                            }
                            styles={colourStyles}
                            className='fs-14'
                            onChange={selectedOption => {
                              const { value } = selectedOption;
                              setQueryParams({
                                ...queryParams,
                                order_by: value,
                              });
                            }}
                          />
                        ) : null}
                        {queryParams.date_type == Types.Custom && (
                          <div className='d-flex my-3 column-gap-2'>
                            <input
                              type='date'
                              className='border-1 fs-14 p-2 rounded-2'
                              value={queryParams.from_date}
                              onChange={e => {
                                setQueryParams({
                                  ...queryParams,
                                  from_date: e.target.value,
                                });
                              }}
                              style={{ borderColor: 'rgba(0,0,0,.12)' }}
                            />
                            <input
                              type='date'
                              className='border-1 fs-14 p-2 rounded-2'
                              value={queryParams.to_date}
                              onChange={e => {
                                setQueryParams({
                                  ...queryParams,
                                  to_date: e.target.value,
                                });
                              }}
                              style={{ borderColor: 'rgba(0,0,0,.12)' }}
                            />
                          </div>
                        )}
                      </div>
                      <div
                        className='d-flex justify-content-end column-gap-3 my-3'
                        style={{ height: '45px' }}
                      >
                        <button
                          className='color-invite border-0 fs-14 rounded-3 w-100'
                          onClick={() => {
                            setQueryParams(queryObj);
                            updateQueryParams(queryObj);
                            SetSelectedType(Types.FilterBy);
                          }}
                        >
                          Reset
                        </button>
                        <button
                          className='color-upload border-0 fs-14 rounded-3 w-100'
                          onClick={() => updateQueryParams(queryParams)}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </>
        </div>
        <div className='col-lg-4 col-md-12 col-sm-12'>
          <FilterNavItems />
        </div>
        <div className='gap-3 col-lg-4 col-md-12 col-sm-12 d-flex flex-row align-items-center justify-content-end px-2'>
          {Util.isNotEmpty(documentsList) &&
            location.pathname != AppRoutes.Shared && (
              <OverlayTrigger
                placement='top'
                overlay={
                  <Tooltip id='tooltip-grid'>
                    {allItemsSelected()
                      ? 'Unselect All Items'
                      : 'Select All Items'}
                  </Tooltip>
                }
              >
                <div
                  className={`small-icon ${allItemsSelected() ? 'maroon-svg' : 'black-svg'}`}
                  onClick={handleSelectAll}
                >
                  <SelectAllSVG />
                </div>
              </OverlayTrigger>
            )}
          <OverlayTrigger
            placement='top'
            overlay={
              <Tooltip id='tooltip-grid'>
                {isGridView ? 'Table View' : 'Grid View'}
              </Tooltip>
            }
          >
            <div
              onClick={() => {
                dispatch(setIsGridView(!isGridView));
              }}
            >
              {isGridView ? <ListSVG /> : <GridSVG />}
            </div>
          </OverlayTrigger>
          {location.pathname == AppRoutes.Deleted &&
            Util.isNotEmpty(documentsList) && (
              <div
                onClick={() => handleEmptyBin()}
                className='cursor-pointer empty-recycle-btn'
              >
                Empty Recycle Bin
              </div>
            )}
          {Util.isNotEmpty(selectedItems) &&
            Util.isNotEmpty(getFilteredBulkOptions()) ? (
            <>
              <Dropdown>
                <Dropdown.Toggle
                  id='dropdown-basic'
                  style={{
                    background: '#aa322e',
                    borderRadius: '0.375 rem',
                  }}
                  className='gap-2 align-items-center rounded bg-white primary-color py-2 d-flex flex-row maroon-svg'
                >
                  <ArrowDownSVG />
                  <p className='fs-14'>{'Bulk Options'}</p>
                </Dropdown.Toggle>
                <Dropdown.Menu className='bg-white shadow-lg rounded-3 border-0'>
                  {getFilteredBulkOptions().map((item, index) => {
                    const { title, onClick } = item;
                    return (
                      <Dropdown.Item
                        className='fs-14 py-2 color-hover'
                        key={index}
                        onClick={onClick}
                      >
                        {title}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) : (
            isButtonAllowed() && (
              <Dropdown>
                <Dropdown.Toggle
                  id='dropdown-basic'
                  style={{
                    background: '#aa322e',
                    borderRadius: '0.375 rem',
                    marginLeft: "20px"
                  }}
                  className='gap-2 rounded border-0 py-2 d-flex flex-row white-svg'
                >
                  <PlusSVG />
                  <p className='fs-14'>{'Add New'}</p>
                </Dropdown.Toggle>
                <Dropdown.Menu className='bg-white shadow-lg rounded-3 border-0'>
                  {addNewOptions.map((item, index) => {
                    const { title, onClick } = item;
                    return (
                      <Dropdown.Item
                        className='fs-14 py-2 color-hover'
                        key={index}
                        onClick={onClick}
                      >
                        {title}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
            )
          )}
        </div>
      </div>
      {/* {Util.isNotEmpty(transformedQueryParams()) && (
        <div className='param-filters'>
          {transformedQueryParams().map((item, index) => {
            const { title, value } = item;
            return (
              <div className='param-cell' key={index}>
                <p>{`${title} = ${value}`}</p>
                <CloseSVG onClick={() => handleClearFilter(item)} />
              </div>
            );
          })}
        </div>
      )} */}
    </div>
  );
}
