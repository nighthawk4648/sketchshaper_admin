import Loading from '@/components/Loading';
import Error from '@/pages/404';
import { useGetSocialLinkByIdQuery } from '@/store/api/app/website/socialLink/socialLinkApiSlice';
import { useParams } from 'react-router-dom';
import SocialLinkForm from './socialLinkForm';

const SocialLinkEdit = () => {
	const { id } = useParams();

	const { data, isFetching, isLoading, isError, error } =
		useGetSocialLinkByIdQuery(id);

	if (isLoading || isFetching) return <Loading />;

	if (!id) return <Error />;

	return (
		<>
			<SocialLinkForm id={id} data={data?.data} />
		</>
	);
};

export default SocialLinkEdit;
