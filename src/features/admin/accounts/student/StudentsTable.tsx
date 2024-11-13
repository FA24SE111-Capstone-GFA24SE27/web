import { useMemo, useState, useEffect } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { ContentLoading, DataTable, NavLinkAdapter } from '@shared/components';
import { Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { CheckCircle, Delete, RemoveCircle } from '@mui/icons-material';
import { Account, Role, Student } from '@/shared/types';
import { useGetStudentsFilterAdminQuery } from './admin-student-api';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { selectFilter } from './admin-student-slice';
import { useGetAccountsQuery } from '../../admin-api';
import { roles } from '@/shared/constants';
function StudentsTable() {
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const filter = useAppSelector(selectFilter);
	const dispatch = useAppDispatch();

	// const {
	// 	searchTerm,
	// 	isIncludeBehavior,
	// 	promptForBehavior,
	// 	semesterIdForBehavior,
	// 	departmentId,
	// 	majorId,
	// 	specializationId,
	// 	minGPA,
	// 	maxGPA,
	// 	semesterIdForGPA,
	// 	tab,
	// } = filter;

	// const { data, isLoading } = useGetStudentsFilterAdminQuery({
	// 	keyword: searchTerm,
	// 	isIncludeBehavior,
	// 	promptForBehavior,
	// 	semesterIdForBehavior,
	// 	departmentId,
	// 	majorId,
	// 	specializationId,
	// 	minGPA,
	// 	maxGPA,
	// 	semesterIdForGPA,
	// 	page: pagination.pageIndex + 1,
	// 	tab,
	// });

	const { data, isLoading } = useGetAccountsQuery({
		page: pagination.pageIndex + 1,
		role: roles.STUDENT as Role,
		status: 'ACTIVE'
	});
	console.log(data);

	const columns = useMemo<MRT_ColumnDef<Account>[]>(
		() => [
			{
				accessorFn: (row) => row.profile.avatarLink,
				id: 'avatarLink',
				header: '',
				enableColumnFilter: false,
				enableColumnDragging: false,
				size: 64,
				enableSorting: false,
				Cell: ({ row }) => (
					<div className='flex items-center justify-center'>
						<img
							className='block w-full rounded max-h-40 max-w-40'
							src={row.original.profile.avatarLink}
							alt={row.original.profile.fullName}
						/>
					</div>
				),
			},
			{
				accessorKey: 'fullname',
				header: 'Full name',
				Cell: ({ row }) => (
					<Typography
						component={NavLinkAdapter}
						to={`${row.original.profile.id}`}
						className='!underline !text-secondary-main'
						color='secondary'
					>
						{row.original.profile.profile.fullName}
					</Typography>
				),
			},
			// {
			//   accessorKey: 'specialization',
			//   header: 'Specialization',
			//   Cell: ({ row }) => (
			//     <Typography className='w-fit'>
			//       {row.original.profile.expertise?.name || row.original.profile.specialization?.name}
			//     </Typography>
			//   )
			// },
			// {
			// 	accessorKey: 'studentCode',
			// 	header: 'Student Code',
			// 	accessorFn: (row) => (
			// 		<Typography className='w-fit'>{row.studentCode}</Typography>
			// 	),
			// },
			{
				accessorKey: 'phoneNumber',
				header: 'Phone',
				Cell: ({ row }) => (
					<Typography>{row.original.profile.profile.phoneNumber}</Typography>
				),
			},
			{
				accessorKey: 'email',
				header: 'Email',
				Cell: ({ row }) => (
					<Typography className='w-fit'>
						{row.original.email}
					</Typography>
				),
			},

			// {
			// 	accessorKey: 'major.name',
			// 	header: 'Major',
			// 	accessorFn: (row) => (
			// 		<Typography className='w-fit'>{row.major.name}</Typography>
			// 	),
			// },

			// {
			//   accessorKey: 'priceTaxIncl',
			//   header: 'Price',
			//   accessorFn: (row) => `$${row.priceTaxIncl}`
			// },
			// {
			//   accessorKey: 'quantity',
			//   header: 'Quantity',
			//   accessorFn: (row) => (
			//     <div className="flex items-center space-x-8">
			//       <span>{row.quantity}</span>
			//       <i
			//         className={clsx(
			//           'inline-block w-8 h-8 rounded',
			//           row.quantity <= 5 && 'bg-red',
			//           row.quantity > 5 && row.quantity <= 25 && 'bg-orange',
			//           row.quantity > 25 && 'bg-green'
			//         )}
			//       />
			//     </div>
			//   )
			// },
			// {
			// 	accessorKey: '',
			// 	header: 'Status',
			// 	size: 64,
			// 	accessorFn: (row) => (
			// 		<div className='flex items-center max-w-40'>
			// 			{row.profile.status == 'AVAILABLE' ? (
			// 				<CheckCircle className='text-green' />
			// 			) : (
			// 				<RemoveCircle className='text-red' />
			// 			)}
			// 		</div>
			// 	),
			// },
		],
		[]
	);

	if (isLoading) {
		return <ContentLoading />;
	}

	return (
		<Paper className='flex flex-col flex-auto w-full h-full overflow-hidden shadow rounded-b-0'>
			<DataTable
				data={data?.content?.data || []}
				columns={columns}
				manualPagination
				rowCount={data?.content?.totalElements || 1}
				onPaginationChange={setPagination}
				state={{ pagination }}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							// removeProducts([row.original.id]);
							closeMenu();
							table.resetRowSelection();
						}}
					>
						<ListItemIcon>
							<Delete />
						</ListItemIcon>
						Delete
					</MenuItem>,
				]}
				renderTopToolbarCustomActions={({ table }) => {
					const { rowSelection } = table.getState();

					if (Object.keys(rowSelection).length === 0) {
						return null;
					}

					return (
						<Button
							variant='contained'
							size='small'
							onClick={() => {
								const selectedRows =
									table.getSelectedRowModel().rows;
								// removeProducts(selectedRows.map((row) => row.original.id));
								table.resetRowSelection();
							}}
							className='flex shrink min-w-40 ltr:mr-8 rtl:ml-8'
							color='secondary'
						>
							<Delete />
							<span className='hidden mx-8 sm:flex'>
								Delete selected items
							</span>
						</Button>
					);
				}}
			/>
		</Paper>
	);
}

export default StudentsTable;
