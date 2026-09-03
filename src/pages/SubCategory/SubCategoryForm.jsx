
import SelectCategory from '@/components/shared/Select/SelectCategory';
import TextEditor from '@/components/shared/Select/TextEditor';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Fileinput from '@/components/ui/Fileinput';
import Textarea from '@/components/ui/Textarea';
import Textinput from '@/components/ui/Textinput';
import envConfig from '@/configs/envConfig';
import useSubmit from '@/hooks/useSubmit';
import { useCreateSubCategoryMutation, useUpdateSubCategoryMutation } from '@/store/api/app/SubCategory/subCategoryApiSlice';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SubCategoryForm = ({ id, data }) => {
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
    } = useSubmit(id, id ? useUpdateSubCategoryMutation : useCreateSubCategoryMutation);

    const handleFormSubmit = async (data) => {
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            if (key === 'image') {
                const imageValue = data[key];
                const hasNewImage = imageValue instanceof File
                    || imageValue instanceof Blob
                    || (imageValue && imageValue[0] instanceof File);

                if (hasNewImage) {
                    formData.append('image', imageValue[0] || imageValue);
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
            category_id: data?.category_id,
            meta_title: data?.meta_title,
            meta_description: data?.meta_description,
        });
    }, [data]);

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Card title={id ? 'Edit Sub-Category' : 'Create New Sub-Category'}>
                <div className="grid grid-cols-1 gap-5">
                    <Textinput
                        register={register}
                        label="Name"
                        type="text"
                        placeholder="Sub-Category Name"
                        name="name"
                        required={true}
                        error={errors?.name}
                    />

                    <div>
                        <label htmlFor="" className='text-sm'>Select Category</label>
                        <div className='mt-3'>
                            <SelectCategory
                                control={control}
                                errors={errors}
                                defaultValue={data?.category_id}
                            />
                        </div>
                    </div>

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


                    <Textinput
                        register={register}
                        label="Meta Title"
                        type="text"
                        placeholder="Meta Title"
                        name="meta_title"
                        required={false}
                        error={errors?.meta_title}
                    />

                    <div>
                        <p className='mb-2 text-sm font-semibold'>Meta Description</p>
                        <TextEditor
                            name="meta_description"
                            errors={errors}
                            control={control}
                            required={false}
                        />
                    </div>

                    <Fileinput
                        selectedFile={watch('image')?.[0]}
                        name={'image'}
                        defaultUrl={envConfig.apiImgUrl + data?.image}

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

export default SubCategoryForm;
