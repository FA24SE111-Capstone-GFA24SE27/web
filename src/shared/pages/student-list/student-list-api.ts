import { ApiResponse, apiService as api } from '@shared/store';
import { PaginationContent, Student } from '@shared/types';

const addTagTypes = ['students'] as const;

export const studentListApi = api
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getStudentsFilter: build.query<
				GetStudentsFilterApiResponse,
				GetStudentsFilterApiArg
			>({
				query: ({
					studentCode = '',
					specializationId = '',
					departmentId = '',
					majorId = '',
					currentTerm = '',
					semesterIdForGPA = '',
					minGPA = '',
					maxGPA = '',
					isIncludeBehavior = false,
					semesterIdForBehavior = '',
					promptForBehavior = '',
					keyword = '',
					sortBy = 'createdDate',
					sortDirection = 'ASC',
					page = '',
					tab = '',
				}) => {
					if (tab === '') {
						// Call the first API endpoint if the condition is met
						return {
							url: `/api/students/filter`,
							params: {
								studentCode,
								specializationId,
								departmentId,
								majorId,
								currentTerm,
								semesterIdForGPA,
								minGPA,
								maxGPA,
								isIncludeBehavior,
								semesterIdForBehavior,
								promptForBehavior,
								keyword,
								sortBy,
								sortDirection,
								page,
							},
						};
					} else if (tab === 'RECOMMENDED') {
						
						return {
							url: `/api/students/recommendation/filter`,
							params: {
								studentCode,
								specializationId,
								departmentId,
								majorId,
								currentTerm,
								semesterIdForBehavior,
								promptForBehavior,
								keyword,
								sortBy,
								sortDirection,
								page,
							},
						};
					}
				},
				providesTags: ['students'],
			}),
			getRecommendedStudents: build.query<
				GetStudentsFilterApiResponse,
				GetStudentsFilterApiArg
			>({
				query: ({
					studentCode = '',
					specializationId = '',
					departmentId = '',
					majorId = '',
					currentTerm = '',
					semesterIdForBehavior = '',
					promptForBehavior = '',
					keyword = '',
					sortBy = 'createdDate',
					sortDirection = 'ASC',
					page = '',
				}) => ({
					url: `/api/students/recommendation/filter`,
					params: {
						studentCode,
						specializationId,
						departmentId,
						majorId,
						currentTerm,
						semesterIdForBehavior,
						promptForBehavior,
						keyword,
						sortBy,
						sortDirection,
						page,
					},
				}),
				providesTags: ['students'],
			}),
			putExcludeStudentProblemTags: build.mutation<PutExcludeStudentProblemTagsResponse, PutExcludeStudentProblemTagsArgs>({
				query: (arg) => ({
					url: `/api/students/problem-tag/exclude-all/${arg}`,
					method: 'PUT',
				}),
				invalidatesTags: ['students']
			})
		}),
	});

export const { useGetStudentsFilterQuery, useGetRecommendedStudentsQuery, usePutExcludeStudentProblemTagsMutation } =
	studentListApi;

// Define types for the updated API response and arguments
export type GetStudentsFilterApiResponse = PaginationContent<Student>;
export type GetStudentsFilterApiArg = {
	studentCode?: string;
	specializationId?: number | '';
	departmentId?: number | '';
	majorId?: number | '';
	currentTerm?: number;
	semesterIdForGPA?: number | '';
	minGPA?: number | '';
	maxGPA?: number | '';
	isIncludeBehavior?: boolean;
	semesterIdForBehavior?: number | '';
	promptForBehavior?: string;
	keyword?: string;
	sortBy?: string;
	sortDirection?: 'ASC' | 'DESC';
	page?: number;
	tab?: string;
};
type PutExcludeStudentProblemTagsArgs = number | string;
type PutExcludeStudentProblemTagsResponse = ApiResponse<string>;
