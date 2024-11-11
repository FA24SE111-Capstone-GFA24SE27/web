import { CounselorView, StudentView, studentRoutes } from '@/shared/pages';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import AssignDemandForm from './AssignDemandForm';
// import CounselorView from './counselors/CounselorView';
const Demand = lazy(() => import('./Demand'));

export const demandRoutes: RouteObject[] = [
	{
		path: 'demand',
		element: <Demand />,
		children: [
			{
				path: 'counselor/:id',
				element: <CounselorView shouldShowBooking={false} />,
			},
			{
				path: 'student/:id',
				element: <StudentView actionButton={null} />,
			},
			...studentRoutes,
			{
				path: 'assign/:id',
				element: <AssignDemandForm />
			}
		],
	},
];
