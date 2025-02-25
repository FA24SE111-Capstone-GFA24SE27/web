import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import {
	getApiErrorMessage,
	setAccessToken,
	setAccount,
	setRefreshToken,
	useAppDispatch,
	useAppSelector,
} from '@shared/store';
import { useLoginDefaultMutation } from '../auth-api';
import { Typography } from '@mui/material';
import { openDialog } from '@/shared/components';
import { ForgotPasswordForm } from '@/shared/pages';
/**
 * Form Validation Schema
 */
const schema = z.object({
	email: z
		.string()
		.email('You must enter a valid email')
		.min(1, 'You must enter an email'),
	password: z.string(),
	// .min(6, 'Password is too short - must be at least 4 chars.')
});

type FormType = {
	email: string;
	password: string;
	remember?: boolean;
};

const defaultValues = {
	email: '',
	password: '',
	remember: true,
};

function SignInForm() {
	// const { signIn } = useJwtAuth();
	const dispatch = useAppDispatch();
	const { control, formState, handleSubmit, setValue, setError } =
		useForm<FormType>({
			mode: 'onChange',
			defaultValues,
			resolver: zodResolver(schema),
		});

	const [loginDefault, { isLoading }] = useLoginDefaultMutation();

	// const serverError = getApiErrorMessage(error)

	const [serverError, setServerError] = useState(``);

	const { isValid, dirtyFields, errors } = formState;

	// useEffect(() => {
	// 	setValue('email', 'sm1', { shouldDirty: true, shouldValidate: true });
	// 	setValue('password', 's', { shouldDirty: true, shouldValidate: true });
	// }, [setValue]);

	function onSubmit(formData: FormType) {
		const { email, password } = formData;

		loginDefault({ email, password })
			.unwrap()
			.then((response) => {
				const { account, accessToken, refreshToken } = response.content;
				dispatch(setAccount(account));
				dispatch(setRefreshToken(refreshToken));
				dispatch(setAccessToken(accessToken));
			})
			.catch((error) => {
				setServerError(getApiErrorMessage(error));
			});
	}

	return (
		<form
			name='loginForm'
			noValidate
			className='flex flex-col justify-center w-full mt-32'
			onSubmit={handleSubmit(onSubmit)}
		>
			<Controller
				name='email'
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className='mb-24'
						label='Email'
						autoFocus
						type='email'
						error={!!errors.email}
						helperText={errors?.email?.message}
						variant='outlined'
						required
						fullWidth
					/>
				)}
			/>

			<Controller
				name='password'
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className='mb-24'
						label='Password'
						type='password'
						error={!!errors.password}
						helperText={errors?.password?.message}
						variant='outlined'
						required
						fullWidth
					/>
				)}
			/>

			<div className='flex flex-col items-center justify-center sm:flex-row sm:justify-end'>
				{/* <Controller
					name="remember"
					control={control}
					render={({ field }) => (
						<FormControl>
							<FormControlLabel
								label="Remember me"
								control={
									<Checkbox
										size="small"
										{...field}
									/>
								}
							/>
						</FormControl>
					)}
				/> */}

				<Button
					size='small'
					variant='text'
					type='button'
					onClick={() => {
						dispatch(
							openDialog({
								children: <ForgotPasswordForm />,
							})
						);
					}}
				>
					Forgot password?
				</Button>
			</div>

			{serverError && (
				<Typography color='error'>{serverError}</Typography>
			)}

			<Button
				variant='contained'
				className='w-full mt-16 '
				color='secondary'
				aria-label='Sign in'
				disabled={_.isEmpty(dirtyFields) || !isValid || isLoading}
				type='submit'
				size='large'
			>
				Sign in
			</Button>
		</form>
	);
}

export default SignInForm;
