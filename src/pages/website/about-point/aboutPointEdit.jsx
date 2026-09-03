import Loading from '@/components/Loading';
import Error from '@/pages/404';
import { useGetAboutPointByIdQuery } from '@/store/api/app/website/aboutPoint/aboutPointApiSlice';
import { useParams } from 'react-router-dom';
import AboutPointForm from './aboutPointForm';

const AboutPointEdit = () => {
	const { id } = useParams();

	const { data, isFetching, isLoading, isError, error } =
		useGetAboutPointByIdQuery(id);

	if (isLoading || isFetching) return <Loading />;

	if (!id) return <Error />;

	return (
		<>
			<AboutPointForm id={id} data={data?.data} />
		</>
	);
};

export default AboutPointEdit;
