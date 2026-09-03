import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetSocialByIdQuery } from '@/store/api/app/Social/socialApiSlice';
import SkeletionTable from '@/components/skeleton/Table';
import SocialForm from './SocialForm';

const SocialEdit = () => {
    const {id} = useParams()
    const {data, isLoading} = useGetSocialByIdQuery(id)

    if (isLoading) {
        return <SkeletionTable/>
    }


    return (
        <div>
            <SocialForm  data={data?.data}  id={id} />
        </div>
    );
};

export default SocialEdit;