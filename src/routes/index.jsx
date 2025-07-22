import React from 'react';
import { AppRoutes } from '../static';
import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout, DashboardLayout, ProfileLayout } from '../layouts';
import {
  Archived,
  Bin,
  Favourite,
  Home,
  Login,
  MyDocs,
  Shared,
  SignUp,
  FolderDetails,
  ResetPassword,
  ResetConfirmation,
  PageNotFound,
  Profile,
  AccessDenied,
  NoInternet,
} from '../pages';

import PasswordSecurity from '../pages/PasswordSecurity';
import ActivityLogs from '../pages/ActivityLogs';
const NavigationScreens = createBrowserRouter([
  {
    path: AppRoutes.Home,
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: AppRoutes.MyDocs,
        element: <MyDocs />,
      },
      {
        path: AppRoutes.Favourites,
        element: <Favourite />,
      },
      {
        path: AppRoutes.Archived,
        element: <Archived />,
      },
      {
        path: AppRoutes.Shared,
        element: <Shared />,
      },
      {
        path: AppRoutes.Deleted,
        element: <Bin />,
      },
      {
        path: AppRoutes.FolderDetails,
        element: <FolderDetails />,
      },
      {
        path: AppRoutes.AcessDenied,
        element: <AccessDenied />,
      },
    ],
  },
  {
    path: AppRoutes.Auth,
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: AppRoutes.Login,
        element: <Login />,
      },
      {
        path: AppRoutes.SignUp,
        element: <SignUp />,
      },
      {
        path: AppRoutes.ResetConfirmation,
        element: <ResetConfirmation />,
      },
      {
        path: AppRoutes.ResetPassword,
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: AppRoutes.Profile,
    element: <ProfileLayout />,
    children: [
      {
        index: true,
        element: <Profile />,
      },
      {
      path: AppRoutes.PasswordSecurity,
      element: <PasswordSecurity />,
    },
    {
      path: AppRoutes.ActivityLogs,
      element: <ActivityLogs />,
    },
    ],
  },
  {
    path: AppRoutes.NotFound,
    element: <PageNotFound />,
  },
]);

export default NavigationScreens;
