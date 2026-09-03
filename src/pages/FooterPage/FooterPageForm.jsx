import TextEditor from '@/components/shared/Select/TextEditor';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Textarea from '@/components/ui/Textarea';
import Textinput from '@/components/ui/Textinput';
import useSubmit from '@/hooks/useSubmit';
import {
    useCreateFooterPageMutation,
    useUpdateFooterPageMutation,
} from '@/store/api/app/FooterPage/footerPageApiSlice';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const FooterPageForm = ({ id, data }) => {
	const { isAuth, auth } = useSelector((state) => state.auth);
	const navigate = useNavigate();

	console.log('will be update', data);

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
		id ? useUpdateFooterPageMutation : useCreateFooterPageMutation
	);

	const handleFormSubmit = async (data) => {
		const formData = new FormData();

		const keys = Object.keys(data);

		keys.forEach((key) => {
			if (['cover'].includes(key)) {
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
			title: data?.title,
			short_description: data?.short_description,
			content: data?.content,
			cover: data?.cover || null,
		});
	}, [data]);

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Card title={id ? 'Edit Footer Page' : 'Create New Footer Page'}>
				<div className="grid grid-cols-1 gap-5">
					<Textinput
						register={register}
						label="Title"
						type="text"
						placeholder="Title"
						name="title"
						required={true}
						error={errors?.title}
					/>

					{/* 
                    <Textinput
                        register={register}
                        label="Slug"
                        type="text"
                        placeholder="Slug"
                        name="slug"
                        required={true}
                        error={errors?.slug}
                    /> */}

					<Textarea
						name="short_description"
						register={register}
						label="Short Description"
						type="textarea"
						placeholder="Sub-Category short_description"
						row={6}
						required={true}
						error={errors?.short_description}
					/>

					{/* <Fileinput
                        selectedFile={watch('cover')?.[0]}
                        name={'cover'}
                        defaultUrl={data?.cover}
                        preview={true}
                        control={control}
                    /> */}

					<TextEditor
						name="content"
						errors={errors}
						control={control}
						required={false}
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

export default FooterPageForm;
