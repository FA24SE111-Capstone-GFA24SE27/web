import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import { DatesSetArg } from '@fullcalendar/core';
import { MouseEvent, useState } from 'react';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

type ViewType = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';

const viewNamesObj = {
	dayGridMonth: {
		title: 'Month',
		icon: 'view_module'
	},
	timeGridWeek: {
		title: 'Week',
		icon: 'view_week'
	},
	timeGridDay: {
		title: 'Day',
		icon: 'view_agenda'
	}
};

type ScheduleViewMenuProps = {
	className?: string;
	onChange: (view: string) => void;
	currentDate: DatesSetArg;
};

/**
 * The Schedule view menu.
 */
function ScheduleViewMenu(props: ScheduleViewMenuProps) {
	const { className, currentDate, onChange} = props;
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div className={className}>
			<Button
				sx={{ minWidth: 120 }}
				className="justify-between text-base font-semibold rounded-6"
				id="view-select-button"
				aria-controls="view-select-menu"
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
				variant="outlined"
				endIcon={open ? <ExpandLess /> : <ExpandMore />}
			>
				{currentDate &&
					currentDate.view &&
					viewNamesObj[currentDate.view.type as ViewType] &&
					(viewNamesObj[currentDate.view.type as ViewType] as { title: string }).title}
			</Button>
			<Menu
				id="view-select-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'view-select-button'
				}}
			>
				{Object.entries(viewNamesObj).map(([name, view]) => (
					<MenuItem
						key={name}
						onClick={() => {
							onChange(name);
							handleClose();
						}}
					>
						<ListItemText primary={view.title} />
					</MenuItem>
				))}
			</Menu>
		</div>
	);
}

export default ScheduleViewMenu;
