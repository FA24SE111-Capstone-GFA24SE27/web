import { Account, Counselor, PaginationContent, Question, Student, User } from '@shared/types';
import { ApiResponse, apiService as api } from '@shared/store'


export const addTagTypes = [
  'qna', 'one-qna'
] as const;


export const studentQnasApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getStudentQuestions: build.query<GetStudentQuestionsApiResponse, GetStudentQuestionsApiArg>({
        query: ({
          keyword = '',
          status = '',
          isTaken = '',
          isClosed = '',
          isChatSessionClosed = '',
          type = '',
          sortBy = 'createdDate',
          sortDirection = 'DESC',
          page = 1,
          topicId = ''
        }) => ({
          url: `/api/question-cards/student/filter`,
          method: 'GET',
          params: {
            keyword,
            status,
            isTaken,
            isClosed,
            isChatSessionClosed,
            type,
            sortBy,
            sortDirection,
            page,
            topicId
          },
        }),
        providesTags: ['qna']
      }),
      getMyStudentQuestions: build.query<GetStudentQuestionsApiResponse, GetStudentQuestionsApiArg>({
        query: ({ }) => ({
          url: `/api/question-cards/student/filter`,
          method: 'GET',
        }),
        providesTags: ['qna']
      }),
      postQuestion: build.mutation<void, PostQuestionApiArg>({
        query: (arg) => ({
          url: `/api/question-cards`,
          method: 'POST',
          body: arg
        }),
        invalidatesTags: ['qna']
      }),
      editQuestion: build.mutation<void, EditQuestionApiArg>({
        query: (arg) => ({
          url: `/api/question-cards/edit/${arg.questionCardId}`,
          method: 'PUT',
          body: arg.question
        }),
        invalidatesTags: ['qna']
      }),
      getStudentQuestion: build.query<GetQuestionApiResponse, string>({
        query: (questionCardId) => ({
          url: `/api/question-cards/student/${questionCardId}`,
        }),
        providesTags: ['one-qna']
      }),
      getBanInfo: build.query<GetBanInfoApiResponse, void>({
        query: () => ({
          url: `/api/question-cards/student/ban-info`,
          method: 'GET',
        }),
        providesTags: ['qna']
      }),
      closeQuestionStudent: build.mutation<void, number>({
        query: (questionCardId) => ({
          url: `/api/question-cards/student/close/${questionCardId}`,
          method: 'POST'
        }),
        invalidatesTags: ['qna']
      }),
      deleteQuestionStudent: build.mutation<void, number>({
        query: (questionCardId) => ({
          url: `/api/question-cards/delete/${questionCardId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['qna']
      }),
    })
  })

export const {
  useGetStudentQuestionsQuery,
  usePostQuestionMutation,
  useEditQuestionMutation,
  useGetStudentQuestionQuery,
  useGetMyStudentQuestionsQuery,
  useGetBanInfoQuery,
  useCloseQuestionStudentMutation,
  useDeleteQuestionStudentMutation
} = studentQnasApi

export type GetStudentQuestionsApiResponse = ApiResponse<PaginationContent<Question>>

export type GetQuestionApiResponse = ApiResponse<Question>

export type GetStudentQuestionsApiArg = {
  keyword?: string;
  status?: string;
  isTaken?: boolean | string;
  isClosed?: boolean | string;
  isChatSessionClosed?: boolean;
  type?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
  topicId?: string
};

export type PostQuestionApiArg = QuestionPayload

export type EditQuestionApiArg = {
  questionCardId: number,
  question: QuestionPayload
}

export type QuestionPayload = {
  content: string,
  questionType: 'ACADEMIC' | 'NON_ACADEMIC',
  specializationId?: string,
  departmentId?: string,
  majorId?: string,
  expertiseId?: string,
}
export type SendMessageApiArg = {
  content: string,
  sessionId: number,
}




export type Question = {
  id: number;
  title: string;
  content: string;
  answer: string | null,
  questionType: 'ACADEMIC' | 'NON_ACADEMIC';
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
  student: Student;
  counselor: Counselor | null;
  chatSession: ChatSession
  closed: boolean;
  taken: boolean;
  topic: {
    id: number;
    name: string;
    type: string;
  };
}


export type ChatSession = {
  id: number,
  closed: boolean,
  lastInteractionDate: string,
  messages: Message[]
}

export type Message = {
  id: number,
  chatSession: string,
  content: string,
  read: boolean,
  sender: Account,
  sentAt: string,
}
export type GetBanInfoApiResponse = BanInfo
export type BanInfo = {
  banStartDate: string;
  banEndDate: string;
  questionFlags: {
    id: number;
    reason: string;
    flagDate: string;
    questionCard: Question;
  }[]
  ban: boolean;
};