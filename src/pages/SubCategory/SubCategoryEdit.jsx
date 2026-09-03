import { useGetSubCategoryByIdQuery } from '@/store/api/app/SubCategory/subCategoryApiSlice';
import React from 'react';
import { useParams } from 'react-router-dom';
import SubCategoryForm from './SubCategoryForm';
import SkeletionTable from '@/components/skeleton/Table';

const SubCategoryEdit = () => {

    const { id } = useParams();
    const {data, isLoading } = useGetSubCategoryByIdQuery(id)

    if (isLoading) {
        return <SkeletionTable/>
    }

    return (
        <div>
            <SubCategoryForm  id={id}  data={data?.data} />
            
        </div>
    );
};

export default SubCategoryEdit;