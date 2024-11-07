import { studentDetailRoutes } from '@/shared/components';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import {
	AcademicTranscript,
	AttendanceReport,
	StudentAppointmentReport,
	StudentDetailView,
} from '@/shared/components';
import CreateDemandButton from '../CreateDemandButton';
import StudentList from '@/shared/pages/student-list/StudentList';


const RecommendedLayout = lazy(() => import('./RecommendedLayout'));

export const recommendedStudentsRoutes: RouteObject[] = [
	{
		path: 'recommended',
		element: <StudentList isShowingTab={true} />,
		children: [
            {
                path: 'student/:id',
                element: <StudentDetailView  ><CreateDemandButton /> </StudentDetailView>,
              },
              {
                path: 'student/:id/academic-transcript',
                element: <AcademicTranscript />,
              },
              {
                path: 'student/:id/attendance-report',
                element: <AttendanceReport />,
              },
              {
                path: 'student/:id/report/:appointmentId',
                element: <StudentAppointmentReport />,
              }
        ],
	},
];
