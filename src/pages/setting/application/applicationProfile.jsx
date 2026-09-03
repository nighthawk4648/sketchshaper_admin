import PageView from '@/components/shared/PageView/PageView';
import Button from '@/components/ui/Button';
import { useGetApplicationsQuery } from '@/store/api/app/setting/application/applicationApiSlice';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const ApplicationProfile = () => {
    const navigate = useNavigate();

    const handleUpdateProfile = () => {
        navigate('/admin/edit')
    }





    const { data, isLoading, isSuccess } = useGetApplicationsQuery();
    console.log("data:::::", data)

    const items = [
        {
            title: "Name",
            value: data?.data?.name,
        },
        {
            title: "Email",
            value: data?.data?.email,
        },
        {
            title: "Contact Number",
            value: data?.data?.countact_number,
        },
        {
            title: "Address",
            value: data?.data?.address,
        },
        {
            image: "Logo",
            value: data?.data?.photo,

        },
        {
            image: "Footer Logo",
            value: data?.data?.logo,

        },
        {
            title: "Play Store App Link ",
            value: data?.data?.app_link,

        },
        {
            title: "Meta Author",
            value: data?.data?.meta_author,

        },
        {
            title: "Meta Keywords",
            value: data?.data?.meta_keywords,

        },
        {
            title: "Meta Description",
            value: data?.data?.meta_description,

        },
        {
            map: "Google Map",
            value: data?.data?.google_map,

        },
        {
            title: "Action Admin",
            value: data?.data?.details,

        },
    ];

    return (
        <div>
            <div className='md:flex justify-between mb-2 p-5'>
                <h4 className='mb-4'>Application</h4>
                <div onClick={handleUpdateProfile} className=' text-xl p-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer w-[225px]' >Update Application</div>

            </div>

            <div>
                <PageView items={items} />
            </div>
        </div>



    )
}

export default ApplicationProfile