import Loading from '@/components/Loading';
import Error from '@/pages/404';
import { useParams } from 'react-router-dom';
import { useGetNoticeByIdQuery } from '@/store/api/app/Notice/noticeApiSlice';
import NoticeForm from './NoticeForm';

const EditNotice = () => {
    const { id } = useParams();

    const { data, isFetching, isLoading, isError, error } =
        useGetNoticeByIdQuery(id);

    if (isLoading || isFetching) return <Loading />;

    if (!id) return <Error />;

    return (
        <>
            <NoticeForm id={id} data={data?.data} />
        </>
    );
};

export default EditNotice;
