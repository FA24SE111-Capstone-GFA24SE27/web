import Hidden from '@mui/material/Hidden';
import { Theme } from '@mui/system/createTheme';
import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import NavbarContent from './NavbarContent';
import { navbarToggle, selectNavbar } from './navbar-slice';
import { useAppDispatch, useAppSelector } from '@/shared/store';

const navbarWidth = 320;

type StyledNavBarProps = {
	theme?: Theme;
	open: boolean;
	position: string;
};

const StyledNavBar = styled('div')<StyledNavBarProps>(({ theme, open, position }) => ({
	minWidth: navbarWidth,
	width: navbarWidth,
	maxWidth: navbarWidth,
	...(!open && {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.leavingScreen
		}),
		...(position === 'left' && {
			marginLeft: `-${navbarWidth}px`
		}),
		...(position === 'right' && {
			marginRight: `-${navbarWidth}px`
		})
	}),
	...(open && {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen
		})
	})
}));

const StyledNavBarMobile = styled(SwipeableDrawer)(() => ({
	'& .MuiDrawer-paper': {
		minWidth: navbarWidth,
		width: navbarWidth,
		maxWidth: navbarWidth
	}
}));

/**
 * The navbar style 1.
 */
function NavbarLayout() {
	const dispatch = useAppDispatch();
	// const config = useAppSelector(selectFuseCurrentLayoutConfig) as Layout1ConfigDefaultsType;
	const navbar = useAppSelector(selectNavbar);
	const config = {
		navbar: {
			position: 'left'
		}
	}

	return (
			// {/* <Hidden lgDown>
			// 	<StyledNavBar
			// 		className="sticky top-0 z-20 flex-col flex-auto h-screen overflow-hidden shadow shrink-0"
			// 		open={navbar.open}
			// 		position={config.navbar.position}
			// 	>
			// 		<NavbarContent />
			// 	</StyledNavBar>
			// </Hidden> */}
			<StyledNavBar
				className="sticky top-0 z-20 flex flex-col flex-auto h-screen overflow-hidden shadow shrink-0"
				open={navbar.open}
				position={config.navbar.position}
			>
				<NavbarContent />
			</StyledNavBar>
			// {/* <Hidden lgUp>
			// 	<StyledNavBarMobile
			// 		classes={{
			// 			paper: 'flex-col flex-auto h-full'
			// 		}}
			// 		anchor={config.navbar.position as 'left' | 'top' | 'right' | 'bottom'}
			// 		variant="temporary"
			// 		open={navbar.mobileOpen}
			// 		onClose={() => dispatch(navbarToggle())}
			// 		onOpen={() => { }}
			// 		disableSwipeToOpen
			// 		ModalProps={{
			// 			keepMounted: true // Better open performance on mobile.
			// 		}}
			// 	>
			// 		<NavbarContent />
			// 	</StyledNavBarMobile>
			// </Hidden> */}
	);
}

export default NavbarLayout;
