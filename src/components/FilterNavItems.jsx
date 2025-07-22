import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FormatTypes, NavFilterItemsList } from '../static/Constants';
import { AppRoutes } from '../static';
import { Util } from '../utils';

export default function FilterNavItems() {
  // Navigation options
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const handleNavLinkClick = selectedTab => {
    const { format } = selectedTab;
    navigate(
      `${location.pathname}?${Util.getQueryParams({ type: format }, searchParams)}`
    );
  };

  const navFiltersNotRequired = () => 
     location.pathname == AppRoutes.Home;
  // || location.pathname == AppRoutes.Deleted;

  return (
    <div className='top-menu' id='mobileContent'>
      {!navFiltersNotRequired() &&
        NavFilterItemsList.map((item, index) => {
          const { title, icon, format } = item;
          const isSelected =
            (Util.getParamValue('type', searchParams) || FormatTypes.All) ==
            format;
          const textClass = isSelected ? 'Home-text-color' : '';
          return (
            <div
              key={index}
              onClick={() => handleNavLinkClick(item)}
              className={`format-type-items ${isSelected && 'active'}`}
            >
              <div className='text-color-two'>
                {icon}
                <div className={`Home-text ${textClass} custom-font`}>
                  {title}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
