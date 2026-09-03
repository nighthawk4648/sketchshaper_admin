import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Fileinput from '@/components/ui/Fileinput';
import Textarea from '@/components/ui/Textarea';
import Textinput from '@/components/ui/Textinput';
import envConfig from '@/configs/envConfig';
import useSubmit from '@/hooks/useSubmit';
import {
	useCreateSliderMutation,
	useUpdateSliderMutation,
} from '@/store/api/app/website/slider/sliderApiSlice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SliderForm = ({ id, data }) => {
	const { isAuth, auth } = useSelector((state) => state.auth);
	const navigate = useNavigate();

	const {
		register,
		unregister,
		control,
		errors,
		reset,
		handleSubmit,
		onSubmit,
		watch,
		isLoading,
	} = useSubmit(id, id ? useUpdateSliderMutation : useCreateSliderMutation);

	const handleFormSubmit = async (data) => {
		const formData = new FormData();

		const keys = Object.keys(data);

		keys.forEach((key) => {
			if (['image', 'logo'].includes(key)) {
				if (data[key]) {
					formData.append(key, data[key][0]);
				} else {
					formData.append(key, data[key]);
				}
			} else {
				formData.append(key, data[key]);
			}
		});

		await onSubmit(formData);
	};

	useEffect(() => {
		reset({
			name: data?.name,
			short_description: data?.short_description,
		});
	}, [data]);

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Card title={id ? 'Edit Slider' : 'Create New Slider'}>
				<div className="grid grid-cols-1 gap-5">
					<Textinput
						register={register}
						label="Title"
						type="text"
						placeholder="Slider Title"
						name="name"
						required={true}
						error={errors?.name}
					/>

					<Textarea
						name="short_description"
						register={register}
						label="Short Description"
						type="textarea"
						placeholder="Slider short_description"
						row={6}
						required={true}
						error={errors?.short_description}
					/>

					<Fileinput
						selectedFile={watch('image')?.[0]}
						name={'image'}
						defaultUrl={data?.image}

						preview={true}
						control={control}
					/>

					<Fileinput
						selectedFile={watch('logo')?.[0]}
						name={'logo'}
						defaultUrl={data?.logo}

						preview={true}
						control={control}
					/>
				</div>

				<div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse mt-6">
					<Button
						onClick={() => navigate(-1)}
						text="Cancel"
						className="btn-light"
					/>
					<Button
						isLoading={isLoading}
						type="submit"
						text="Save"
						className="btn-dark"
					/>
				</div>
			</Card>
		</form>
	);
};

export default SliderForm;
