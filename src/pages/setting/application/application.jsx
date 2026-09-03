import Loading from '@/components/Loading';
import { useParams } from 'react-router-dom';
import ApplicationForm from './applicationForm';
import { useGetApplicationsQuery } from '@/store/api/app/setting/application/applicationApiSlice';

const Application = () => {
	const { id } = useParams();

	const { data, isFetching, isLoading, isError, error } =
		useGetApplicationsQuery();

	if (isLoading || isFetching) return <Loading />;

	// if (!id) return <Error />;

	return (
		<>
			<ApplicationForm data={data?.data} />
		</>
	);
};

export default Application;
