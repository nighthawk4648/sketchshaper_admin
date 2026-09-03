import { useGetFooterPageByIdQuery } from '@/store/api/app/FooterPage/footerPageApiSlice';
import React from 'react';
import { useParams } from 'react-router-dom';
import FooterPageForm from './FooterPageForm';

const FooterPageEdit = () => {

    const {id} = useParams();

    const {data, isLoading} = useGetFooterPageByIdQuery(id)


    return (
        <div>
            <FooterPageForm id={id}  data={data?.data}  />
        </div>
    );
};

export default FooterPageEdit;