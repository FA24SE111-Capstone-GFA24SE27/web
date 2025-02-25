import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import { Heading, NavLinkAdapter } from '@shared/components';
import Box from '@mui/material/Box';
import { Add, CalendarMonth, Search } from '@mui/icons-material';
import { FilterAltOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';

/**
 * The contacts header.
 */
function AppointmentsHeader() {
    // const searchText = useAppSelector(selectSearchText);
    // const { data, isLoading } = useGetContactsListQuery();

    // const filteredData = useAppSelector(selectFilteredContactList(data));

    // useEffect(() => {
    //     return () => {
    //         dispatch(resetSearchText());
    //     };
    // }, []);

    // if (isLoading) {
    //     return null;
    // }
    return (
        <div className='flex justify-between p-32'>
            <Heading
                title='My Appointments'
                description='Counseling appointments that forwarded to the user'
            />
            <div className='flex gap-16'>
                <Button
                    component={NavLinkAdapter}
                    to="../calendar"
                    variant='contained'
                    color='primary'
                    startIcon={<CalendarMonth />}
                >
                    View schedule
                </Button>
                <Button
                    component={NavLinkAdapter}
                    to="create"
                    variant='contained'
                    color='secondary'
                    startIcon={<Add />}
                >
                    Create an appointment
                </Button>
            </div>
        </div>
    );
}

export default AppointmentsHeader;
