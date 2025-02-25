import React from 'react';
import { useEffect, useState } from 'react';
import {
	filterToggle,
	selectFilter,
	setPromptForBehavior,
	setSearchTerm,
	setSemesterIdForBehavior,
} from './recommended-list-slice';
import { useGetSemestersQuery } from '@/shared/services';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { CheckboxField, SearchField, SelectField } from '@/shared/components';
import { Psychology } from '@mui/icons-material';
import StaffStudentListFilterButton from '../StaffStudentListFilterButton';

const Header = () => {
	const filter = useAppSelector(selectFilter);
	const dispatch = useAppDispatch();

	const handlePromptForBehavior = (searchTerm) => {
		dispatch(setPromptForBehavior(searchTerm));
	};
	// const semesterOptions = [
	// 	{ label: '1', value: '1' },
	// 	{ label: '2', value: '2' },
	// 	{ label: '3', value: '3' },
	// 	{ label: '4', value: '4' },
	// 	{ label: '5', value: '5' },
	// 	{ label: '6', value: '6' },
	// 	{ label: '7', value: '7' },
	// 	{ label: '8', value: '8' },
	// 	{ label: '9', value: '9' },
	// ];

	const { data: semesterData, isLoading: isLoadingSemesterData } =
		useGetSemestersQuery();

	const semesterOptions = semesterData?.map((semester) => ({
		label: semester.name,
		value: semester.id,
	}));

	const handleSelectSemester = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (event.target.value) {
			dispatch(setSemesterIdForBehavior(Number(event.target.value)));
		} else {
			dispatch(setSemesterIdForBehavior(''));
		}
		// dispatch(setPromptForBehavior(''));
	};

	const handleSearch = (searchTerm: string) => {
		dispatch(setSearchTerm(searchTerm));
	};

	return (
		<div className='flex items-center flex-1'>
			<div className='flex flex-col w-full gap-16 pt-16 pb-8'>
				<div className='flex'>
					<SearchField
						onSearch={handleSearch}
						label='Name'
						placeholder='John Doe'
						size='medium'
					/>

					<div className=''>
						{!filter.open && (
							<StaffStudentListFilterButton
								onClick={() => dispatch(filterToggle())}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Header;
