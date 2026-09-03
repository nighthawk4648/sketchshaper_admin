import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Fileinput from '@/components/ui/Fileinput';
import envConfig from '@/configs/envConfig';
import useSubmit from '@/hooks/useSubmit';
import { useCreateGalleryMutation, useUpdateGalleryMutation } from '@/store/api/app/Gallery/galleryApiSlice';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const GalleryForm = ({ id, data }) => {
	const { isAuth, auth } = useSelector((state) => state.auth);
	const navigate = useNavigate();

	console.log("will be update", data);

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
	} = useSubmit(id, id ? useUpdateGalleryMutation : useCreateGalleryMutation);

	const handleFormSubmit = async (data) => {

		// Manipulate the data as needed
		const formData = new FormData();

		const keys = Object.keys(data);

		keys.forEach((key) => {
			if (['image'].includes(key)) {
				if (data[key]) {
					formData.append('image', data.image[0]);
				} else {
					formData.append('image', data.image);
				}
			} else {
				formData.append(key, data[key]);
			}
		});

		await onSubmit(formData);
	};

	useEffect(() => {
		reset({
			// Reset with existing data if editing
		});
	}, [data]);

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Card title={id ? 'Edit Gallery Image' : 'Upload Gallery Image'}>
				<div className="grid grid-cols-1 gap-5">
					<Fileinput
						selectedFile={watch('image')?.[0]}
						name={'image'}
						defaultUrl={data?.image}
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

export default GalleryForm;
