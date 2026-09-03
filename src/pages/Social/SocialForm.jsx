import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Fileinput from '@/components/ui/Fileinput';
import Textarea from '@/components/ui/Textarea';
import Textinput from '@/components/ui/Textinput';
import envConfig from '@/configs/envConfig';
import useSubmit from '@/hooks/useSubmit';
import { useCreateSocialMutation, useUpdateSocialMutation } from '@/store/api/app/Social/socialApiSlice';
import {
    useCreateSliderMutation,
    useUpdateSliderMutation,
} from '@/store/api/app/website/slider/sliderApiSlice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SocialForm = ({ id, data }) => {
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
    } = useSubmit(id, id ? useUpdateSocialMutation : useCreateSocialMutation);

    const handleFormSubmit = async (data) => {
     // Manipulate the data as needed
		const formData = new FormData();

		const keys = Object.keys(data);

		keys.forEach((key) => {
			if (['icon'].includes(key)) {
				if (data[key]) {
					formData.append('icon', data.icon[0]);
				} else {
					formData.append('icon', data.icon);
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
            url: data?.url,
        });
    }, [data]);

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Card title={id ? 'Edit Social' : 'Create New Social'}>
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
                        label="Url"
                        type="text"
                        placeholder="url"
                        name="url"
                        required={true}
                        error={errors?.url}
                    />



                    <Fileinput
                        selectedFile={watch('icon')?.[0]}
                        name={'icon'}
						defaultUrl={data?.icon}

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

export default SocialForm;
