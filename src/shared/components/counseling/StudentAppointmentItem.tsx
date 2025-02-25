import { openCounselorView } from '@/features/students/students-layout-slice';
import { ExpandableText, ItemMenu, UserListItem, closeDialog, openDialog } from '@/shared/components';
import { statusColor } from '@/shared/constants';
import { AppointmentDetail } from '@/shared/pages';
import { Appointment } from '@/shared/types';
import { splitUserAndReason } from '@/shared/utils';
import { useCancelCounselingAppointmentMutation, useSendCouselingAppointmentFeedbackMutation } from '@features/students/services/activity/activity-api';
import { AccessTime, CalendarMonth, Circle, Clear, Visibility } from '@mui/icons-material';
import { Box, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, ListItem, ListItemButton, Paper, Rating, TextField, Tooltip, Typography } from '@mui/material';
import { useAppDispatch } from '@shared/store';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type AppointmentItemProps = {
  appointment: Appointment,
  handleCloseDialog?: () => void,
  openDetail?: boolean
}
const StudentAppointmentItem = (props: AppointmentItemProps) => {
  const { appointment, handleCloseDialog = () => { }, openDetail } = props

  const dispatch = useAppDispatch()


  const navigate = useNavigate()

  if (!appointment) {
    return
  }

  return (
    <Paper
      key={appointment.id}
      className="flex flex-col gap-8 shadow"
    >
      <div className='flex flex-col w-full gap-16 p-16'>
        <ListItem className='flex justify-between p-0 gap-16'
        >
          <div className='flex flex-wrap items-center gap-16'>
            <div className='flex items-center gap-8'>
              <CalendarMonth />
              <Typography className='' >{dayjs(appointment.startDateTime).format('YYYY-MM-DD')}</Typography>
            </div>
            <div className='flex items-center gap-8'>
              <AccessTime />
              <Typography className=''>{dayjs(appointment.startDateTime).format('HH:mm')} - {dayjs(appointment.endDateTime).format('HH:mm')}</Typography>
            </div>
            <Chip
              label={appointment.meetingType == 'ONLINE' ? 'Online' : 'Offline'}
              icon={<Circle color={appointment.meetingType == 'ONLINE' ? 'success' : 'disabled'} />}
              className='items-center font-semibold'
              size='small'
            />
            <Chip
              label={appointment.status}
              variant='filled'
              color={statusColor[appointment.status]}
              size='small'
            />
          </div>

          <ItemMenu
            menuItems={[
              {
                label: 'View details',
                onClick: () => {
                  if (openDetail) {
                    dispatch(openDialog({
                      children: <AppointmentDetail id={appointment.id.toString()} />
                    }))
                    return;
                  }
                  navigate(`appointment/${appointment.id}`)
                  // navigate(`/services/activity/appointment/${appointment.id}`)
                },
                icon: <Visibility fontSize='small' />
              },
              ...(['WAITING'].includes(appointment?.status) ? [{
                label: 'Cancel',
                onClick: () => {
                  dispatch(
                    openDialog({
                      children: <CancelAppointmentDialog appointment={appointment} handleCloseDialog={handleCloseDialog} />
                    })
                  )
                },
                icon: <Clear fontSize='small' />
              }] : []),
            ]}
          />
        </ListItem>

        {appointment.cancelReason && (
          <div className='flex items-center gap-8'>
            <Typography className='' color='textSecondary'>Canceled by {splitUserAndReason(appointment.cancelReason).user.toLowerCase()}:</Typography>
            <Typography className='font-semibold' color='error'>{splitUserAndReason(appointment.cancelReason).reason}</Typography>
          </div>
        )}
        <div className='flex gap-4'>
          {appointment.meetingType === 'ONLINE' ? (
            <div className='flex items-center gap-24'>
              {appointment.meetUrl && (
                <div className='flex items-center gap-8'>
                  <Typography className='w-60' color='textSecondary'>Location:</Typography>
                  <Link to={appointment.meetUrl} target='_blank' className='py-4 px-8 rounded !text-secondary-main !underline'>
                    {appointment.meetUrl}
                  </Link>
                </div>
              )}
            </div>
          ) : appointment.address && (
            <div className='flex items-center gap-8'>
              <Typography className='w-60' color='textSecondary'>Address:</Typography>
              <Typography className='font-semibold'>{appointment.address || ''}</Typography>
            </div>
          )}
        </div>
        <Tooltip title={`View ${appointment.counselorInfo.profile.fullName}'s profile`}>
          <ListItemButton
            // component={NavLinkAdapter}
            // to={`counselor/${appointment.counselorInfo.profile.id}`}
            onClick={() => {
              handleCloseDialog()
              dispatch(openCounselorView(appointment.counselorInfo.profile.id.toString()))
            }}
            className='flex-1 rounded shadow bg-primary-light/5'
          >
            <UserListItem
              fullName={appointment.counselorInfo.profile.fullName}
              avatarLink={appointment.counselorInfo.profile.avatarLink}
              phoneNumber={appointment.counselorInfo.profile.phoneNumber}
              email={appointment.counselorInfo.email}
            />
            {/* <ChevronRight /> */}
          </ListItemButton>
        </Tooltip>
      </div>
      {appointment.appointmentFeedback ?
        <div className='w-full px-16 pb-16'>
          <Divider/>
          <div className='flex items-start gap-16 mt-8'>
            <Typography color='textSecondary' className='pt-2 w-60'>Feedback:</Typography>
            <div className='flex-1'>
              <div>
                <div className='flex items-center gap-8'>
                  <Rating
                    size='medium'
                    value={appointment.appointmentFeedback.rating}
                    readOnly
                  />
                  <Typography color='text.secondary'>{dayjs(appointment.appointmentFeedback.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
                </div>
              </div>
              <ExpandableText className='pl-4 mt-8' text={appointment.appointmentFeedback.comment} limit={96} />
              {/* <Typography className='pl-8 mt-8' sx={{ color: 'text.secondary' }}>{appointment.appointmentFeedback.comment}</Typography> */}
            </div>
          </div>
        </div>
        : appointment.status === 'ATTEND' && <>
          <Box className='flex justify-end w-full gap-16 px-16 py-8 bg-primary-light/5 '>
            <Divider />
            {/* <Typography className='font-semibold'>Send feedback about the appointment!</Typography> */}
            <div className='flex'>
              <Button
                variant='contained'
                color='secondary'
                size='large'
                onClick={(e) => {
                  e.stopPropagation()
                  dispatch(openDialog({
                    children: (
                      <SendFeedbackDialog appointment={appointment} handleCloseDialog={handleCloseDialog} />
                    )
                  }))
                }}
              >
                Leave a review
              </Button>
            </div>
          </Box>
        </>
      }
    </Paper>
  )
}


const SendFeedbackDialog = ({ appointment, handleCloseDialog = () => { } }: AppointmentItemProps) => {
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(0)
  const dispatch = useAppDispatch()
  const [sendFeedback] = useSendCouselingAppointmentFeedbackMutation()
  const handleSendFeedback = () => {
    sendFeedback({
      appointmentId: appointment.id,
      feedback: {
        comment,
        rating
      }
    })
    dispatch(closeDialog())
    handleCloseDialog()
  }

  return (
    <div className='w-[50rem]'>
      <DialogTitle id="alert-dialog-title">Review the counseling session?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography>Give a feedback for counselor</Typography>
          <TextField
            autoFocus
            margin="dense"
            name={'comment'}
            label={'Comment'}
            fullWidth
            multiline
            rows={4}
            maxRows={4}

            value={comment}
            className='mt-16'
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setComment(event.target.value);
            }} />
          <div className='mt-16'>
            <Typography component="legend">Rate this session</Typography>
            <Rating
              name="simple-controlled"
              value={rating}
              onChange={(event, newRating) => {
                setRating(newRating);
              }}
            />
          </div>

        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dispatch(closeDialog())}
          color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => handleSendFeedback()}
          color="secondary" variant='contained'
          disabled={!comment || !rating}
        >
          Confirm
        </Button>
      </DialogActions>
    </div>
  )
}


const CancelAppointmentDialog = ({ appointment, handleCloseDialog = () => { } }: AppointmentItemProps) => {
  const [cancelAppointment, { isLoading }] = useCancelCounselingAppointmentMutation();
  const [cancelReason, setCancelReasonl] = useState(``);
  const dispatch = useAppDispatch();
  const handleCancelAppointment = () => {
    cancelAppointment({
      appointmentId: appointment.id,
      reason: cancelReason
    }).unwrap()
      .then(() => {
        dispatch(closeDialog())
        handleCloseDialog()
      })
  }
  return (
    <div className='w-[40rem]'>
      <DialogTitle id="alert-dialog-title">Confirm cancelling appointment?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <div>
            Give the reason for cancelling
          </div>
          <div>
            <TextField
              autoFocus
              margin="dense"
              name={'Cancel reason'}
              label={'Cancel reason'}
              fullWidth
              value={cancelReason}
              variant="standard"
              className='mt-16'
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setCancelReasonl(event.target.value);
              }} />
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dispatch(closeDialog())} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleCancelAppointment}
          color="secondary" variant='contained'
          disabled={!cancelReason || isLoading}
        >
          Confirm
        </Button>
      </DialogActions>
    </div>
  );
}

export default StudentAppointmentItem

