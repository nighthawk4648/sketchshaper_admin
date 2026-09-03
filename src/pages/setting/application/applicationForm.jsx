import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Fileinput from '@/components/ui/Fileinput';
import Textarea from '@/components/ui/Textarea';
import Textinput from '@/components/ui/Textinput';
import envConfig from '@/configs/envConfig';
import useSubmit from '@/hooks/useSubmit';
import { useCreateApplicationMutation } from '@/store/api/app/setting/application/applicationApiSlice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ApplicationForm = ({ data }) => {
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
	} = useSubmit(null, useCreateApplicationMutation);

	const handleFormSubmit = async (data) => {
		// Manipulate the data as needed
		const formData = new FormData();

		const keys = Object.keys(data);

		keys.forEach((key) => {
			if (['logo'].includes(key)) {
				if (data[key]) {
					formData.append('logo', data.logo[0]);
				} else {
					formData.append('logo', data.logo);
				}
			} else {
				formData.append(key, data[key]);
			}
		});

		keys.forEach((key) => {
			if (['photo'].includes(key)) {
				if (data[key]) {
					formData.append('photo', data.photo[0]);
				} else {
					formData.append('photo', data.photo);
				}
			} else {
				formData.append(key, data[key]);
			}
		});

		formData.append('admin_id', auth?.user?.user_info?.id);

		await onSubmit(formData);
	};

	useEffect(() => {
		reset({
			name: data?.name,
			email: data?.email,
			countact_number: data?.countact_number,
			address: data?.address,
			app_link: data?.app_link,
			meta_author: data?.meta_author,
			meta_keywords: data?.meta_keywords,
			meta_description: data?.meta_description,
			google_map: data?.google_map,
		});
	}, [data]);

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Card title="Application">
				<div className="grid grid-cols-1 gap-5">
					<Textinput
						register={register}
						label="Name"
						type="text"
						placeholder="Name"
						name="name"
						required={true}
						error={errors?.name}
					/>
					<Textinput
						register={register}
						label="Email"
						type="text"
						placeholder="Email"
						name="email"
						required={true}
						error={errors?.email}
					/>
					<Textinput
						register={register}
						label="Contact Number"
						type="text"
						placeholder="Contact Number"
						name="countact_number"
						required={true}
						error={errors?.countact_number}
					/>

					<Textarea
						name="address"
						register={register}
						label="Address"
						type="textarea"
						placeholder="Address"
						row={3}
						required={true}
						error={errors?.address}
					/>

					<Fileinput
						selectedFile={watch('logo')?.[0]}
						name={'logo'}
						defaultUrl={data?.logo}

						preview={true}
						placeholder='LOGO'
						control={control}
					/>


					<Fileinput
						selectedFile={watch('photo')?.[0]}
						name={'photo'}
						defaultUrl={data?.photo}

						preview={true}
						placeholder='Footer Logo'
						control={control}
					/>

					<Textinput
						register={register}
						label="App Link"
						type="text"
						placeholder="App Link"
						name="app_link"
						required={true}
						error={errors?.app_link}
					/>

					<Textarea
						name="meta_author"
						register={register}
						label="Meta Author"
						type="textarea"
						placeholder="Meta Author"
						row={4}
						required={true}
						error={errors?.meta_author}
					/>

					<Textarea
						name="meta_keywords"
						register={register}
						label="Meta Keywords"
						type="textarea"
						placeholder="Meta Keywords"
						row={5}
						required={true}
						error={errors?.meta_keywords}
					/>

					<Textarea
						name="meta_description"
						register={register}
						label="Meta Description"
						type="textarea"
						placeholder="Meta Description"
						row={6}
						required={true}
						error={errors?.meta_description}
					/>

					<Textarea
						name="google_map"
						register={register}
						label="Google Map"
						type="textarea"
						placeholder="Google Map"
						row={2}
						required={true}
						error={errors?.google_map}
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

export default ApplicationForm;
