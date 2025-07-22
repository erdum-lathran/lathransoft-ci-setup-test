import React, { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { EmptyScreens } from '../static/Constants';
import { AppColors } from '../static';

export default function EmptyView({ isLoading = false }) {
  // Navigations
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    getEmptyScreenData();
  }, []);

  function hasValidValue() {
    // Define the list of parameter keys to check
    const keysToCheck = [
      'date_type',
      'type',
      'sort_by',
      'order_by',
      'search_query',
      'to_date',
      'from_date',
    ];

    // Check if any of the values is truthy, with a special case for 'type'
    return keysToCheck.some(key => {
      const value = searchParams.get(key);
      return key === 'type' ? value && value !== 'all' : Boolean(value);
    });
  }

  const getEmptyScreenData = () => {
    const finalData =
      !hasValidValue() &&
      EmptyScreens.find(item => item.route == location.pathname);

    if (finalData) {
      return finalData;
    } else {
      return {
        title: 'Data Not Found',
        description: '',
        route: '',
      };
    }
  };

  return (
    <div className='empty-container'>
      {isLoading ? (
        <Spinner animation='border' style={{ color: AppColors.maroon }} />
      ) : (
        <>
          <div className='empty-image'>{getEmptyScreenData()?.icon}</div>
          <p className='empty-title my-3'>{getEmptyScreenData()?.title}</p>
          <p className='empty-description'>
            {getEmptyScreenData()?.description}
          </p>
        </>
      )}
    </div>
  );
}
