import Loading from '@/components/Loading';
import React from 'react';
import { useParams } from 'react-router-dom';
import Error from '../404';
import { useGetSupportedbyByIdQuery } from '@/store/api/app/SupportedBy/supportedByApiSlice';
import SupportedByForm from './SupportedByForm';

const UpdateSupportedBy = () => {

    const { id } = useParams();

	const { data, isFetching, isLoading, isError, error } =
    useGetSupportedbyByIdQuery(id);

	if (isLoading || isFetching) return <Loading />;

	if (!id) return <Error />;

    return (
        <div>
            <SupportedByForm id={id} data={data?.data}  />
        </div>
    );
};

export default UpdateSupportedBy;