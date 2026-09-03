import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useSubmit = (id, hook, redirect) => {
	const navigate = useNavigate();

	const {
		register,
		unregister,
		control,
		formState: { errors },
		reset,
		handleSubmit,
		watch,
	} = useForm();

	const [submit, { isLoading, isSuccess, isError, error }] = hook();

	const onSubmit = async (preparedData) => {
		try {
			const { data } = await (id
				? submit({ id, data: preparedData })
				: submit(preparedData));

			if (data?.status !== 'success') {
				throw new Error(data?.message || 'Error occurred from server!');
			}
			reset();
			if (redirect !== false) {
				navigate(redirect ? redirect : -1);
			}
			toast.success(data?.message);
		} catch (error) {
			console.log(error);
			toast.error(error.message || 'Something went wrong!');
		}
	};

	return {
		register,
		unregister,
		control,
		errors,
		reset,
		handleSubmit,
		watch,
		onSubmit,
		isLoading,
	};
};

export default useSubmit;
