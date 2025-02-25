import { useMemo, useState } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { Chip, MenuItem, ListItemIcon, Tooltip, Typography } from '@mui/material';
import { NavLinkAdapter, DataTable } from '@shared/components';
import { useAppDispatch } from '@shared/store';
import { openDialog } from '@shared/components';
import { AppointmentDetail, StudentView } from '@/shared/pages';
import dayjs from 'dayjs';
import { FollowingStudent, useGeSupportStafftCounselingDemandFilterQuery, useGetSupportStaffFollowingQuery } from '../support-staffs-api';
import { useNavigate, useParams } from 'react-router-dom';
import { CounselingDemand } from '@/shared/types';
import { statusColor } from '@/shared/constants';
import { Visibility } from '@mui/icons-material';
import DemandDetail from '@/shared/pages/demand/DemandDetail';

function DemandTab() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const dispatch = useAppDispatch();

  // Fetch data
  const { data, isLoading } = useGetSupportStaffFollowingQuery({
    staffId: id,
  });

  console.log(data)

  const columns = useMemo<MRT_ColumnDef<FollowingStudent>[]>(() => [
    {
      accessorFn: (row) => row.student?.profile?.fullName || 'N/A', // Student Full Name
      header: 'Student',
      Cell: ({ row }) => (
        <Typography
          component={NavLinkAdapter}
          to={`/management/student/${row.original.student.profile.id}`}
          className="!underline !text-secondary-main"
          color="secondary"
        >
          {row.original.student.profile.fullName}
        </Typography>
      )
    },
    {
      accessorFn: (row) => dayjs(row.followDate).format('YYYY-MM-DD HH:mm'), // Start DateTime
      header: 'Follow Date',
    },
    {
      accessorFn: (row) => row.followNote,
      header: 'Follow note',
    },
  ], []);



  return (
    <DataTable
      data={data?.content.data || []}
      columns={columns}
      manualPagination
      rowCount={data?.content.data.length}
      onPaginationChange={setPagination}
      state={{ pagination }}
      enableColumnFilterModes={false}
      enableGlobalFilter={false} // Disable global search
      renderRowActionMenuItems={({ closeMenu, row, table }) => [
        <MenuItem
          key={0}
          onClick={() => {
            dispatch(openDialog({
              children: <StudentView id={row.original.student.profile.id.toString()} actionButton={null} />
            }));
            closeMenu();
            table.resetRowSelection();
          }}
        >
          <ListItemIcon>
            <Visibility />
          </ListItemIcon>
          View Detail
        </MenuItem>,
      ]}
    />
  );
}

export default DemandTab;
