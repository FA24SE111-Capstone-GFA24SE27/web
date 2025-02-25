import {
	CounselorView,
	StudentView,
	demandRoutes,
	studentRoutes,
} from '@/shared/pages';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import UpdateDemandForm from './UpdateDemandForm';
import DemandDetail from '@/shared/pages/demand/DemandDetail';
// import CounselorView from './counselors/CounselorView';
const Demand = lazy(() => import('./Demand'));
const CounselorListForStaff = lazy(
	() => import('../counselors/CounselorListForStaff')
);
export const staffDemandRoutes: RouteObject[] = [
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
				path: ':id',
				element: <DemandDetail />,
			},
		],
	},
	{
		path: 'demand/update',
		element: <UpdateDemandForm />,
		children: [
			{
				path: 'counselor/:id',
				element: <CounselorView shouldShowBooking={false} />,
			},
		],
	},
	{
		path: 'demand/update/counselors',
		element: <CounselorListForStaff />,
	},
];
