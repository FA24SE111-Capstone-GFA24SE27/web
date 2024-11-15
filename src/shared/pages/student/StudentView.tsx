import { Add, CakeOutlined, CalendarMonth, Checklist, Description, EmailOutlined, LocalPhoneOutlined } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, DialogActions, DialogContent, DialogTitle, Paper } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { ContentLoading, Gender, NavLinkAdapter, SelectField, closeDialog, openDialog } from '@shared/components';
import dayjs from 'dayjs';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useGetStudentBehaviorAssessmentMutation, useGetStudentDocumentViewQuery, useGetStudentProblemTagDetailsQuery, useGetStudentStudyViewQuery } from './student-api';
import { calculateGPA } from '@/shared/utils';
import { useAppDispatch } from '@shared/store';
import { ReactNode, useState } from 'react';
import { useGetSemestersQuery } from '@/shared/services';
import { ChangeEvent, useEffect } from 'react'
import ReactMarkdown from 'react-markdown';
// import AcademicTranscript from './AcademicTranscript';
// import StudentAppointmentList from './StudentAppointmentList';
// import AttendanceReport from './AttendanceReport';
import { lazy } from 'react'
import { closeStudentView } from '@/features/counselors/counselors-layout-slice';
const AcademicTranscript = lazy(() => import('./AcademicTranscript'))
const StudentAppointmentList = lazy(() => import('./StudentAppointmentList'))
const AttendanceReport = lazy(() => import('./AttendanceReport'))
/**
 * The contact view.
 */

