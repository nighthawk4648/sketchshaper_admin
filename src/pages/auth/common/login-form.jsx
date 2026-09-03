import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Textinput from '@/components/ui/Textinput';
import { useLoginMutation } from '@/store/api/auth/authApiSlice';
import { setUser } from '@/store/api/auth/authSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const schema = yup
	.object({
		email: yup
			.string()
			.email('Please enter a valid email address')
			.required('Email is required'),
		password: yup.string().required('Password is required'),
	})
	.required();

const LoginForm = () => {
	const [login, { isLoading }] = useLoginMutation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm({
		resolver: yupResolver(schema),
	});

	const onSubmit = async (data) => {
		try {
			const requestData = {
				email: data.email,
				password: data.password,
			};

			const { data: response, error } = await login(requestData);

			if (error)
				throw new Error(error?.data?.message || 'Something went wrong!');

			dispatch(setUser(response.data));
			navigate(`/`);
			toast.success('Login Successful');
		} catch (error) {
			toast.error(error.message);
		}
	};

	const [checked, setChecked] = useState(false);

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="space-y-4 "
			autoComplete="true"
		>
			<Textinput
				name="email"
				label="Email"
				type="email"
				register={register}
				error={errors.email}
				className="h-[48px]"
			/>
			<Textinput
				name="password"
				label="Password"
				type="password"
				register={register}
				error={errors.password}
				className="h-[48px]"
			/>
			<div className="flex justify-between">
				<Checkbox
					value={checked}
					onChange={() => setChecked(!checked)}
					label="Keep me signed in"
				/>
				{/* <Link
          to="/forgot-password"
          className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
        >
          Forgot Password?{" "}
        </Link> */}
			</div>

			<Button
				type="submit"
				text="Sign in"
				className="btn btn-dark block w-full text-center "
				isLoading={isLoading}
			/>
		</form>
	);
};

export default LoginForm;
