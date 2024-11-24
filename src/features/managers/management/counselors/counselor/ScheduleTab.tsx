import CalendarBody from '@/features/counselors/counseling/calendar/calendar-components/CalendarBody'
import CalendarHeader from '@/features/counselors/counseling/calendar/calendar-components/CalendarHeader'
import { DatesSetArg } from '@fullcalendar/core/index.js';
import FullCalendar from '@fullcalendar/react';
import React, { useRef, useState } from 'react'
import { useGetCounselorAppointmentsManagementQuery, useGetCounselorScheduleAppointmentsQuery } from '../counselors-api';
import { selectAccount, useAppSelector } from '@shared/store';
import { Schedule } from '@/shared/components';
import { useParams } from 'react-router-dom';

const ScheduleTab = () => {
  const account = useAppSelector(selectAccount)
  const [currentDate, setCurrentDate] = useState<DatesSetArg>();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const { id } = useParams()

  const calendarRef = useRef<FullCalendar>(null);
  return (
    <div>
      <Schedule 
      getScheduleHook={useGetCounselorScheduleAppointmentsQuery}
      id={Number(id)}
      />
    </div>
  )
}

export default ScheduleTab