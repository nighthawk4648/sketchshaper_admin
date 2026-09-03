import CustomReactSelect from '@/components/shared/Select/CustomReactSelect';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Fileinput from '@/components/ui/Fileinput';
import Textarea from '@/components/ui/Textarea';
import Textinput from '@/components/ui/Textinput';
import envConfig from '@/configs/envConfig';
import useSubmit from '@/hooks/useSubmit';
import { useCreateAdminUserMutation, useUpdateAdminUserMutation } from '@/store/api/app/setting/admin/adminApiSlice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminForm = ({ id, data }) => {
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
	} = useSubmit(
		id,
		id ? useUpdateAdminUserMutation : useCreateAdminUserMutation
	);

	const handleFormSubmit = async (data) => {
		// Manipulate the data as needed
		const formData = new FormData();

		const keys = Object.keys(data);

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

		id
			? formData.append('updated_admin_id', auth?.user?.user_info?.id)
			: formData.append('created_admin_id', auth?.user?.user_info?.id);

		await onSubmit(formData);
	};

	useEffect(() => {
		reset({
			name: data?.name,
			contact_number: data?.contact_number,
			email: data?.email,
			password: data?.password,
			type: data?.type,
		});
	}, [data]);

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Card title={id ? 'Edit Admin' : 'Create New Admin'}>
				<div className="grid grid-cols-1 gap-5">

					<Textinput
						register={register}
						label="Name"
						type="text"
						placeholder=" Number"
						name="name"
						required={true}
						error={errors?.name}
					/>
					<Textinput
						register={register}
						label="Contact Number"
						type="text"
						placeholder="Contact Number"
						name="contact_number"
						required={true}
						error={errors?.contact_number}
					/>

					<Textinput
						register={register}
						label="Email"
						type="text"
						placeholder="Enter Your Email"
						name="email"
						required={true}
						error={errors?.email}
					/>

					<Textinput
						register={register}
						label="Password"
						type="password"
						placeholder="Password"
						name="password"
						required={true}
						error={errors?.password}
					/>


					<Fileinput
						selectedFile={watch('photo')?.[0]}
						name={'photo'}
						defaultUrl={envConfig.apiImgUrl + data?.photo}
						preview={true}
						control={control}
					/>

					<CustomReactSelect
						name="type"
						label="Type"
						placeholder="Select Admin Type"
						control={control}
						error={errors?.type}
						required={true}
						options={[
							{ value: 1, label: 'Admin' },
							{ value: 2, label: 'Operation' },
							{ value: 3, label: 'Account' },
							{ value: 4, label: 'CS' },
							{ value: 5, label: 'Business Development' },
							{ value: 6, label: 'General User' },
						]}
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

export default AdminForm;
