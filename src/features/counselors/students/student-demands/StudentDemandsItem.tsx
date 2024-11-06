import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
// import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { ExpandableText, ItemMenu, NavLinkAdapter, UserLabel, UserListItem } from '@/shared/components';
import { Box, Button, Chip, ListItem, Paper, Rating, Tooltip } from '@mui/material';
import { AccessTime, Add, CalendarMonth, ChevronRight, Circle, EmailOutlined, LocalPhoneOutlined, Mail, Phone } from '@mui/icons-material';
import { CounselingDemand, Student } from '@shared/types';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { statusColor } from '@/shared/constants';

type StudentDemandsItemPropsType = {
	demand: CounselingDemand;
};

/**
 * The contact list item.
 */
function StudentDemandsItem({ demand }: StudentDemandsItemPropsType) {

	const navigate = useNavigate()

	return (
		<>
			<Paper
				key={demand.id}
				className="p-16 flex gap-16 shadow"
				sx={{ bgcolor: 'background.paper' }}
			>
				<div className="flex flex-col gap-16 w-full justify-center">
					<ListItem
						className="flex gap-8 px-0"
						secondaryAction={
							<ItemMenu
								menuItems={[
									{
										label: 'Create an appointment',
										icon: <Add fontSize='small' />,
										onClick: () => { navigate(demand.id.toString()) },
										disabled: demand.status !== 'PROCESSING'
									},
								]}
							/>
						}
					>
						<div className="flex gap-8 items-center">
							<AccessTime />
							<Typography>{dayjs(demand.startDateTime).format('YYYY-MM-DD')}</Typography>
							<Typography>
								{dayjs(demand.startDateTime).format('HH:mm')} -{' '}
							</Typography>
						</div>
						<div className="flex gap-8 items-center">
							{
								demand.endDateTime
									? <>
										<Typography>{dayjs(demand.startDateTime).format('YYYY-MM-DD')}</Typography>
										<Typography>
											{dayjs(demand.startDateTime).format('HH:mm')} -{' '}
										</Typography>
									</>
									: <Typography>
										Ongoing
									</Typography>
							}
						</div>

						<UserLabel
							avatarLink={demand.supportStaff?.profile.avatarLink}
							label='Assigned by'
							fullName={demand.supportStaff?.profile.fullName}
						/>

						<Chip
							label={demand.status}
							variant="filled"
							color={statusColor[demand.status]}
							size="small"
						/>
					</ListItem>

					<Tooltip title={`View ${demand.student.profile.fullName}'s profile`}>
						<ListItemButton
							component={NavLinkAdapter}
							to={`student/${demand.student.id}`}
							className="bg-primary-light/5 w-full rounded shadow"
						>
							<UserListItem
								fullName={demand.student.profile.fullName}
								avatarLink={demand.student.profile.avatarLink}
								phoneNumber={demand.student.profile.phoneNumber}
								email={demand.student.email}
							/>
							<ChevronRight />
						</ListItemButton>
					</Tooltip>

					<div className="flex gap-8">
						<Typography className="w-96" color="textSecondary">Summarize:</Typography>
						<ExpandableText text={demand.summarizeNote} limit={144} />
					</div>

					<div className="flex gap-8">
						<Typography className="w-96" color="textSecondary">Contact Note:</Typography>
						<ExpandableText text={demand.contactNote} limit={144} />
					</div>
				</div>
			</Paper >
		</>
	);
}

export default StudentDemandsItem;
