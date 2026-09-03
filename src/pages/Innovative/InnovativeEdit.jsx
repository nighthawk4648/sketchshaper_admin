import Loading from '@/components/Loading';
import React from 'react';
import { useParams } from 'react-router-dom';
import Error from '../404';
import { useGetInnovativeByIdQuery } from '@/store/api/app/Innovative/InnovativeAPiSlice';
import InnovativeForm from './InnovativeForm';

const InnovativeEdit = () => {

    const { id } = useParams();

    const { data, isFetching, isLoading, isError, error } =
        useGetInnovativeByIdQuery(id);

    if (isLoading || isFetching) return <Loading />;

    if (!id) return <Error />;

    return (
        <div>
            <InnovativeForm id={id} data={data?.data} />
        </div>
    );
};

export default InnovativeEdit;