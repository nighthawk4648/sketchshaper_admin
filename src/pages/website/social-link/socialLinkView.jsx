import Loading from '@/components/Loading';
import { useGetSocialLinkByIdQuery } from '@/store/api/app/website/socialLink/socialLinkApiSlice';
import { useParams } from 'react-router-dom';

const SocialLinkView = () => {
	const { id } = useParams();

	const { data, isFetching, isLoading, isError, error } =
		useGetSocialLinkByIdQuery(id);

	if (isLoading || isFetching) return <Loading />;

	return <div>{/* Here the view code */}</div>;
};

export default SocialLinkView;
