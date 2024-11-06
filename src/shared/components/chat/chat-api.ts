import {
	Account,
	ChatSession,
	Counselor,
	Message,
	PaginationContent,
	Question,
	Student,
	User,
} from '@shared/types';
import { ApiResponse, apiService as api } from '@shared/store';
import { Role } from '@/shared/constants';
import { Topic } from '@/shared/services';

export const addTagTypes = ['qna', 'chat'] as const;

export const chatApi = api
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			sendMessage: build.mutation<void, SendMessageApiArg>({
				query: ({ sessionId, content }) => ({
					url: `/api/question-cards/send/${sessionId}/messages`,
					method: 'POST',
					body: { content },
				}),
			}),
			readMessage: build.mutation<void, number>({
				query: (chatSessionId) => ({
					url: `/api/question-cards/read/${chatSessionId}/messages`,
					method: 'PUT',
				}),
				invalidatesTags: ['chat'],
			}),
			getCounselorMessages: build.query<ApiResponse<ChatSession>, number>({
				query: (arg) => ({
					url: `/api/question-cards/counselor/message/${arg}`,
				}),
				providesTags: ['chat'],
			}),
      getStudentMessages: build.query<ApiResponse<ChatSession>, number>({
				query: (arg) => ({
					url: `/api/question-cards/student/message/${arg}`,
				}),
				providesTags: ['chat'],
			}),
		}),
	});

export const { useReadMessageMutation, useSendMessageMutation, useGetCounselorMessagesQuery, useGetStudentMessagesQuery } = chatApi;

export type SendMessageApiArg = {
	content: string;
	sessionId: number;
};