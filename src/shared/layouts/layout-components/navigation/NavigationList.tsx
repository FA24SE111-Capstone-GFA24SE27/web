import { roles } from '@/shared/constants';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { Fragment, memo, useState } from 'react';
import { roleBasedNavigation } from './role-based-navigation';
import { Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const navigationList = roleBasedNavigation[roles.STUDENT].list
function NavigationList() {
    const [open, setOpen] = useState(true);
    const [selectedItem, setSelectedItem] = useState('home')


    const location = useLocation();
    const { pathname } = location;

    const handleOpen = () => {
        setOpen(!open);
    };

    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path)
    }

    return (
        <div className='px-8'>
            <List
                sx={{ width: '100%'}}
                component="nav"
                aria-labelledby="nested-list-subheader"
            >
                {navigationList.map(sublist => (
                    <div key={sublist.name} >
                        <div className='my-8 flex flex-col'>
                            <Typography variant="overline" className='font-bold'>{sublist.name}</Typography>
                            <Typography variant="caption" className='text-black/80'>{sublist.description}</Typography>
                        </div>
                        {sublist.items.map(item => (
                            <Fragment key={item.name}>
                                <ListItemButton
                                    onClick={item.children
                                        ? handleOpen :
                                        () => handleNavigation(`${sublist.route}/${item.route}`)}
                                    selected={pathname.includes(item.route)}
                                >
                                    <ListItemIcon>
                                        {<item.icon />}
                                    </ListItemIcon>
                                    <ListItemText primary={item.name} />
                                    {item.children && (open ? <ExpandLess /> : <ExpandMore />)}
                                </ListItemButton>
                                {item.children && (
                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {item.children.map(nestedItem => (
                                                <ListItemButton
                                                    key={nestedItem.name}
                                                    onClick={() => handleNavigation(`${sublist.route}/${item.route}/${nestedItem.route}`)}
                                                    sx={{ pl: 4 }}
                                                    selected={pathname.includes(item.route)} >
                                                    <ListItemIcon>
                                                        {<nestedItem.icon />}
                                                    </ListItemIcon>
                                                    <ListItemText primary={nestedItem.name} />
                                                </ListItemButton>
                                            ))}
                                        </List>
                                    </Collapse>
                                )}
                            </Fragment>
                        ))}
                    </div>
                ))}
            </List>
        </div>
    );
}

export default memo(NavigationList)