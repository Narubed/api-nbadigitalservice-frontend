import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Blog';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';
import GEO from './pages/GEO';
import GEOProvince from './pages/GEO/province';
import GEOCreateProvince from './pages/GEO/province/CreateProvince';
import GEOEditProvince from './pages/GEO/province/EdiProvince';

import GEOAmphur from './pages/GEO/amphur';
import GEOCreateAmphur from './pages/GEO/amphur/CreateAmphur';
import GEOEditAmphur from './pages/GEO/amphur/EditAmphur';

import GEODistrict from './pages/GEO/district';
import GEOCreateDistrict from './pages/GEO/district/CreateDistrict';
import GEOEditDistrict from './pages/GEO/district/EditDistrict';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'geo', element: <GEO /> },
        { path: 'geo/province', element: <GEOProvince /> },
        { path: 'geo/create-province', element: <GEOCreateProvince /> },
        { path: 'geo/edit-province', element: <GEOEditProvince /> },
        { path: 'geo/amphur', element: <GEOAmphur /> },
        { path: 'geo/create-amphur', element: <GEOCreateAmphur /> },
        { path: 'geo/edit-amphur', element: <GEOEditAmphur /> },
        { path: 'geo/district', element: <GEODistrict /> },
        { path: 'geo/create-district', element: <GEOCreateDistrict /> },
        { path: 'geo/edit-district', element: <GEOEditDistrict /> },

        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'products', element: <Products /> },
        { path: 'blog', element: <Blog /> },
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/geo" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
