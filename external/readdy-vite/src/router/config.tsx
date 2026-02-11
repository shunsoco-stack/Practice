import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const Home = lazy(() => import('../pages/home/page'));
const AgeGate = lazy(() => import('../pages/age-gate/page'));
const Terms = lazy(() => import('../pages/terms/page'));
const KYCStatus = lazy(() => import('../pages/kyc-status/page'));
const ProfileEdit = lazy(() => import('../pages/profile/edit/page'));
const Consents = lazy(() => import('../pages/consents/page'));
const Boundaries = lazy(() => import('../pages/boundaries/page'));
const NotFound = lazy(() => import('../pages/NotFound'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/age-gate',
    element: <AgeGate />
  },
  {
    path: '/terms',
    element: <Terms />
  },
  {
    path: '/kyc-status',
    element: <KYCStatus />
  },
  {
    path: '/profile/edit',
    element: <ProfileEdit />
  },
  {
    path: '/consents',
    element: <Consents />
  },
  {
    path: '/boundaries',
    element: <Boundaries />
  },
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;