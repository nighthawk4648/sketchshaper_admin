import TextEditor from '@/components/shared/Select/TextEditor';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Fileinput from '@/components/ui/Fileinput';
import Textarea from '@/components/ui/Textarea';
import Textinput from '@/components/ui/Textinput';
import envConfig from '@/configs/envConfig';
import useSubmit from '@/hooks/useSubmit';
import { useCreateBlogsMutation, useUpdateBlogsMutation } from '@/store/api/app/Blogs/BlogsApiSlice';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const BlogsForm = ({ id, data }) => {
    const { isAuth, auth } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    console.log("data", data);

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
    } = useSubmit(id, id ? useUpdateBlogsMutation : useCreateBlogsMutation);

    const handleFormSubmit = async (data) => {
        const formData = new FormData();

        const keys = Object.keys(data);

        keys.forEach((key) => {
            if (['image', 'bgImage'].includes(key)) {
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
            title: data?.title,
            short_description: data?.short_description,
            back_link: data?.back_link,
            paragraph_one: data?.paragraph_one,
            paragraph_two: data?.paragraph_two,
            paragraph_three: data?.paragraph_three

        });
    }, [data]);

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Card title={id ? 'Edit Blog' : 'Create New Blog'}>
                <div className="grid grid-cols-1 gap-5">
                    <Textinput
                        register={register}
                        label="Title"
                        type="text"
                        placeholder=" Title"
                        name="title"
                        required={true}
                        error={errors?.title}
                    />

                    <Textinput
                        register={register}
                        label="Name"
                        type="text"
                        placeholder=" Name"
                        name="name"
                        required={true}
                        error={errors?.name}
                    />


                    <Textarea
                        name="short_description"
                        register={register}
                        label="Short Description"
                        type="textarea"
                        placeholder="Blog short_description"
                        row={6}
                        required={true}
                        error={errors?.short_description}
                    />

                    <div>
                        <p className='text-sm font-semibold mb-2'>Paragraph One </p>
                        <TextEditor
                            name="paragraph_one"
                            errors={errors}
                            control={control}
                            required={false}
                        />
                    </div>

                    <div>
                        <p className='text-sm font-semibold mb-2'>Paragraph Two </p>
                        <TextEditor
                            name="paragraph_two"
                            errors={errors}
                            control={control}
                            required={false}
                        />
                    </div>

                    <div>
                        <p className='text-sm font-semibold mb-2'>Paragraph Three </p>
                        <TextEditor
                            name="paragraph_three"
                            errors={errors}
                            control={control}
                            required={false}
                        />
                    </div>



                    <Textinput
                        register={register}
                        label="Back Link"
                        type="text"
                        placeholder=" Back Link"
                        name="back_link"
                        // required={true}
                        error={errors?.back_link}
                    />


                    <Fileinput
                        selectedFile={watch('image')?.[0]}
                        name={'image'}
                        defaultUrl={data?.image}

                        preview={true}
                        control={control}
                        label="Image"
                    />

                    <Fileinput
                        selectedFile={watch('bgImage')?.[0]}
                        name={'bgImage'}
                        defaultUrl={data?.bgImage}

                        preview={true}
                        control={control}
                        label="BG Image"
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

export default BlogsForm;
