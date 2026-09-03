import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Fileinput from '@/components/ui/Fileinput';
import Textarea from '@/components/ui/Textarea';
import Textinput from '@/components/ui/Textinput';
import envConfig from '@/configs/envConfig';
import useSubmit from '@/hooks/useSubmit';
import { useCreateSupportedbyMutation, useUpdateSupportedbyMutation } from '@/store/api/app/SupportedBy/supportedByApiSlice';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SupportedByForm = ({ id, data }) => {
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
    } = useSubmit(id, id ? useUpdateSupportedbyMutation : useCreateSupportedbyMutation);

    const handleFormSubmit = async (data) => {
        const formData = new FormData();

        console.log("subMittedData", data)
        // return

        const keys = Object.keys(data);

        keys.forEach((key) => {
            if (['imageOne', 'imageTwo', 'imageThree', 'imageFour', 'imageFive'].includes(key)) {
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
        });
    }, [data]);

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Card title={id ? 'Edit Supported By' : 'Create New Supported By'}>
                <div className="grid grid-cols-1 gap-5">
                    <Textinput
                        register={register}
                        label="Title"
                        type="text"
                        placeholder="Supported By Title"
                        name="title"
                        required={true}
                        error={errors?.title}
                    />

                    <Textarea
                        name="short_description"
                        register={register}
                        label="Short Description"
                        type="textarea"
                        placeholder="Supported By short_description"
                        row={6}
                        required={true}
                        error={errors?.short_description}
                    />

                    <Fileinput
                        selectedFile={watch('imageOne')?.[0]}
                        name={'imageOne'}
                        defaultUrl={data?.imageOne}

                        preview={true}
                        control={control}
                        label="Image One"
                    />

                    <Fileinput
                        selectedFile={watch('imageTwo')?.[0]}
                        name={'imageTwo'}
                        defaultUrl={data?.imageTwo}

                        preview={true}
                        control={control}
                        label="Image Two"
                    />

                    <Fileinput
                        selectedFile={watch('imageThree')?.[0]}
                        name={'imageThree'}
                        defaultUrl={data?.imageThree}

                        preview={true}
                        control={control}
                        label="Image Three"
                    />


                    <Fileinput
                        selectedFile={watch('imageFour')?.[0]}
                        name={'imageFour'}
                        defaultUrl={data?.imageFour}

                        preview={true}
                        control={control}
                        label="Image Four"
                    />

                    <Fileinput
                        selectedFile={watch('imageFive')?.[0]}
                        name={'imageFive'}
                        defaultUrl={data?.imageFive}

                        preview={true}
                        control={control}
                        label="Image Five"
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

export default SupportedByForm;
