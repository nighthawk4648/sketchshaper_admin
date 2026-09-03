

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Fileinput from '@/components/ui/Fileinput';
import Textarea from '@/components/ui/Textarea';
import Textinput from '@/components/ui/Textinput';
import envConfig from '@/configs/envConfig';
import useSubmit from '@/hooks/useSubmit';
import { useCreateInnovativeMutation, useUpdateInnovativeMutation } from '@/store/api/app/Innovative/InnovativeAPiSlice';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const InnovativeForm = ({ id, data }) => {
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
    } = useSubmit(id, id ? useUpdateInnovativeMutation : useCreateInnovativeMutation);

    const handleFormSubmit = async (data) => {
        const formData = new FormData();

        const keys = Object.keys(data);

        keys.forEach((key) => {
            if (['bgImg'].includes(key)) {
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
            urlOne: data?.urlOne,
            urlTwo: data?.urlTwo,
            urlThree: data?.urlThree,
            urlFour: data?.urlFour,
        });
    }, [data]);

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Card title={id ? 'Edit Innovative' : 'Create New Innovative'}>
                <div className="grid grid-cols-1 gap-5">
                    <Textinput
                        register={register}
                        label="Title"
                        type="text"
                        placeholder="Innovative Title"
                        name="title"
                        required={true}
                        error={errors?.title}
                    />

                    <Textarea
                        name="short_description"
                        register={register}
                        label="Short Description"
                        type="textarea"
                        placeholder="Innovative short_description"
                        row={6}
                        required={true}
                        error={errors?.short_description}
                    />



                    <Fileinput
                        selectedFile={watch('bgImg')?.[0]}
                        name={'bgImg'}
                        defaultUrl={data?.bgImg}

                        preview={true}
                        control={control}
                        label='Bg Img'
                    />

                    <Textinput
                        register={register}
                        label="Url One"
                        type="text"
                        placeholder="Url One"
                        name="urlOne"
                        required={true}
                        error={errors?.urlOne}
                    />

                    <Textinput
                        register={register}
                        label="Url Two"
                        type="text"
                        placeholder="Url Two"
                        name="urlTwo"
                        required={true}
                        error={errors?.urlTwo}
                    />

                    <Textinput
                        register={register}
                        label="Url Three"
                        type="text"
                        placeholder="Url Three"
                        name="urlThree"
                        required={true}
                        error={errors?.urlThree}
                    />

                    <Textinput
                        register={register}
                        label="Url Four"
                        type="text"
                        placeholder="Url Four"
                        name="urlFour"
                        required={true}
                        error={errors?.urlFour}
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

export default InnovativeForm;
