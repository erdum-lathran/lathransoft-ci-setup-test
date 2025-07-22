import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { initialBreadCrumbs, navItemsList } from '../static/Constants';
import { setBreadcrumbs } from '../reducer/documents';
import { setShowMenu } from '../reducer/general';

export default function SideBar() {
  // Dispatcher
  const dispatch = useDispatch();

  // Navigations
  const location = useLocation();
  const navigate = useNavigate();

  // Reducer States
  const { showMenu } = useSelector(state => state.general);

  // Custom Hookes

  // Local States
  const handleBreadCrumbs = navItem => {
    const { title, route } = navItem;

    if (showMenu) {
      dispatch(setShowMenu(false));
    }
    dispatch(
      setBreadcrumbs([...initialBreadCrumbs, { name: title, route: route }])
    );
  };

  const SideBarContent = () => {
    return navItemsList.map((item, index) => {
      const { title, icon, route } = item;
      const isSelected = location.pathname == route;
      const textClass = isSelected ? 'Home-text-color' : '';
      return (
        <NavLink
          onClick={() => handleBreadCrumbs(item)}
          key={index}
          className='py-3 cursor-pointer text-decoration-none nav-items'
          to={route}
        >
          <div className='text-color-two text-decoration-none'>
            {icon}
            <div className={`Home-text ${textClass} custom-font`}>{title}</div>
          </div>
        </NavLink>
      );
    });
  };

  return (
    <div>
      {/* For Desktop */}
      <div className='side-menu' id='mobileContent'>
        <SideBarContent />
      </div>
      {/* For Mobile */}
      {showMenu && (
        <div className='side-menu-mobile' id='mobileContent'>
          <SideBarContent />
        </div>
      )}
    </div>
  );
}
