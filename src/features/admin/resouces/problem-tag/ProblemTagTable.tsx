import { useMemo, useState, useEffect } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { ContentLoading, DataTable, NavLinkAdapter } from '@shared/components';
import { Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import * as React from 'react';
import _ from 'lodash';
import { Link, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { CheckCircle, Delete, Edit, RemoveCircle } from '@mui/icons-material';
import {
	useDeleteProblemTagMutation,
	useGetProblemTagsQuery,
} from './problem-tag-api';
import { ManagementCounselor } from '@/features/managers/management/counselors/counselors-api';
import { ProblemTag } from '@/shared/types/admin';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { useAlertDialog, useConfirmDialog } from '@/shared/hooks';
import {
	selectProblemTagCategorySearch,
	selectProblemTagFilterCategory,
	selectProblemTagSearch,
	setSelectedProblemTagUpdate,
} from '../admin-resource-slice';

function ProblemTagTable() {
	const keyword = useAppSelector(selectProblemTagSearch);
	const catSelected = useAppSelector(selectProblemTagFilterCategory);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const { data, isLoading } = useGetProblemTagsQuery({
		page: pagination.pageIndex + 1,
		keyword,
		problemCategoryId: catSelected?.id,
	});

	const [removeProblemTag] = useDeleteProblemTagMutation();

	const removeProducts = (ids: number[]) => {
		if (ids && ids.length > 0) {
			useConfirmDialog({
				dispatch,
				title: 'Are you sure you want to remove the selected problem tag?',
				confirmButtonFunction: () => {
					removeProblemTag({ id: ids[0] })
						.then((res) => {
							if (res) {
								useAlertDialog({
									dispatch,
									title: 'Problem tag removed successfully',
								});
							}
						})
						.catch((err) => console.error(err));
				},
			});
		}
	};

	const updateProblemTag = (item: ProblemTag) => {
		if (item) {
			dispatch(setSelectedProblemTagUpdate(item));
			console.log(item)
			navigate(`update/${item.id}`);
		}
	};

	const columns = useMemo<MRT_ColumnDef<ProblemTag>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Tag Name',
				Cell: ({ row }) => <Typography>{row.original.name}</Typography>,
			},

			{
				accessorKey: 'category.name',
				header: 'Category',
				Cell: ({ row }) => (
					<Typography className='w-fit'>
						{row.original.category.name}
					</Typography>
				),
			},
		],
		[]
	);

	if (isLoading) {
		return <ContentLoading />;
	}

	return (
		<Paper className='flex flex-col flex-auto w-full h-full overflow-hidden shadow rounded-b-0'>
			<DataTable
				data={data?.content.data || []}
				columns={columns}
				manualPagination
				rowCount={data?.content.totalElements || 1}
				onPaginationChange={setPagination}
				state={{ pagination }}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							updateProblemTag(row.original);
							closeMenu();
							table.resetRowSelection();
						}}
					>
						<ListItemIcon>
							<Edit />
						</ListItemIcon>
						Update
					</MenuItem>,
					<MenuItem
						key={1}
						onClick={() => {
							removeProducts([row.original.id]);
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
				enableRowSelection={false}
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

export default ProblemTagTable;
