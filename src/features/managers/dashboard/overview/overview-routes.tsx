import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
const Overview = lazy(() => import('./Overview'));
export const overviewRoutes: RouteObject[] = [
  {
    path: 'overview',
    element: <Overview />,
    children: [
    ],
  },

];