interface StudentViewProps {
  id?: string,
  actionButton?: ReactNode,
}
function StudentView({ id, actionButton }: StudentViewProps) {
  const { id: studentRouteId } = useParams();
  const studentId = id || studentRouteId
  const { data, isLoading } = useGetStudentDocumentViewQuery(studentId);
  const { data: academicTranscriptData } = useGetStudentStudyViewQuery(studentId);
  const [generalAssessment, setGeneralAssessment] = useState<string>()


  const [displayView, setDisplayView] = useState<'' | 'academic_transcrip' | 'attendance_report'>('')
  const [selectedSemester, setSelectedSemester] = useState('');

  const handleSelectSemester = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedSemester(event.target.value);
  };
  const student = data?.content
  const navigate = useNavigate();
  const location = useLocation()

  const studentGpa = calculateGPA(academicTranscriptData?.content)
  const dispatch = useAppDispatch()

  const { data: semesterData } = useGetSemestersQuery()
  const semesterOptions = semesterData?.map(semester => (
    { label: semester.name, value: semester.name }
  )) || []

  const [assessThisSemeseter, { isLoading: isLoadingGeneralAssessment }] = useGetStudentBehaviorAssessmentMutation()
  // const { data: generalAssessment, isFetching: isLoadingGeneralAssessment } = useGetStudentBehaviorAssessmentQuery({
  //   studentId,
  //   semesterName: selectedSemester
  // }, {
  //   skip: !selectedSemester,
  // });

  const handleAssessment = () => {
    assessThisSemeseter({
      studentId,
      semesterName: selectedSemester,
    }).unwrap().then((res) => {
      dispatch(openDialog({
        children: isLoadingGeneralAssessment
          ? <ContentLoading />
          : <div>
            <DialogTitle>Student General Assesssment</DialogTitle>
            <DialogContent>
              <ReactMarkdown>
                {formatMarkdown(res?.message) || ``}
                {/* {res?.message} */}
              </ReactMarkdown>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => dispatch(closeDialog())} color="primary">
                Close
              </Button>
            </DialogActions>
          </div>
      }))
      // setGeneralAssessment(res?.message || ``)
    })
  }

  const { data: studentProblemTagsData } = useGetStudentProblemTagDetailsQuery({
    studentId,
    semesterName: selectedSemester
  }, {
    skip: !selectedSemester
  })
  const studentProblemTags = studentProblemTagsData?.content || []



  useEffect(() => {
    if (semesterData?.length) {
      setSelectedSemester(semesterData.at(-1).name)
    }
  }, [semesterData]);

  if (isLoading) {
    return <ContentLoading className='m-32 w-md' />
  }

  if (!student) {
    return <div className='relative p-48 w-md'>
      <Typography
        color="text.secondary"
        variant="h5"
      >
        Invalid student!
      </Typography>
    </div>
  }

  return (
    <div className=''>
      <Box
        className="relative w-full px-32 h-160 sm:h-192 sm:px-48"
        sx={{
          backgroundColor: 'background.default'
        }}
      >
        <img
          className="absolute inset-0 object-cover w-full h-full"
          src={'/assets/images/fptu-cover.jpeg'}
          alt="user background"
        />
      </Box>
      <div className="relative flex flex-col items-center flex-auto p-24 pt-0 sm:p-48 w-md">
        <div className="w-full max-w-3xl">
          <div className="flex items-end flex-auto -mt-64">
            <Avatar
              sx={{
                borderWidth: 4,
                borderStyle: 'solid',
                borderColor: 'background.paper',
                backgroundColor: 'background.default',
                color: 'text.secondary'
              }}
              className="font-bold w-128 h-128 text-64"
              src={student?.studentProfile.profile.avatarLink}
              alt={student?.studentProfile.profile.fullName}
            >
              {student?.studentProfile.profile.fullName?.charAt(0)}
            </Avatar>
            <Gender gender={student?.studentProfile.profile.gender} />
            {
              <div className="flex items-center mb-4 ml-auto">
                {
                  actionButton === undefined ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{ color: 'white' }}
                      component={NavLinkAdapter}
                      to={`/students/student-list/student/${student?.studentProfile.id}/booking`}
                      onClick={() => {
                        dispatch(closeStudentView())
                      }}
                      startIcon={<Add />}
                    >
                      Create an appointment
                    </Button>
                  ) : actionButton
                }
              </div>
            }
          </div>

          <Typography className="mt-12 text-4xl font-bold truncate">{student?.studentProfile.profile.fullName}</Typography>

          <Typography className="mt-4 text-xl">{student?.studentProfile.studentCode}</Typography>

          <section className='flex flex-col'>
            <Divider className="mt-16 mb-24" />

            <div className="flex flex-col space-y-16">
              {student?.studentProfile.email && (
                <div className="flex items-center">
                  <EmailOutlined />
                  <div className="ml-24 leading-6">{student?.studentProfile.email}</div>
                </div>
              )}

              {student?.studentProfile.profile.phoneNumber && (
                <div className="flex items-center">
                  <LocalPhoneOutlined />
                  <div className="ml-24 leading-6">{student?.studentProfile.profile.phoneNumber}</div>
                </div>
              )}


              {student?.studentProfile.profile.dateOfBirth && (
                <div className="flex items-center">
                  <CakeOutlined />
                  <div className="ml-24 leading-6">{dayjs(student?.studentProfile.profile.dateOfBirth).format('DD-MM-YYYY')}</div>
                </div>
              )}

              {academicTranscriptData && (
                <div className="flex items-center">
                  {/* <SchoolOutlined /> */}
                  <span className='font-semibold'>GPA</span>
                  <div className="flex items-center justify-between w-full ml-20  leading-6">
                    {studentGpa}

                  </div>
                </div>
              )}

              <Divider />
              <div>
                <Typography className='font-semibold'>
                  Learning process
                </Typography>
                <div className='flex gap-16 mt-16'>
                  <Button
                    startIcon={<Description />}
                    variant='outlined'
                    color='secondary'
                    size='small'
                    className={`w-216`}
                    // onClick={() => navigate('academic-transcript')}
                    onClick={(event) => {
                      studentRouteId
                        ? navigate('academic-transcript')
                        : dispatch(openDialog({
                          children: <AcademicTranscript id={studentId} />
                        }));
                    }}
                  >
                    View academic transcript
                  </Button>
                  <Button
                    startIcon={<Checklist />}
                    variant='outlined' color='secondary' size='small' className={`w-216`}
                    onClick={(event) => {
                      studentRouteId
                        ? navigate('attendance-report')
                        : dispatch(openDialog({
                          children: <AttendanceReport id={studentId} />
                        }));
                    }}
                  >
                    View attendance report
                  </Button>
                </div>
              </div>

              <Divider />
              <div>
                <Typography className='font-semibold'>
                  Academic details
                </Typography>
                <Box className="rounded p-8 mt-8">

                  <div className="grid grid-cols-3 gap-y-2 mb-4">
                    <div className="col-span-1 font-medium text-text-secondary">Specialization:</div>
                    <div className="col-span-2">{student?.studentProfile?.specialization?.name}</div>
                  </div>

                  {/* Department Section */}
                  <div className="grid grid-cols-3 gap-y-2 mb-4">
                    <div className="col-span-1 font-medium text-text-secondary">Department:</div>
                    <div className="col-span-2">
                      <span>{student?.studentProfile.department.name}</span>
                      {student?.studentProfile.department.code && (
                        <span className="ml-2 text-text-disabled"> ({student?.studentProfile.department.code})</span>
                      )}
                    </div>
                  </div>

                  {/* Major Section */}
                  <div className="grid grid-cols-3 gap-y-2">
                    <div className="col-span-1 font-medium text-text-secondary">Major:</div>
                    <div className="col-span-2">
                      <span>{student?.studentProfile.major.name}</span>
                      {student?.studentProfile.major.code && (
                        <span className="ml-2 text-text-disabled"> ({student?.studentProfile.major.code})</span>
                      )}
                    </div>
                  </div>
                </Box>
              </div>

              <Divider />
              <div>
                <Typography className='font-semibold'>
                  Behavior Tags
                </Typography>
                <div className='flex justify-between items-center'>
                  <Box className='mt-16'>
                    <SelectField
                      label="Semester"
                      options={semesterOptions}
                      value={selectedSemester}
                      onChange={handleSelectSemester}
                      className='w-192'
                      size='small'
                      showClearOptions
                    />
                  </Box>
                  <Button size='small' color='secondary' variant='contained'
                    disabled={isLoadingGeneralAssessment}
                    onClick={handleAssessment}
                  >Assess selected semester</Button>
                </div>

                <Box className="">
                  {Object.keys(studentProblemTags).map((subject) => (
                    <Accordion key={subject} className="p-0 shadow-0">
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className=''>{subject}</Typography>
                      </AccordionSummary>
                      <AccordionDetails className="flex flex-wrap gap-4">
                        {/* Group tags by category */}
                        {Object.keys(studentProblemTags[subject].isNotExcluded.concat(studentProblemTags[subject].isExcluded).reduce((acc, tag) => {
                          // Group tags by category
                          const { category, problemTagName, number, source, excluded } = tag;
                          if (!acc[category]) {
                            acc[category] = [];
                          }
                          acc[category].push({ problemTagName, number, source, excluded });
                          return acc;
                        }, {})).map((category) => (
                          <Box key={category} className="w-full">
                            <Typography variant="subtitle2" className="font-medium text-text-secondary">
                              {category}
                            </Typography>
                            <div className="flex flex-wrap gap-4 mb-8">
                              {/* Render tags under each category */}
                              {studentProblemTags[subject].isNotExcluded.concat(studentProblemTags[subject].isExcluded)
                                .filter((tag) => tag.category === category)
                                .map((tag, index) => (
                                  <Chip
                                    key={`${category}-${index}`}
                                    label={`${tag.problemTagName} x ${tag.number}`}
                                    variant={tag.excluded ? 'outlined' : 'filled'}
                                    disabled={tag.excluded}
                                  />
                                ))}
                            </div>
                          </Box>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </div>

              <Divider />
              <div>
                <Typography className='font-semibold'>
                  Counseling infomation
                </Typography>
                <div className='flex flex-col gap-8 mt-8'>
                  <div>
                    {/* Psychological and Health Status */}
                    <Accordion className="p-0 shadow-0">
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Psychological and Health Status</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography><strong>Introduction:</strong> {student?.counselingProfile?.introduction || `N/A`}</Typography>
                        <Typography><strong>Current Health Status:</strong> {student?.counselingProfile?.currentHealthStatus || `N/A`}</Typography>
                        <Typography><strong>Psychological Status:</strong> {student?.counselingProfile?.psychologicalStatus || `N/A`}</Typography>
                        <Typography><strong>Stress Factors:</strong> {student?.counselingProfile?.stressFactors || `N/A`}</Typography>
                      </AccordionDetails>
                    </Accordion>

                    {/* Academic Information */}
                    <Accordion className="p-0 shadow-0">
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Academic Information</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography><strong>Academic Difficulties:</strong> {student?.counselingProfile?.academicDifficulties || `N/A`}</Typography>
                        <Typography><strong>Study Plan:</strong> {student?.counselingProfile?.studyPlan || `N/A`}</Typography>
                      </AccordionDetails>
                    </Accordion>

                    {/* Career Information */}
                    <Accordion className="p-0 shadow-0">
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Career Information</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography><strong>Career Goals:</strong> {student?.counselingProfile?.careerGoals || `N/A`}</Typography>
                        <Typography><strong>Part-Time Experience:</strong> {student?.counselingProfile?.partTimeExperience || `N/A`}</Typography>
                        <Typography><strong>Internship Program:</strong> {student?.counselingProfile?.internshipProgram || `N/A`}</Typography>
                      </AccordionDetails>
                    </Accordion>

                    {/* Activities and Lifestyle */}
                    <Accordion className="p-0 shadow-0">
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Activities and Lifestyle</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography><strong>Extracurricular Activities:</strong> {student?.counselingProfile?.extracurricularActivities || `N/A`}</Typography>
                        <Typography><strong>Personal Interests:</strong> {student?.counselingProfile?.personalInterests || `N/A`}</Typography>
                        <Typography><strong>Social Relationships:</strong> {student?.counselingProfile?.socialRelationships || `N/A`}</Typography>
                      </AccordionDetails>
                    </Accordion>

                    {/* Financial Support */}
                    <Accordion className="p-0 shadow-0">
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Financial Support</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography><strong>Financial Situation:</strong> {student?.counselingProfile?.financialSituation || `N/A`}</Typography>
                        <Typography><strong>Financial Support:</strong> {student?.counselingProfile?.financialSupport || `N/A`}</Typography>
                      </AccordionDetails>
                    </Accordion>

                    {/* Counseling Requests */}
                    <Accordion className="p-0 shadow-0">
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Counseling Requests</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography><strong>Desired Counseling Fields:</strong> {student?.counselingProfile?.desiredCounselingFields || `N/A`}</Typography>
                      </AccordionDetails>
                    </Accordion>
                  </div>
                </div>

              </div>

              <Divider />
              <div>
                <Box>
                  <Typography className='font-semibold'>
                    History of couseling
                  </Typography>
                </Box>
                <StudentAppointmentList id={studentId} />
              </div>
            </div>
          </section>

        </div>
      </div>
    </div >
  );
}

export default StudentView;
function formatMarkdown(data) {
  // Clean up any extra spaces and commas
  data = data.replace(/\n\s*\n/g, '\n'); // Remove extra empty lines

  // Add bullet points before each item that needs them
  data = data.replace(/^\s*-\s*/gm, '  - ');  // Ensure proper spacing with bullet points
  data = data.replace(/^\s*([^\n\-].+)/gm, '  - $1'); // Add bullet point where it's missing

  // Process each section header (e.g., Behavioral Performance Overview, Overall Assessment, Conclusion)
  data = data.replace(/###/g, '\n###'); // Add newline before each section header

  // Clean up any unnecessary spaces after section headers
  data = data.replace(/\n{2,}/g, '\n\n'); // Remove redundant blank lines

  return data.trim();
}
