import React, { useState } from 'react'
import { Box, IconButton, Rating, Slider, Tooltip, Typography } from '@mui/material'
import { AcademicFilter, DateRangePicker, SearchField, SelectField } from '@/shared/components'
import dayjs from 'dayjs'
import { useAppDispatch, useAppSelector } from '@shared/store'
import { selectCounselorType, selectFilter, setAvailableFrom, setAvailableTo, setDepartmentId, setExpertiseId, setMajorId, setRatingFrom, setRatingTo, setSearchTerm, setSpecializationId } from './admin-counselor-list-slice'
import { useGetCounselorExpertisesQuery, useGetNonAcademicTopicsQuery } from '@/shared/services'
import { Close, Female, Male } from '@mui/icons-material'

const AdminCounselorFilter = () => {
  const filter = useAppSelector(selectFilter)
  const dispatch = useAppDispatch()

  const { data: expertisesData, isLoading: isLoadingExpertise } = useGetCounselorExpertisesQuery()
  const expertises = expertisesData?.content
  const expertiseOptions = expertises?.map((expertise) => ({ value: expertise.id, label: expertise.name }))

  const handleStartDateChange = (date: string) => {
    dispatch(setAvailableFrom(date || undefined))
  };
  const handleEndDateChange = (date: string) => {
    dispatch(setAvailableTo(date || undefined))
  };

  const handleDepartmentChange = (departmentId: string) => {
    dispatch(setDepartmentId(Number(departmentId) || undefined))
    if (!departmentId) {
      dispatch(setMajorId(undefined))
      dispatch(setSpecializationId(undefined))
    }
  };

  const handleMajorChange = (majorId: string) => {
    dispatch(setMajorId(Number(majorId) || undefined))
    if (!majorId) {
      dispatch(setSpecializationId(undefined))
    }
  };

  const handleSpecializationChange = (specializationId: string) => {
    dispatch(setSpecializationId(Number(specializationId) || undefined))
  };

  const handleExpertiseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setExpertiseId(Number(event.target.value) || undefined))
  };

  const handleRatingChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      dispatch(setRatingFrom(value[0])); // Update ratingFrom
    }
  };
  const handleRatingFromChange = (valueFrom: number | null) => {
    if (valueFrom !== null && filter.ratingTo !== null && valueFrom > filter.ratingTo) {
      dispatch(setRatingFrom(filter.ratingTo));
    } else {
      dispatch(setRatingFrom(valueFrom || undefined));
    }
  };

  const handleRatingToChange = (valueTo: number | null) => {
    if (valueTo !== null && filter.ratingFrom !== null && valueTo < filter.ratingFrom) {
      dispatch(setRatingTo(filter.ratingFrom));
    } else {
      dispatch(setRatingTo(valueTo || undefined));
    }
  };

  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const handleSearch = (searchTerm: string) => {
    dispatch(setSearchTerm(searchTerm))
  }


  return (
    <div className='px-16 flex flex-col gap-16 rounded-lg overflow-auto'>
      <div className='mt-8'>
        <div className="flex items-center gap-8">
          <SearchField
            onSearch={handleSearch}
            className='mt-8'
          />
        </div>
      </div>
      {/* <div>
        <Typography className='font-semibold text-lg mb-8'>Select available date range</Typography>
        <DateRangePicker
          className='mt-8'
          startDate={availableFrom ? dayjs(availableFrom) : null}
          endDate={availableTo ? dayjs(availableTo) : null}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />
      </div>
      <div>
        <Typography className='font-semibold text-lg mb-8'>Select {counselingType === 'ACADEMIC' ? 'specialization' : 'expertise'}</Typography>
        {
          counselingType === 'ACADEMIC'
            ? <AcademicFilter
              className='mt-8'
              onDepartmentChange={handleDepartmentChange}
              onMajorChange={handleMajorChange}
              onSpecializationChange={handleSpecializationChange}
              showClearOptions={true}
            />
            : <SelectField
              className='mt-8 w-full'
              label="Expertise"
              options={expertiseOptions}
              value={filter.expertiseId?.toString()}
              onChange={handleExpertiseChange}
              showClearOptions
            />
        }
      </div>
      <div>
        <Typography className="font-semibold text-lg mb-8">Filter by rating</Typography>
        <Box className="flex flex-col gap-8">
          Rating From 
          <Box className="flex gap-16 items-center  ">
            <Typography className='text-lg text-text-secondary'>From</Typography>
            <Rating
              size='medium'
              name="rating-from"
              value={filter.ratingFrom || null}
              onChange={(_, value) => handleRatingFromChange(value)}
            />
            <Typography className='text-lg text-text-secondary'>to</Typography>
            <Rating
              size='medium'
              name="rating-from"
              value={filter.ratingTo || null}
              onChange={(_, value) => handleRatingToChange(value)}
            />
          </Box>
        </Box>
      </div> */}
      <div className='mt-8'>
        <Typography className="font-semibold text-lg mb-8">Select by gender</Typography>
        <div className="flex items-center gap-8">
          {/* Male Icon */}
          <Tooltip title="Male">
            <IconButton
              size='small'
              onClick={() => {
                setSelectedGender('MALE');
                // field.onChange('MALE');
              }}
              sx={{
                border: selectedGender === 'MALE' ? '2px solid #1976d2' : 'none',
                borderRadius: '50%', // Keep the border round
              }}
            >
              <Male className="text-blue-500" fontSize="large" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Female">
            <IconButton
              size='small'
              onClick={() => {
                setSelectedGender('FEMALE');
                // field.onChange('FEMALE');
              }}
              sx={{
                border: selectedGender === 'FEMALE' ? '2px solid #d32f2f' : 'none',
                borderRadius: '50%',
              }}
            >
              <Female className="text-pink-500" fontSize="large" />
            </IconButton>
          </Tooltip>

          <div className='flex justify-end flex-1'>
            {
              selectedGender &&
              <Tooltip title="Clear gender selection">
                <IconButton
                  size='small'
                  onClick={() => {
                    setSelectedGender('');
                    // field.onChange(''); 
                  }}
                  sx={{
                    borderRadius: '50%',
                  }}
                >
                  <Close /> {/* X Icon for Clear */}
                </IconButton>
              </Tooltip>
            }
          </div>
        </div>
      </div>

    </div >
  )
}

export default AdminCounselorFilter