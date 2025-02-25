import StudentsOverview from '@/features/managers/dashboard/analytics/students/StudentsAnalytics';
import SupportStaffOverview from '@/features/managers/dashboard/analytics/support-staffs/SupportStaffsAnalytics';
import { FilterTabs, Heading, Scrollbar } from '@/shared/components';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminCounselorsOverview from './AdminCounselorsOverview';
import { Typography } from '@mui/material';
import CounselorCharts from '@/features/managers/dashboard/analytics/counselors/CounselorsAnalytics';
import BehaviorTagsChart from '@/features/managers/dashboard/analytics/students/BehaviorsOverview';
import AppointmentOverview from '@/features/managers/dashboard/analytics/students/AppointmentOverview';
// import CounselorCharts from '@/features/managers/management/support-staffs/overview/PerformanceOverview';
// import BehaviorTagsChart from '@/features/managers/management/students/overview/BehaviorsOverview';
// import AppointmentOverview from '@/features/managers/management/students/overview/AppointmentOverview';

type Props = {};

const AccountsOverview = (props: Props) => {
	const navigate = useNavigate();

	const [tabValue, setTabValue] = useState(0);

	const overviewAccountTabs = [
		{ label: 'Academic Counselor', value: 'counselor' },
		{
			label: 'Non-academic Counselor',
			value: 'na-counselor',
		},
		{ label: 'Student', value: 'student' },
		// { label: 'Manager', value: 'manager' },
		{ label: 'Support Staffs', value: 'staff' },
	];
	// useEffect(() => {
	// 	if (role)
	// 		setTabValue(
	// 			overviewAccountTabs.findIndex((item) => item.value === role)
	// 		);
	// }, []);

	const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	let view = null;

	switch (overviewAccountTabs[tabValue]?.value) {
		case 'counselor': {
			view = <AdminCounselorsOverview tabValue={tabValue} />;
			break;
		}
		case 'na-counselor': {
			view = <AdminCounselorsOverview tabValue={tabValue} />;
			break;
		}
		case 'staff': {
			view = (
				<div className='h-full overflow-hidden'>
					{/* <Scrollbar className='max-h-full overflow-auto'>
						<CounselorCharts />
					</Scrollbar> */}
				</div>
			);
			break;
		}
		case 'student': {
			view = (
				<div className='h-full overflow-hidden'>
					<Scrollbar className='max-h-full overflow-auto'>
						<div>
							<BehaviorTagsChart />
							<AppointmentOverview />
						</div>
					</Scrollbar>
				</div>
			);
			break;
		}
		default: {
			view = (
				<Typography color='error' className='font-semibold'>
					Invalid Tab Value
				</Typography>
			);
			break;
		}
	}

	return (
		<div className='flex flex-col w-full h-full overflow-hidden'>
			<div className='flex items-center justify-between px-32 pt-32'>
				<Heading
					title={`Overview`}
					description='Performance overview of accounts'
				/>
			</div>
			<div className='px-32 py-16'>
				<FilterTabs
					tabs={overviewAccountTabs}
					tabValue={tabValue}
					onChangeTab={handleChangeTab}
				/>
			</div>

			<Scrollbar className='flex-1 overflow-auto'>{view}</Scrollbar>
		</div>
	);
};

export default AccountsOverview;
