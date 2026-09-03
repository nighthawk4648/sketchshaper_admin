import Loading from '@/components/Loading';
import { useGetNoticeByIdQuery } from '@/store/api/app/Notice/noticeApiSlice';
import { useParams } from 'react-router-dom';

const NoticeView = () => {
    const { id } = useParams();

    const { data, isFetching, isLoading, isError, error } =
        useGetNoticeByIdQuery(id);

    if (isLoading || isFetching) return <Loading />;

    return <div>{/* Here the view code */}</div>;
};

export default NoticeView;
