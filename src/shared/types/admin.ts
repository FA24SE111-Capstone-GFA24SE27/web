import { string } from 'zod';

export type ProblemTagCategory = {
	id: number;
	name: string;
};

export type ProblemTag = {
	id: number;
	name: string;
	point: number;
	category: ProblemTagCategory;
};