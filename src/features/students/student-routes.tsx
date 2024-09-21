import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { studentServicesRoutes } from './services/services-routes';
import { specialRoutes } from '@shared/configs';

const StudentLayout = lazy(() => import('./student-layout'))
export const studentRoutes: RouteObject[] = [
  {
    path: '/',
    element: <StudentLayout />,
    children: [
      ...studentServicesRoutes,
      ...specialRoutes,
    ],
  },

];