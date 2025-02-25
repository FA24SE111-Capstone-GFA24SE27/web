import { AppointmentScheduleType, HolidayScheduleType } from '@/shared/types';
import { ApiResponse, apiService } from '@shared/store';

export const addTagTypes = ['appointments, holidays'];

export const calendarApi = apiService
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getAppointmentSchedule: build.query<
				GetAppointmentApiResponse,
				GetAppointmentApiArg
			>({
				query: ({ fromDate, toDate }) => ({
					url: `/api/booking-counseling/appointment?fromDate=${fromDate}&toDate=${toDate}`,
				}),
				providesTags: ['appointments'],
			}),
			getHolidaySchedule: build.query<
				GetHolidaysApiResponse,
				GetHolidaysApiArg
			>({
				query: () => ({
					url: `/api/holidays`,
				}),
				providesTags: ['holidays'],
			}),
		}),
	});

type GetHolidaysApiResponse = ApiResponse<HolidayScheduleType[]>;
type GetHolidaysApiArg = {};
export type GetAppointmentApiResponse = ApiResponse<AppointmentScheduleType[]>;
export type GetAppointmentApiArg = {
	fromDate: string;
	toDate: string;
};

export const { useGetAppointmentScheduleQuery, useGetHolidayScheduleQuery } =
	calendarApi;
