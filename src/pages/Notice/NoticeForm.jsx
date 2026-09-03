import SelectPublishFor from '@/components/shared/Select/SelectPublishFor';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Fileinput from '@/components/ui/Fileinput';
import Textarea from '@/components/ui/Textarea';
import Textinput from '@/components/ui/Textinput';
import useSubmit from '@/hooks/useSubmit';
import { useCreateNoticeMutation, useUpdateNoticeMutation } from '@/store/api/app/Notice/noticeApiSlice';
import {
    useCreateSliderMutation,
    useUpdateSliderMutation,
} from '@/store/api/app/website/slider/sliderApiSlice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const NoticeForm = ({ id, data }) => {
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
    } = useSubmit(id, id ? useUpdateNoticeMutation : useCreateNoticeMutation);

    const handleFormSubmit = async (data) => {
        // Manipulate the data as needed


        await onSubmit(data);
    };

    useEffect(() => {
        reset({
            title: data?.title,
            short_details: data?.short_details,
            publish_for: data?.publish_for
        });
    }, [data]);

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Card title={id ? 'Edit Notice' : 'Create New Notice'}>
                <div className="grid grid-cols-1 gap-5">
                    <div>
                        <label className='block capitalize text-sm font-semibold mb-1'>Publish For</label>
                        <SelectPublishFor
                            defaultValue={data?.publish_for}
                            control={control}
                            errors={errors}
                        />
                    </div>
                    <Textinput
                        register={register}
                        label="Title"
                        type="text"
                        placeholder="Notice Title"
                        name="title"
                        required={true}
                        error={errors?.title}
                    />

                    <Textarea
                        name="short_details"
                        register={register}
                        label="Details"
                        type="textarea"
                        placeholder="Notice Details"
                        row={6}
                        required={true}
                        error={errors?.details}
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

export default NoticeForm;
