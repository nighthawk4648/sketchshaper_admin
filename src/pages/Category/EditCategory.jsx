import CategoryForm from '@/components/Category/CategoryForm';
import Loading from '@/components/Loading';
import { useGetCategoryByIdQuery } from '@/store/api/app/Category/categoryApiSlice';
import React from 'react';
import { useParams } from 'react-router-dom';

const EditCategory = () => {
    const { id } = useParams();
    console.log("id", id);

    const {data, isLoading}= useGetCategoryByIdQuery(id)

    if (isLoading) {
        return <Loading/>
    }

    console.log("data", data);
    return (
        <div>
            <CategoryForm id={id} data={data?.data} />
            
        </div>
    );
};

export default EditCategory;